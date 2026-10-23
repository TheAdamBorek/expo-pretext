import type { TextStyle } from './types';
/**
 * Result of computing text layout at a zoomed font size.
 */
export type ZoomLayoutResult = {
    /** Adjusted font size after applying scale */
    fontSize: number;
    /** Text height at the zoomed font size */
    height: number;
    /** Line count at the zoomed font size */
    lineCount: number;
    /** Adjusted line height (scaled proportionally with fontSize) */
    lineHeight: number;
};
/**
 * Compute text layout at a scaled font size for pinch-to-zoom.
 *
 * Given a base style and a scale factor (from a pinch gesture), computes
 * the new fontSize, lineHeight, and resulting text height. Uses `prepare()`
 * + `layout()` for accurate measurement at every scale level.
 *
 * Since `layout()` runs in ~0.0002ms, this can be called on every gesture
 * frame (120+ times per 16ms frame) without dropping frames.
 *
 * @param text - Text content to measure
 * @param style - Base text style (will be scaled)
 * @param maxWidth - Container width in pixels
 * @param scale - Pinch scale factor (1.0 = no zoom, 2.0 = double size)
 * @param options - Optional: min/max font size clamps
 * @returns Layout result at the zoomed font size
 *
 * @example
 * ```ts
 * import { computeZoomLayout } from 'expo-pretext'
 *
 * // On pinch gesture update:
 * const result = computeZoomLayout(text, baseStyle, width, pinchScale)
 * // result.fontSize = 24 (if base was 16 and scale is 1.5)
 * // result.height = new height at fontSize 24
 * ```
 *
 * @example
 * ```ts
 * // With min/max clamps
 * const result = computeZoomLayout(text, style, width, scale, {
 *   minFontSize: 10,
 *   maxFontSize: 48,
 * })
 * ```
 */
export declare function computeZoomLayout(text: string, style: TextStyle, maxWidth: number, scale: number, options?: {
    minFontSize?: number;
    maxFontSize?: number;
}): ZoomLayoutResult;
//# sourceMappingURL=zoom.d.ts.map