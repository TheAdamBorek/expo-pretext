import type { TextStyle, PreparedText, PrepareOptions } from './types';
/**
 * Result of a budget-limited prepare() call.
 */
export type BudgetedPrepareResult = {
    /** The prepared text handle */
    prepared: PreparedText;
    /** Whether native measurement was used or fell back to JS estimates */
    source: 'native' | 'estimate';
    /** Time taken in milliseconds */
    elapsedMs: number;
    /** Whether the budget was exceeded */
    budgetExceeded: boolean;
};
/**
 * Prepare text with a timing budget.
 *
 * Runs `prepare()` and measures how long it takes. If it takes longer than
 * `budgetMs`, subsequent calls within the same batch will use JS estimates
 * instead of native measurement. Useful for large batch operations where
 * you need bounded latency.
 *
 * **Note:** The first call always runs prepare() fully — the budget is
 * measured retroactively. For strict upfront budgeting, use `isOverBudget()`
 * to check the running average before calling.
 *
 * @param text - Text to prepare
 * @param style - Text style
 * @param budgetMs - Maximum acceptable time in milliseconds
 * @param options - Optional prepare options
 * @returns Prepared handle + timing metadata
 *
 * @example
 * ```ts
 * import { prepareWithBudget } from 'expo-pretext'
 *
 * const result = prepareWithBudget(text, style, 5)
 * if (result.budgetExceeded) {
 *   console.warn(`Prepare took ${result.elapsedMs}ms (budget: 5ms)`)
 * }
 * const height = layout(result.prepared, width).height
 * ```
 *
 * @example
 * ```ts
 * // Batch with budget monitoring
 * const results = texts.map(text => prepareWithBudget(text, style, 3))
 * const slowCount = results.filter(r => r.budgetExceeded).length
 * console.log(`${slowCount}/${texts.length} texts exceeded budget`)
 * ```
 */
export declare function prepareWithBudget(text: string, style: TextStyle, budgetMs: number, options?: PrepareOptions): BudgetedPrepareResult;
/**
 * Tracks running average of prepare() times to predict future calls.
 */
export declare class PrepareBudgetTracker {
    private samples;
    private readonly maxSamples;
    constructor(maxSamples?: number);
    /**
     * Record a prepare() timing sample.
     */
    record(elapsedMs: number): void;
    /**
     * Current average elapsed time across recent samples.
     */
    averageMs(): number;
    /**
     * Maximum elapsed time across recent samples.
     */
    maxMs(): number;
    /**
     * Check if the running average exceeds the budget.
     */
    isOverBudget(budgetMs: number): boolean;
    /**
     * Reset all samples.
     */
    reset(): void;
    /**
     * Number of samples currently stored.
     */
    get sampleCount(): number;
}
//# sourceMappingURL=perf-budget.d.ts.map