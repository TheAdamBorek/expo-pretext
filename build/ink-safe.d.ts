import type { TextStyle, InkSafeResult } from './types';
/**
 * Options for `getInkSafePadding` / `<InkSafeText>`.
 */
export type InkSafeOptions = {
    /**
     * When `true`, measure ink bounds for **every** text (not only italic).
     *
     * Useful when:
     * - Android 13+ / RN 0.78+ clips descenders (`y`, `g`, `p`, `ж`, …)
     *   even on non-italic text ([RN #49886], [RN #53286], [RN #56402]).
     * - Fonts have unusual ascender/descender reach vs. advertised metrics.
     * - Strict accessibility or design review requires pixel-exact fit.
     *
     * Defaults to `false` — non-italic text short-circuits with zero padding,
     * which is the cheap common case that matches RN's `<Text>` rendering.
     */
    strict?: boolean;
};
/**
 * Compute safe padding for a text string so glyphs are not clipped at
 * container boundaries.
 *
 * Default mode (backward-compatible): italic/oblique text gets a full ink
 * measurement; non-italic text returns zero padding with no native calls.
 *
 * Strict mode (`{ strict: true }`): every text is measured. Use on
 * Android 13+ with RN 0.78+ where descender clipping ([RN #49886],
 * [RN #53286], [RN #56402]) affects non-italic text too.
 *
 * @example
 * ```ts
 * // Italic-safe (default)
 * const a = getInkSafePadding('fly', {
 *   fontFamily: 'Georgia', fontSize: 80, fontWeight: 'bold', fontStyle: 'italic',
 * })
 *
 * // Strict: pad even non-italic text with real descenders
 * const b = getInkSafePadding('typography', { fontFamily: 'Inter', fontSize: 16 }, { strict: true })
 * ```
 */
export declare function getInkSafePadding(text: string, style: TextStyle, options?: InkSafeOptions): InkSafeResult;
//# sourceMappingURL=ink-safe.d.ts.map