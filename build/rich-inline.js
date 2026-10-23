// Ported from chenglou/pretext src/inline-flow.ts
//
// Experimental sidecar for mixed inline runs under `white-space: normal`.
// It keeps the core layout API low-level while taking over the boring shared
// work that rich inline demos kept reimplementing in userland:
// - collapsed boundary whitespace across item boundaries
// - atomic inline boxes like pills
// - per-item extra horizontal chrome such as padding/borders
//
// Modifications from the original Pretext version:
// - InlineFlowItem.font (Canvas font shorthand) -> InlineFlowItem.style (TextStyle)
// - InlineFlowItem.break ('normal' | 'never') -> InlineFlowItem.atomic (boolean)
//   atomic=true corresponds to break='never'
import { materializeLineRange, measureNaturalWidth, } from './layout';
import { prepareWithSegments } from './prepare';
import { layoutNextLineRange as stepPreparedLineRangeRaw, stepPreparedLineGeometry as stepPreparedLineGeometryRaw, } from './line-break';
// The opaque PreparedTextWithSegments is structurally compatible with
// PreparedLineBreakData at runtime, but TypeScript's branded types hide that.
// Cast through the internal type instead of `any` so the boundary is typed.
const asPrepared = (p) => p;
const stepPreparedLineRange = (prepared, start, maxWidth) => stepPreparedLineRangeRaw(asPrepared(prepared), start, maxWidth);
const stepPreparedLineGeometry = (prepared, start, maxWidth) => stepPreparedLineGeometryRaw(asPrepared(prepared), start, maxWidth);
const COLLAPSIBLE_BOUNDARY_RE = /[ \t\n\f\r]+/;
const LEADING_COLLAPSIBLE_BOUNDARY_RE = /^[ \t\n\f\r]+/;
const TRAILING_COLLAPSIBLE_BOUNDARY_RE = /[ \t\n\f\r]+$/;
const EMPTY_LAYOUT_CURSOR = { segmentIndex: 0, graphemeIndex: 0 };
const FLOW_START_CURSOR = {
    itemIndex: 0,
    segmentIndex: 0,
    graphemeIndex: 0,
};
function getInternalPreparedInlineFlow(prepared) {
    return prepared;
}
function cloneCursor(cursor) {
    return {
        segmentIndex: cursor.segmentIndex,
        graphemeIndex: cursor.graphemeIndex,
    };
}
function isLineStartCursor(cursor) {
    return cursor.segmentIndex === 0 && cursor.graphemeIndex === 0;
}
function getCollapsedSpaceWidth(style, cache) {
    // Cache key derived from the style properties that affect space width
    const key = `${style.fontFamily}|${style.fontSize}|${style.fontWeight ?? '400'}|${style.fontStyle ?? 'normal'}`;
    const cached = cache.get(key);
    if (cached !== undefined)
        return cached;
    const joinedWidth = measureNaturalWidth(prepareWithSegments('A A', style));
    const compactWidth = measureNaturalWidth(prepareWithSegments('AA', style));
    const collapsedWidth = Math.max(0, joinedWidth - compactWidth);
    cache.set(key, collapsedWidth);
    return collapsedWidth;
}
function prepareWholeItemLine(prepared) {
    const line = stepPreparedLineRange(prepared, EMPTY_LAYOUT_CURSOR, Number.POSITIVE_INFINITY);
    if (line === null)
        return null;
    return {
        endGraphemeIndex: line.endGraphemeIndex,
        endSegmentIndex: line.endSegmentIndex,
        width: line.width,
    };
}
function endsInsideFirstSegment(segmentIndex, graphemeIndex) {
    return segmentIndex === 0 && graphemeIndex > 0;
}
export function prepareInlineFlow(items) {
    const preparedItems = [];
    const itemsBySourceItemIndex = Array.from({ length: items.length });
    const collapsedSpaceWidthCache = new Map();
    let pendingGapWidth = 0;
    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const hasLeadingWhitespace = LEADING_COLLAPSIBLE_BOUNDARY_RE.test(item.text);
        const hasTrailingWhitespace = TRAILING_COLLAPSIBLE_BOUNDARY_RE.test(item.text);
        const trimmedText = item.text
            .replace(LEADING_COLLAPSIBLE_BOUNDARY_RE, '')
            .replace(TRAILING_COLLAPSIBLE_BOUNDARY_RE, '');
        if (trimmedText.length === 0) {
            if (COLLAPSIBLE_BOUNDARY_RE.test(item.text) && pendingGapWidth === 0) {
                pendingGapWidth = getCollapsedSpaceWidth(item.style, collapsedSpaceWidthCache);
            }
            continue;
        }
        const gapBefore = pendingGapWidth > 0
            ? pendingGapWidth
            : hasLeadingWhitespace
                ? getCollapsedSpaceWidth(item.style, collapsedSpaceWidthCache)
                : 0;
        const prepared = prepareWithSegments(trimmedText, item.style);
        const wholeLine = prepareWholeItemLine(prepared);
        if (wholeLine === null) {
            pendingGapWidth = hasTrailingWhitespace ? getCollapsedSpaceWidth(item.style, collapsedSpaceWidthCache) : 0;
            continue;
        }
        const preparedItem = {
            atomic: item.atomic ?? false,
            endGraphemeIndex: wholeLine.endGraphemeIndex,
            endSegmentIndex: wholeLine.endSegmentIndex,
            extraWidth: item.extraWidth ?? 0,
            gapBefore,
            naturalWidth: wholeLine.width,
            prepared,
            sourceItemIndex: index,
        };
        preparedItems.push(preparedItem);
        itemsBySourceItemIndex[index] = preparedItem;
        pendingGapWidth = hasTrailingWhitespace ? getCollapsedSpaceWidth(item.style, collapsedSpaceWidthCache) : 0;
    }
    return {
        items: preparedItems,
        itemsBySourceItemIndex,
    };
}
function stepInlineFlowLine(flow, maxWidth, cursor, collectFragment) {
    if (flow.items.length === 0 || cursor.itemIndex >= flow.items.length)
        return null;
    const safeWidth = Math.max(1, maxWidth);
    let lineWidth = 0;
    let remainingWidth = safeWidth;
    let itemIndex = cursor.itemIndex;
    const textCursor = {
        segmentIndex: cursor.segmentIndex,
        graphemeIndex: cursor.graphemeIndex,
    };
    lineLoop: while (itemIndex < flow.items.length) {
        const item = flow.items[itemIndex];
        if (!isLineStartCursor(textCursor) &&
            textCursor.segmentIndex === item.endSegmentIndex &&
            textCursor.graphemeIndex === item.endGraphemeIndex) {
            itemIndex++;
            textCursor.segmentIndex = 0;
            textCursor.graphemeIndex = 0;
            continue;
        }
        const gapBefore = lineWidth === 0 ? 0 : item.gapBefore;
        const atItemStart = isLineStartCursor(textCursor);
        if (item.atomic) {
            if (!atItemStart) {
                itemIndex++;
                textCursor.segmentIndex = 0;
                textCursor.graphemeIndex = 0;
                continue;
            }
            const occupiedWidth = item.naturalWidth + item.extraWidth;
            const totalWidth = gapBefore + occupiedWidth;
            if (lineWidth > 0 && totalWidth > remainingWidth)
                break lineLoop;
            collectFragment?.(item, gapBefore, occupiedWidth, cloneCursor(EMPTY_LAYOUT_CURSOR), {
                segmentIndex: item.endSegmentIndex,
                graphemeIndex: item.endGraphemeIndex,
            });
            lineWidth += totalWidth;
            remainingWidth = Math.max(0, safeWidth - lineWidth);
            itemIndex++;
            textCursor.segmentIndex = 0;
            textCursor.graphemeIndex = 0;
            continue;
        }
        const reservedWidth = gapBefore + item.extraWidth;
        if (lineWidth > 0 && reservedWidth >= remainingWidth)
            break lineLoop;
        if (atItemStart) {
            const totalWidth = reservedWidth + item.naturalWidth;
            if (totalWidth <= remainingWidth) {
                collectFragment?.(item, gapBefore, item.naturalWidth + item.extraWidth, cloneCursor(EMPTY_LAYOUT_CURSOR), {
                    segmentIndex: item.endSegmentIndex,
                    graphemeIndex: item.endGraphemeIndex,
                });
                lineWidth += totalWidth;
                remainingWidth = Math.max(0, safeWidth - lineWidth);
                itemIndex++;
                textCursor.segmentIndex = 0;
                textCursor.graphemeIndex = 0;
                continue;
            }
        }
        const availableWidth = Math.max(1, remainingWidth - reservedWidth);
        const line = stepPreparedLineRange(item.prepared, textCursor, availableWidth);
        if (line === null) {
            itemIndex++;
            textCursor.segmentIndex = 0;
            textCursor.graphemeIndex = 0;
            continue;
        }
        if (textCursor.segmentIndex === line.endSegmentIndex &&
            textCursor.graphemeIndex === line.endGraphemeIndex) {
            itemIndex++;
            textCursor.segmentIndex = 0;
            textCursor.graphemeIndex = 0;
            continue;
        }
        // If the only thing we can fit after paying the boundary gap is a partial
        // slice of the item's first segment, prefer wrapping before the item so we
        // keep whole-word-style boundaries when they exist. But once the current
        // line can consume a real breakable unit from the item, stay greedy and
        // keep filling the line.
        if (lineWidth > 0 &&
            atItemStart &&
            gapBefore > 0 &&
            endsInsideFirstSegment(line.endSegmentIndex, line.endGraphemeIndex)) {
            const freshLine = stepPreparedLineRange(item.prepared, EMPTY_LAYOUT_CURSOR, Math.max(1, safeWidth - item.extraWidth));
            if (freshLine !== null &&
                (freshLine.endSegmentIndex > line.endSegmentIndex ||
                    (freshLine.endSegmentIndex === line.endSegmentIndex &&
                        freshLine.endGraphemeIndex > line.endGraphemeIndex))) {
                break lineLoop;
            }
        }
        collectFragment?.(item, gapBefore, line.width + item.extraWidth, cloneCursor(textCursor), {
            segmentIndex: line.endSegmentIndex,
            graphemeIndex: line.endGraphemeIndex,
        });
        lineWidth += gapBefore + line.width + item.extraWidth;
        remainingWidth = Math.max(0, safeWidth - lineWidth);
        if (line.endSegmentIndex === item.endSegmentIndex &&
            line.endGraphemeIndex === item.endGraphemeIndex) {
            itemIndex++;
            textCursor.segmentIndex = 0;
            textCursor.graphemeIndex = 0;
            continue;
        }
        textCursor.segmentIndex = line.endSegmentIndex;
        textCursor.graphemeIndex = line.endGraphemeIndex;
        break;
    }
    if (lineWidth === 0)
        return null;
    cursor.itemIndex = itemIndex;
    cursor.segmentIndex = textCursor.segmentIndex;
    cursor.graphemeIndex = textCursor.graphemeIndex;
    return lineWidth;
}
function stepInlineFlowLineGeometry(flow, maxWidth, cursor) {
    if (flow.items.length === 0 || cursor.itemIndex >= flow.items.length)
        return null;
    const safeWidth = Math.max(1, maxWidth);
    let lineWidth = 0;
    let remainingWidth = safeWidth;
    let itemIndex = cursor.itemIndex;
    lineLoop: while (itemIndex < flow.items.length) {
        const item = flow.items[itemIndex];
        if (!isLineStartCursor(cursor) &&
            cursor.segmentIndex === item.endSegmentIndex &&
            cursor.graphemeIndex === item.endGraphemeIndex) {
            itemIndex++;
            cursor.segmentIndex = 0;
            cursor.graphemeIndex = 0;
            continue;
        }
        const gapBefore = lineWidth === 0 ? 0 : item.gapBefore;
        const atItemStart = isLineStartCursor(cursor);
        if (item.atomic) {
            if (!atItemStart) {
                itemIndex++;
                cursor.segmentIndex = 0;
                cursor.graphemeIndex = 0;
                continue;
            }
            const occupiedWidth = item.naturalWidth + item.extraWidth;
            const totalWidth = gapBefore + occupiedWidth;
            if (lineWidth > 0 && totalWidth > remainingWidth)
                break lineLoop;
            lineWidth += totalWidth;
            remainingWidth = Math.max(0, safeWidth - lineWidth);
            itemIndex++;
            cursor.segmentIndex = 0;
            cursor.graphemeIndex = 0;
            continue;
        }
        const reservedWidth = gapBefore + item.extraWidth;
        if (lineWidth > 0 && reservedWidth >= remainingWidth)
            break lineLoop;
        if (atItemStart) {
            const totalWidth = reservedWidth + item.naturalWidth;
            if (totalWidth <= remainingWidth) {
                lineWidth += totalWidth;
                remainingWidth = Math.max(0, safeWidth - lineWidth);
                itemIndex++;
                cursor.segmentIndex = 0;
                cursor.graphemeIndex = 0;
                continue;
            }
        }
        const availableWidth = Math.max(1, remainingWidth - reservedWidth);
        const lineEnd = {
            segmentIndex: cursor.segmentIndex,
            graphemeIndex: cursor.graphemeIndex,
        };
        const lineWidthForItem = stepPreparedLineGeometry(item.prepared, lineEnd, availableWidth);
        if (lineWidthForItem === null) {
            itemIndex++;
            cursor.segmentIndex = 0;
            cursor.graphemeIndex = 0;
            continue;
        }
        if (cursor.segmentIndex === lineEnd.segmentIndex && cursor.graphemeIndex === lineEnd.graphemeIndex) {
            itemIndex++;
            cursor.segmentIndex = 0;
            cursor.graphemeIndex = 0;
            continue;
        }
        if (lineWidth > 0 &&
            atItemStart &&
            gapBefore > 0 &&
            endsInsideFirstSegment(lineEnd.segmentIndex, lineEnd.graphemeIndex)) {
            const freshLineEnd = {
                segmentIndex: 0,
                graphemeIndex: 0,
            };
            const freshLineWidth = stepPreparedLineGeometry(item.prepared, freshLineEnd, Math.max(1, safeWidth - item.extraWidth));
            if (freshLineWidth !== null &&
                (freshLineEnd.segmentIndex > lineEnd.segmentIndex ||
                    (freshLineEnd.segmentIndex === lineEnd.segmentIndex &&
                        freshLineEnd.graphemeIndex > lineEnd.graphemeIndex))) {
                break lineLoop;
            }
        }
        lineWidth += gapBefore + lineWidthForItem + item.extraWidth;
        remainingWidth = Math.max(0, safeWidth - lineWidth);
        if (lineEnd.segmentIndex === item.endSegmentIndex && lineEnd.graphemeIndex === item.endGraphemeIndex) {
            itemIndex++;
            cursor.segmentIndex = 0;
            cursor.graphemeIndex = 0;
            continue;
        }
        cursor.segmentIndex = lineEnd.segmentIndex;
        cursor.graphemeIndex = lineEnd.graphemeIndex;
        break;
    }
    if (lineWidth === 0)
        return null;
    cursor.itemIndex = itemIndex;
    return lineWidth;
}
export function layoutNextInlineFlowLineRange(prepared, maxWidth, start = FLOW_START_CURSOR) {
    const flow = getInternalPreparedInlineFlow(prepared);
    const end = {
        itemIndex: start.itemIndex,
        segmentIndex: start.segmentIndex,
        graphemeIndex: start.graphemeIndex,
    };
    const fragments = [];
    const width = stepInlineFlowLine(flow, maxWidth, end, (item, gapBefore, occupiedWidth, fragmentStart, fragmentEnd) => {
        fragments.push({
            itemIndex: item.sourceItemIndex,
            gapBefore,
            occupiedWidth,
            start: fragmentStart,
            end: fragmentEnd,
        });
    });
    if (width === null)
        return null;
    return {
        fragments,
        width,
        end,
    };
}
function materializeFragmentText(item, fragment) {
    const line = materializeLineRange(item.prepared, {
        width: fragment.occupiedWidth - item.extraWidth,
        start: fragment.start,
        end: fragment.end,
    });
    return line.text;
}
export function layoutNextInlineFlowLine(prepared, maxWidth, start = FLOW_START_CURSOR) {
    const flow = getInternalPreparedInlineFlow(prepared);
    const line = layoutNextInlineFlowLineRange(prepared, maxWidth, start);
    if (line === null)
        return null;
    return {
        fragments: line.fragments.map(fragment => {
            const item = flow.itemsBySourceItemIndex[fragment.itemIndex];
            if (item === undefined)
                throw new Error('Missing inline-flow item for fragment');
            return {
                ...fragment,
                text: materializeFragmentText(item, fragment),
            };
        }),
        width: line.width,
        end: line.end,
    };
}
export function walkInlineFlowLineRanges(prepared, maxWidth, onLine) {
    let lineCount = 0;
    let cursor = FLOW_START_CURSOR;
    while (true) {
        const line = layoutNextInlineFlowLineRange(prepared, maxWidth, cursor);
        if (line === null)
            return lineCount;
        onLine(line);
        lineCount++;
        cursor = line.end;
    }
}
export function measureInlineFlowGeometry(prepared, maxWidth) {
    const flow = getInternalPreparedInlineFlow(prepared);
    let lineCount = 0;
    let maxLineWidth = 0;
    const cursor = {
        itemIndex: 0,
        segmentIndex: 0,
        graphemeIndex: 0,
    };
    while (true) {
        const lineWidth = stepInlineFlowLineGeometry(flow, maxWidth, cursor);
        if (lineWidth === null) {
            return {
                lineCount,
                maxLineWidth,
            };
        }
        lineCount++;
        if (lineWidth > maxLineWidth)
            maxLineWidth = lineWidth;
    }
}
export function walkInlineFlowLines(prepared, maxWidth, onLine) {
    let lineCount = 0;
    let cursor = FLOW_START_CURSOR;
    while (true) {
        const line = layoutNextInlineFlowLine(prepared, maxWidth, cursor);
        if (line === null)
            return lineCount;
        onLine(line);
        lineCount++;
        cursor = line.end;
    }
}
export function measureInlineFlow(prepared, maxWidth, lineHeight) {
    const { lineCount } = measureInlineFlowGeometry(prepared, maxWidth);
    return {
        lineCount,
        height: lineCount * lineHeight,
    };
}
//# sourceMappingURL=rich-inline.js.map