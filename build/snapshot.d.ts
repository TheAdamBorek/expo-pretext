import type { TextStyle, PrepareOptions } from './types';
/**
 * A single entry in a height snapshot.
 */
export type HeightSnapshotEntry = {
    /** Index in the original texts array */
    index: number;
    /** First 40 characters of the text (for identification) */
    textPreview: string;
    /** Predicted height in pixels */
    height: number;
    /** Number of lines */
    lineCount: number;
};
/**
 * A complete height snapshot for a set of texts at a specific style + width.
 */
export type HeightSnapshot = {
    /** Width used for measurement */
    width: number;
    /** Style fingerprint (fontFamily_fontSize_lineHeight) */
    styleKey: string;
    /** Per-text measurements */
    entries: HeightSnapshotEntry[];
    /** Sum of all heights */
    totalHeight: number;
};
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
export declare function buildHeightSnapshot(texts: string[], style: TextStyle, width: number, options?: PrepareOptions): HeightSnapshot;
/**
 * Result of comparing two height snapshots.
 */
export type SnapshotComparison = {
    /** True if snapshots match exactly */
    match: boolean;
    /** Number of entries that differ */
    mismatchCount: number;
    /** Per-entry differences (only mismatches included) */
    mismatches: Array<{
        index: number;
        textPreview: string;
        expectedHeight: number;
        actualHeight: number;
        heightDiff: number;
    }>;
};
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
export declare function compareHeightSnapshots(expected: HeightSnapshot, actual: HeightSnapshot): SnapshotComparison;
//# sourceMappingURL=snapshot.d.ts.map