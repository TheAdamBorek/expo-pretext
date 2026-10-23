// Build prepared text handles from pre-analyzed + pre-measured data.
// Extracted from layout.ts — contains the factory logic that constructs
// the internal PreparedText structures consumed by the line-breaking engine.
import { computeSegmentLevels } from './bidi';
import { canContinueKeepAllTextRun, endsWithClosingQuote, isCJK, kinsokuEnd, kinsokuStart, leftStickyPunctuation, } from './analysis';
import { getEngineProfile } from './engine-profile';
let sharedGraphemeSegmenter = null;
export function getSharedGraphemeSegmenter() {
    if (sharedGraphemeSegmenter === null) {
        if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
            sharedGraphemeSegmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
        }
        else {
            // Fallback: split on code points via spread operator.
            // This handles most cases correctly (including astral plane),
            // but may not perfectly handle complex grapheme clusters (ZWJ emoji).
            sharedGraphemeSegmenter = {
                segment(text) {
                    const chars = [...text];
                    let idx = 0;
                    return chars.map(ch => {
                        const entry = { segment: ch, index: idx };
                        idx += ch.length;
                        return entry;
                    });
                },
            };
        }
    }
    return sharedGraphemeSegmenter;
}
export function clearGraphemeSegmenter() {
    sharedGraphemeSegmenter = null;
}
function createEmptyPrepared(includeSegments, style) {
    const base = {
        widths: [],
        lineEndFitAdvances: [],
        lineEndPaintAdvances: [],
        kinds: [],
        simpleLineWalkFastPath: true,
        segLevels: null,
        breakableFitAdvances: [],
        discretionaryHyphenWidth: 0,
        tabStopAdvance: 0,
        chunks: [],
        style,
    };
    if (includeSegments) {
        return { ...base, segments: [] };
    }
    return base;
}
function buildBaseCjkUnits(segText, engineProfile) {
    const units = [];
    let unitParts = [];
    let unitStart = 0;
    let unitContainsCJK = false;
    let unitEndsWithClosingQuote = false;
    let unitIsSingleKinsokuEnd = false;
    function pushUnit() {
        if (unitParts.length === 0)
            return;
        units.push({
            text: unitParts.length === 1 ? unitParts[0] : unitParts.join(''),
            start: unitStart,
        });
        unitParts = [];
        unitContainsCJK = false;
        unitEndsWithClosingQuote = false;
        unitIsSingleKinsokuEnd = false;
    }
    function startUnit(grapheme, start, graphemeContainsCJK) {
        unitParts = [grapheme];
        unitStart = start;
        unitContainsCJK = graphemeContainsCJK;
        unitEndsWithClosingQuote = endsWithClosingQuote(grapheme);
        unitIsSingleKinsokuEnd = kinsokuEnd.has(grapheme);
    }
    function appendToUnit(grapheme, graphemeContainsCJK) {
        unitParts.push(grapheme);
        unitContainsCJK = unitContainsCJK || graphemeContainsCJK;
        const graphemeEndsWithClosingQuote = endsWithClosingQuote(grapheme);
        if (grapheme.length === 1 && leftStickyPunctuation.has(grapheme)) {
            unitEndsWithClosingQuote = unitEndsWithClosingQuote || graphemeEndsWithClosingQuote;
        }
        else {
            unitEndsWithClosingQuote = graphemeEndsWithClosingQuote;
        }
        unitIsSingleKinsokuEnd = false;
    }
    for (const gs of getSharedGraphemeSegmenter().segment(segText)) {
        const grapheme = gs.segment;
        const graphemeContainsCJK = isCJK(grapheme);
        if (unitParts.length === 0) {
            startUnit(grapheme, gs.index, graphemeContainsCJK);
            continue;
        }
        if (unitIsSingleKinsokuEnd ||
            kinsokuStart.has(grapheme) ||
            leftStickyPunctuation.has(grapheme) ||
            (engineProfile.carryCJKAfterClosingQuote &&
                graphemeContainsCJK &&
                unitEndsWithClosingQuote)) {
            appendToUnit(grapheme, graphemeContainsCJK);
            continue;
        }
        if (!unitContainsCJK && !graphemeContainsCJK) {
            appendToUnit(grapheme, graphemeContainsCJK);
            continue;
        }
        pushUnit();
        startUnit(grapheme, gs.index, graphemeContainsCJK);
    }
    pushUnit();
    return units;
}
function mergeKeepAllTextUnits(segText, units, breakAfterPunctuation) {
    if (units.length <= 1)
        return units;
    const merged = [];
    let groupStart = -1;
    let groupContainsCJK = false;
    function pushMergedUnit(start, end) {
        const sourceStart = units[start].start;
        const sourceEnd = end < units.length ? units[end].start : segText.length;
        merged.push({
            text: segText.slice(sourceStart, sourceEnd),
            start: sourceStart,
        });
    }
    function flushGroup(end) {
        if (groupStart < 0)
            return;
        if (groupContainsCJK) {
            if (groupStart + 1 === end) {
                merged.push(units[groupStart]);
            }
            else {
                pushMergedUnit(groupStart, end);
            }
        }
        else {
            for (let i = groupStart; i < end; i++)
                merged.push(units[i]);
        }
        groupStart = -1;
        groupContainsCJK = false;
    }
    for (let i = 0; i < units.length; i++) {
        const unit = units[i];
        if (groupStart >= 0 &&
            !canContinueKeepAllTextRun(units[i - 1].text, breakAfterPunctuation)) {
            flushGroup(i);
        }
        if (groupStart < 0)
            groupStart = i;
        groupContainsCJK = groupContainsCJK || isCJK(unit.text);
    }
    flushGroup(units.length);
    return merged;
}
// Distinct key lengths of a width map, longest first. Cached per map so the
// decomposition below stays cheap across the many lookups in one build.
const widthMapKeyLengths = new WeakMap();
function getWidthMapKeyLengths(widthMap) {
    let lengths = widthMapKeyLengths.get(widthMap);
    if (lengths === undefined) {
        const seen = new Set();
        for (const key of widthMap.keys()) {
            if (key.length > 0)
                seen.add(key.length);
        }
        lengths = Array.from(seen).sort((a, b) => b - a);
        widthMapKeyLengths.set(widthMap, lengths);
    }
    return lengths;
}
// Rebuild a merged segment's width by splitting it back into the measured
// pieces it was concatenated from.
//
// `analyzeText()` merges adjacent native segments (sentence-final punctuation,
// URL runs, numeric runs, no-space symbol chains, …), but the width map is
// keyed by the *pre-merge* segment text, so the merged text is never a key.
// Left unhandled that scored those segments as zero-width — a sentence-final
// `"dog."` cost 31px of line budget on Android — and the engine packed far too
// much onto each line.
//
// Longest-prefix decomposition reconstructs them: `"dog."` → `"dog"` + `"."`.
// Returns null when the text cannot be fully decomposed, so callers keep their
// existing approximation.
function decomposeWidth(text, widthMap) {
    const lengths = getWidthMapKeyLengths(widthMap);
    if (lengths.length === 0)
        return null;
    let total = 0;
    let i = 0;
    outer: while (i < text.length) {
        const remaining = text.length - i;
        for (const len of lengths) {
            if (len > remaining)
                continue;
            const w = widthMap.get(text.slice(i, i + len));
            if (w !== undefined) {
                total += w;
                i += len;
                continue outer;
            }
        }
        return null;
    }
    return total;
}
// Look up width of a sub-segment from the pre-measured width map.
function lookupWidth(text, widthMap, parentText, parentWidth) {
    const cached = widthMap.get(text);
    if (cached !== undefined)
        return cached;
    const decomposed = decomposeWidth(text, widthMap);
    if (decomposed !== null)
        return decomposed;
    if (parentText.length > 0 && parentWidth > 0) {
        return (text.length / parentText.length) * parentWidth;
    }
    return 0;
}
// Get grapheme widths for a text segment by splitting it and looking up
// individual grapheme widths from the width map, falling back to equal
// distribution from the total width.
function getGraphemeWidthsFromMap(text, totalWidth, widthMap) {
    const graphemeSegmenter = getSharedGraphemeSegmenter();
    const graphemes = [];
    for (const gs of graphemeSegmenter.segment(text)) {
        graphemes.push(gs.segment);
    }
    if (graphemes.length <= 1)
        return [totalWidth];
    const widths = [];
    let knownTotal = 0;
    let unknownCount = 0;
    for (const g of graphemes) {
        const w = widthMap.get(g);
        if (w !== undefined) {
            widths.push(w);
            knownTotal += w;
        }
        else {
            widths.push(-1);
            unknownCount++;
        }
    }
    if (unknownCount > 0) {
        const remaining = Math.max(0, totalWidth - knownTotal);
        const perUnknown = remaining / unknownCount;
        for (let i = 0; i < widths.length; i++) {
            if (widths[i] < 0)
                widths[i] = perUnknown;
        }
    }
    return widths;
}
// Build cumulative prefix widths from per-grapheme widths.
function buildPrefixWidths(graphemeWidths) {
    const prefixWidths = new Array(graphemeWidths.length);
    let sum = 0;
    for (let i = 0; i < graphemeWidths.length; i++) {
        sum += graphemeWidths[i];
        prefixWidths[i] = sum;
    }
    return prefixWidths;
}
function mapAnalysisChunksToPreparedChunks(chunks, preparedStartByAnalysisIndex, preparedEndSegmentIndex) {
    const preparedChunks = [];
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const startSegmentIndex = chunk.startSegmentIndex < preparedStartByAnalysisIndex.length
            ? preparedStartByAnalysisIndex[chunk.startSegmentIndex]
            : preparedEndSegmentIndex;
        const endSegmentIndex = chunk.endSegmentIndex < preparedStartByAnalysisIndex.length
            ? preparedStartByAnalysisIndex[chunk.endSegmentIndex]
            : preparedEndSegmentIndex;
        const consumedEndSegmentIndex = chunk.consumedEndSegmentIndex < preparedStartByAnalysisIndex.length
            ? preparedStartByAnalysisIndex[chunk.consumedEndSegmentIndex]
            : preparedEndSegmentIndex;
        preparedChunks.push({
            startSegmentIndex,
            endSegmentIndex,
            consumedEndSegmentIndex,
        });
    }
    return preparedChunks;
}
// --- Build prepared handles from pre-measured data ---
function buildFromAnalysis(analysis, widthMap, includeSegments, wordBreak, style) {
    const engineProfile = getEngineProfile();
    const discretionaryHyphenWidth = widthMap.get('-') ?? (widthMap.get(' ') ?? 0) * 0.6;
    const spaceWidth = widthMap.get(' ') ?? 0;
    const tabStopAdvance = spaceWidth * 8;
    if (analysis.len === 0)
        return createEmptyPrepared(includeSegments, style);
    const widths = [];
    const lineEndFitAdvances = [];
    const lineEndPaintAdvances = [];
    const kinds = [];
    let simpleLineWalkFastPath = analysis.chunks.length <= 1;
    const segStarts = includeSegments ? [] : null;
    const breakableFitAdvances = [];
    const segments = includeSegments ? [] : null;
    const preparedStartByAnalysisIndex = Array.from({ length: analysis.len });
    function pushSegment(text, width, lineEndFitAdvance, lineEndPaintAdvance, kind, start, breakableFitAdvance) {
        if (kind !== 'text' && kind !== 'space' && kind !== 'zero-width-break') {
            simpleLineWalkFastPath = false;
        }
        widths.push(width);
        lineEndFitAdvances.push(lineEndFitAdvance);
        lineEndPaintAdvances.push(lineEndPaintAdvance);
        kinds.push(kind);
        segStarts?.push(start);
        breakableFitAdvances.push(breakableFitAdvance);
        if (segments !== null)
            segments.push(text);
    }
    function pushTextSegment(text, kind, start, wordLike, allowOverflowBreaks, parentText, parentWidth) {
        const width = lookupWidth(text, widthMap, parentText, parentWidth);
        const lineEndFitAdvance = kind === 'space' || kind === 'preserved-space' || kind === 'zero-width-break'
            ? 0
            : width;
        const lineEndPaintAdvance = kind === 'space' || kind === 'zero-width-break'
            ? 0
            : width;
        if (allowOverflowBreaks && wordLike && text.length > 1) {
            const fitAdvances = getGraphemeWidthsFromMap(text, width, widthMap);
            pushSegment(text, width, lineEndFitAdvance, lineEndPaintAdvance, kind, start, fitAdvances);
            return;
        }
        pushSegment(text, width, lineEndFitAdvance, lineEndPaintAdvance, kind, start, null);
    }
    for (let mi = 0; mi < analysis.len; mi++) {
        preparedStartByAnalysisIndex[mi] = widths.length;
        const segText = analysis.texts[mi];
        const segWordLike = analysis.isWordLike[mi];
        const segKind = analysis.kinds[mi];
        const segStart = analysis.starts[mi];
        if (segKind === 'soft-hyphen') {
            pushSegment(segText, 0, discretionaryHyphenWidth, discretionaryHyphenWidth, segKind, segStart, null);
            continue;
        }
        if (segKind === 'hard-break') {
            pushSegment(segText, 0, 0, 0, segKind, segStart, null);
            continue;
        }
        if (segKind === 'tab') {
            pushSegment(segText, 0, 0, 0, segKind, segStart, null);
            continue;
        }
        const containsCJK = isCJK(segText);
        if (segKind === 'text' && containsCJK) {
            // segText may be a merged analysis segment (e.g. "景象。"), which is never
            // a width-map key — the map holds the pre-merge native segments. Fall back
            // to decomposition, or every CJK unit below inherits a zero-width parent.
            const parentWidth = widthMap.get(segText) ?? decomposeWidth(segText, widthMap) ?? 0;
            const baseUnits = buildBaseCjkUnits(segText, engineProfile);
            const measuredUnits = wordBreak === 'keep-all'
                ? mergeKeepAllTextUnits(segText, baseUnits, engineProfile.breakKeepAllAfterPunctuation ?? true)
                : baseUnits;
            for (let i = 0; i < measuredUnits.length; i++) {
                const unit = measuredUnits[i];
                pushTextSegment(unit.text, 'text', segStart + unit.start, segWordLike, wordBreak === 'keep-all' || !isCJK(unit.text), segText, parentWidth);
            }
            continue;
        }
        pushTextSegment(segText, segKind, segStart, segWordLike, true, segText, 0);
    }
    const chunks = mapAnalysisChunksToPreparedChunks(analysis.chunks, preparedStartByAnalysisIndex, widths.length);
    const segLevels = segStarts === null ? null : computeSegmentLevels(analysis.normalized, segStarts);
    const core = {
        widths,
        lineEndFitAdvances,
        lineEndPaintAdvances,
        kinds,
        simpleLineWalkFastPath,
        segLevels,
        breakableFitAdvances,
        discretionaryHyphenWidth,
        tabStopAdvance,
        chunks,
        style,
    };
    if (segments !== null) {
        return { ...core, segments };
    }
    return core;
}
// --- Public build functions (called by prepare.ts) ---
export function buildPreparedText(analysis, widthMap, style, options) {
    const wordBreak = options?.wordBreak ?? 'normal';
    return buildFromAnalysis(analysis, widthMap, false, wordBreak, style);
}
export function buildPreparedTextWithSegments(analysis, widthMap, style, options) {
    const wordBreak = options?.wordBreak ?? 'normal';
    return buildFromAnalysis(analysis, widthMap, true, wordBreak, style);
}
//# sourceMappingURL=build.js.map