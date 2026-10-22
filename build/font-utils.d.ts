import type { TextStyle, FontDescriptor } from './types';
/**
 * Pick the first available font from a name or fallback chain.
 *
 * Accepts a single name or an array. System fonts (see `SYSTEM_FONTS`)
 * are always considered available; custom fonts are checked via
 * `expo-font`'s `isLoaded`. If none of the candidates is loaded, falls
 * back to the last entry so that downstream native measurement still
 * gets a concrete string (RN's text renderer does the same).
 *
 * @example
 * ```ts
 * resolveFontFamily('Inter')                     // → 'Inter'
 * resolveFontFamily(['Inter', 'System'])         // → 'Inter' if loaded, else 'System'
 * resolveFontFamily(['NotLoaded1', 'NotLoaded2']) // → 'NotLoaded2' (last entry)
 * ```
 */
export declare function resolveFontFamily(family: string | string[]): string;
export declare function textStyleToFontDescriptor(style: TextStyle): FontDescriptor;
export declare function getFontKey(style: TextStyle): string;
export declare function getLineHeight(style: TextStyle): number;
/**
 * Count code points in a string (surrogate-pair safe).
 * Used to distribute `letterSpacing` across a segment's glyphs.
 */
export declare function codePointCount(s: string): number;
/**
 * Adjust raw segment widths for `letterSpacing`.
 *
 * Mutates `widths` in place, adding `letterSpacing × codePointCount(segment)`
 * to each segment. RN adds `letterSpacing` after every glyph — including
 * the last one on a line (visible as trailing space), so we distribute it
 * across all code points uniformly. The line-breaking engine tolerates
 * the trailing-letterSpacing overhang via `lineFitEpsilon`.
 *
 * This is the only place segment widths get `letterSpacing`. The iOS native
 * module never adds it to segment widths. For `letterSpacing: 0` it measures
 * them without pair kerning, because UIKit draws RN text that way.
 *
 * No-op when `letterSpacing` is 0 or undefined — the common case.
 */
export declare function applyLetterSpacingInPlace(widths: number[], segments: string[], letterSpacing: number | undefined): void;
/**
 * Check whether a font name is loaded (or a built-in system font).
 *
 * Queries `expo-font`'s registry when available; otherwise conservatively
 * returns `true` so non-expo apps don't spam warnings.
 */
export declare function isFontLoaded(fontFamily: string): boolean;
/**
 * Public alias of `isFontLoaded` — useful at app-startup boundaries.
 *
 * Accepts a single name or a fallback chain. For a chain, returns `true`
 * if **any** candidate is loaded.
 *
 * @example
 * ```ts
 * if (!validateFont(['Inter', 'System'])) {
 *   console.warn('No usable font — waiting for font load')
 * }
 * ```
 */
export declare function validateFont(family: string | string[]): boolean;
export declare function warnIfFontNotLoaded(style: TextStyle): void;
/**
 * Font metrics from the native text engine.
 */
export type FontMetrics = {
    /** Distance from baseline to top of tallest ascender (positive) */
    ascender: number;
    /** Distance from baseline to bottom of lowest descender (negative) */
    descender: number;
    /** Height of lowercase 'x' character */
    xHeight: number;
    /** Height of uppercase capital letters */
    capHeight: number;
    /** Extra leading between lines (often 0) */
    lineGap: number;
};
/**
 * Get font metrics (ascender, descender, x-height, cap-height) from the native text engine.
 *
 * Returns metrics for the exact font as rendered by iOS TextKit / Android TextPaint.
 * Useful for precise baseline alignment, vertical centering, and custom text decoration.
 *
 * `descender` is negative on every platform (below the baseline). On Android,
 * `xHeight` and `capHeight` are measured from the outline of a reference glyph
 * (`x` / `H`), because `Paint` exposes no equivalent of iOS's `UIFont.xHeight` —
 * expect sub-pixel differences from iOS for the same nominal font.
 *
 * @param style - Text style to get metrics for
 * @returns Native font metrics, or estimates if native module unavailable
 *
 * @example
 * ```ts
 * import { getFontMetrics } from 'expo-pretext'
 *
 * const metrics = getFontMetrics({ fontFamily: 'Inter', fontSize: 16 })
 * console.log(metrics.ascender)  // ~12.8 (positive, above baseline)
 * console.log(metrics.descender) // ~-3.2 (negative, below baseline)
 * console.log(metrics.capHeight) // ~11.5 (height of 'H')
 * ```
 *
 * @example
 * ```tsx
 * // Vertically center an icon with text baseline
 * const metrics = getFontMetrics(style)
 * const iconOffset = metrics.ascender - metrics.capHeight / 2 - iconSize / 2
 * ```
 */
export declare function getFontMetrics(style: TextStyle): FontMetrics;
//# sourceMappingURL=font-utils.d.ts.map