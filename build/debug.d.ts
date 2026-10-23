/**
 * Result of comparing a predicted text height against the actual rendered height.
 */
export type DebugMeasurement = {
    /** Predicted height from prepare() + layout() */
    predicted: number;
    /** Actual height from onLayout callback */
    actual: number;
    /** Absolute difference in pixels */
    diff: number;
    /** Percent difference relative to predicted */
    diffPercent: number;
    /** Accuracy category: 'exact' (<1px), 'close' (<5%), 'loose' (<15%), 'wrong' (>15%) */
    accuracy: 'exact' | 'close' | 'loose' | 'wrong';
};
/**
 * Compare predicted and actual text heights, categorizing the accuracy.
 *
 * @param predicted - Height predicted by prepare() + layout()
 * @param actual - Height measured by onLayout
 * @returns Debug measurement with diff and accuracy category
 *
 * @example
 * ```ts
 * const measurement = compareDebugMeasurement(120, 122)
 * // { predicted: 120, actual: 122, diff: 2, diffPercent: 1.67, accuracy: 'close' }
 * ```
 */
export declare function compareDebugMeasurement(predicted: number, actual: number): DebugMeasurement;
/**
 * Colors for each accuracy category (hex, suitable for borders).
 */
export declare const DEBUG_ACCURACY_COLORS: {
    readonly exact: "#22c55e";
    readonly close: "#eab308";
    readonly loose: "#f97316";
    readonly wrong: "#ef4444";
};
//# sourceMappingURL=debug.d.ts.map