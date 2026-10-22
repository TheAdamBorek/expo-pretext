import type { PreparedText, PreparedTextWithSegments, LayoutResult, LayoutWithLinesResult } from './types';
export type TextWrapMode = 'default' | 'balance' | 'pretty';
export type BalanceOptions = {
    /**
     * Minimum bisection step in pixels. Smaller = tighter fit at the cost
     * of more layout calls. Default: 1 px.
     */
    precision?: number;
    /**
     * Cap the number of layout iterations. Defensive guard for pathological
     * inputs. Default: 20 (suffices for any container up to 2²⁰ = 1M px).
     */
    maxIterations?: number;
    /**
     * Above this many lines, skip balancing and return the greedy layout.
     * Chrome also caps (~6 lines) because balancing long blocks is expensive
     * and rarely visually useful. Default: 10.
     */
    maxLines?: number;
};
export type PrettyOptions = {
    /**
     * Minimum word count required on the last line. If the greedy layout
     * produces a last line with fewer words, rewrap. Default: 2.
     */
    minLastLineWords?: number;
    /**
     * Tail length (lines) to rebalance when the last line is a widow.
     * Chrome uses 4. Default: 4.
     */
    balanceTailLines?: number;
    /**
     * Inherited from BalanceOptions — min bisection step for the tail
     * rebalance. Default: 1 px.
     */
    precision?: number;
    /**
     * Inherited — max iterations guard. Default: 20.
     */
    maxIterations?: number;
};
/**
 * Compute a balanced layout — find the minimum container width that still
 * fits the text in the same number of lines as the greedy layout, then
 * lay out at that width. The result visibly eliminates the "lonely last
 * word" pattern common in headlines, subtitles, and card titles.
 *
 * Typical cost: 5–8 layout calls per invocation (log₂ of container width).
 * Each layout call is ~0.0002 ms, so end-to-end under 10 µs for realistic
 * headlines.
 *
 * @example
 * ```ts
 * const prepared = prepare(headline, style)
 * const { effectiveWidth, height, lineCount } =
 *   balanceLayout(prepared, containerWidth)
 * // Render a Text with width = effectiveWidth for a pyramidal shape.
 * ```
 */
export declare function balanceLayout(prepared: PreparedText, maxWidth: number, options?: BalanceOptions): LayoutResult & {
    effectiveWidth: number;
};
/**
 * Same as `balanceLayout` but returns per-line ranges (for custom
 * renderers, drop caps, `<SafeText>`-style line-by-line output).
 */
export declare function balanceLayoutWithLines(prepared: PreparedTextWithSegments, maxWidth: number, options?: BalanceOptions): LayoutWithLinesResult & {
    effectiveWidth: number;
};
/**
 * Compute a "pretty" layout — detect a widowed last line (too few words,
 * or far narrower than the rest) and rebalance only the tail so the
 * paragraph doesn't end with a lonely word.
 *
 * Most of the paragraph keeps its greedy layout, keeping the operation
 * cheap on long-form content.
 *
 * @example
 * ```ts
 * const { lines, height, isPrettified } = prettyLayout(prepared, width)
 * ```
 */
export declare function prettyLayout(prepared: PreparedTextWithSegments, maxWidth: number, options?: PrettyOptions): LayoutWithLinesResult & {
    effectiveWidth: number;
    isPrettified: boolean;
};
/**
 * Lay out with a CSS `text-wrap` mode. Pass `'balance'` for headlines,
 * `'pretty'` for long-form paragraphs, `'default'` for the greedy path.
 */
export declare function layoutWithWrap(prepared: PreparedTextWithSegments, maxWidth: number, mode: TextWrapMode, options?: BalanceOptions & PrettyOptions): LayoutWithLinesResult & {
    effectiveWidth: number;
};
//# sourceMappingURL=text-wrap.d.ts.map