// src/snapshot.ts
// Snapshot testing utilities for CI regression detection.
// Computes deterministic height snapshots that can be stored and compared.
import { prepare } from './prepare';
import { layout } from './layout';
/**
 * Build a height snapshot for a set of texts.
 *
 * Use this in CI tests to detect regressions in text measurement accuracy.
 * Store the snapshot on disk, then compare against new snapshots on each release.
 *
 * @param texts - Array of text strings to measure
 * @param style - Text style
 * @param width - Container width in pixels
 * @param options - Optional prepare options
 * @returns Deterministic snapshot of all heights
 *
 * @example
 * ```ts
 * import { buildHeightSnapshot } from 'expo-pretext'
 *
 * const texts = ['Hello', 'World', 'Longer message here']
 * const style = { fontFamily: 'Inter', fontSize: 16, lineHeight: 24 }
 * const snapshot = buildHeightSnapshot(texts, style, 300)
 *
 * // Store or compare: JSON.stringify(snapshot) is stable for equal inputs
 * ```
 */
export function buildHeightSnapshot(texts, style, width, options) {
    const styleKey = `${style.fontFamily}_${style.fontSize}_${style.lineHeight ?? 'auto'}`;
    const entries = [];
    let totalHeight = 0;
    for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        const prepared = prepare(text, style, options);
        const result = layout(prepared, width);
        entries.push({
            index: i,
            textPreview: text.slice(0, 40),
            height: result.height,
            lineCount: result.lineCount,
        });
        totalHeight += result.height;
    }
    return { width, styleKey, entries, totalHeight };
}
/**
 * Compare two height snapshots and return a detailed comparison.
 *
 * Use this in tests to detect when text heights drift between runs:
 *
 * ```ts
 * const baseline = JSON.parse(readFileSync('snapshot.json', 'utf-8'))
 * const current = buildHeightSnapshot(texts, style, width)
 * const comparison = compareHeightSnapshots(baseline, current)
 *
 * if (!comparison.match) {
 *   console.error(`Height regression: ${comparison.mismatchCount} mismatches`)
 *   comparison.mismatches.forEach(m => console.error(m))
 *   throw new Error('Height snapshot mismatch')
 * }
 * ```
 *
 * @param expected - Baseline snapshot (from previous run)
 * @param actual - Current snapshot to compare against baseline
 * @returns Comparison result with mismatch details
 */
export function compareHeightSnapshots(expected, actual) {
    const mismatches = [];
    // Check if the snapshots are comparable
    if (expected.width !== actual.width || expected.styleKey !== actual.styleKey) {
        return {
            match: false,
            mismatchCount: Math.max(expected.entries.length, actual.entries.length),
            mismatches: [],
        };
    }
    const maxLen = Math.max(expected.entries.length, actual.entries.length);
    for (let i = 0; i < maxLen; i++) {
        const exp = expected.entries[i];
        const act = actual.entries[i];
        if (!exp || !act || exp.height !== act.height) {
            mismatches.push({
                index: i,
                textPreview: act?.textPreview ?? exp?.textPreview ?? '',
                expectedHeight: exp?.height ?? 0,
                actualHeight: act?.height ?? 0,
                heightDiff: Math.abs((act?.height ?? 0) - (exp?.height ?? 0)),
            });
        }
    }
    return {
        match: mismatches.length === 0,
        mismatchCount: mismatches.length,
        mismatches,
    };
}
//# sourceMappingURL=snapshot.js.map