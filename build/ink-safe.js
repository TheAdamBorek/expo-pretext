// src/ink-safe.ts
// Pure function to compute italic-safe padding for Text elements.
// No React dependency — usable in FlashList callbacks, loops, non-React code.
import { getNativeModule } from './ExpoPretext';
import { textStyleToFontDescriptor, getFontMetrics } from './font-utils';
import { measureInkBounds } from './ink-width';
import { Platform } from 'react-native';
const ZERO_PADDING = {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
};
const ZERO_RESULT = {
    padding: ZERO_PADDING,
    inkWidth: 0,
    advance: 0,
    inkBounds: { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 },
    isOvershooting: false,
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
export function getInkSafePadding(text, style, options) {
    if (!text)
        return ZERO_RESULT;
    // Fast path: non-italic text almost never overshoots.
    // Also check if the font family name contains "italic" (case-insensitive)
    // to catch custom fonts like "PlayfairDisplay-BoldItalic" where italic is
    // baked into the font file, not the fontStyle property.
    const familyNames = typeof style.fontFamily === 'string'
        ? [style.fontFamily]
        : style.fontFamily;
    const isItalic = style.fontStyle === 'italic' ||
        familyNames.some((name) => /italic|oblique/i.test(name));
    const strict = options?.strict === true;
    if (!isItalic && !strict) {
        const advance = estimateAdvance(text, style);
        return {
            padding: ZERO_PADDING,
            inkWidth: advance,
            advance,
            inkBounds: { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 },
            isOvershooting: false,
        };
    }
    const native = getNativeModule();
    const font = textStyleToFontDescriptor(style);
    // Best path: single native call
    if (native && typeof native.measureInkSafe === 'function') {
        try {
            const r = native.measureInkSafe(text, font);
            return computePadding({ left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height }, r.advance, r.ascender, Math.abs(r.descender));
        }
        catch { }
    }
    // Fallback: existing separate calls
    const inkBounds = measureInkBounds(text, style);
    const metrics = getFontMetrics(style);
    const advance = inkBounds.width > 0
        ? Math.max(inkBounds.right, inkBounds.width - Math.max(0, -inkBounds.left))
        : estimateAdvance(text, style);
    return computePadding(inkBounds, advance, Math.max(0, metrics.ascender), Math.max(0, Math.abs(metrics.descender)));
}
// iOS raster scanning can underestimate ink bounds by up to 1pt due to
// anti-aliasing at the glyph edge. Add a small safety inset on iOS.
const IOS_SAFETY_INSET = Platform.OS === 'ios' ? 1 : 0;
function computePadding(inkBounds, advance, ascender, descender) {
    const paddingLeft = Math.max(0, Math.ceil(-inkBounds.left)) + IOS_SAFETY_INSET;
    const inkRightExtent = Math.max(advance, inkBounds.right);
    const paddingRight = Math.max(0, Math.ceil(inkRightExtent - advance)) + IOS_SAFETY_INSET;
    const paddingTop = Math.max(0, Math.ceil(-inkBounds.top - ascender));
    const paddingBottom = Math.max(0, Math.ceil(inkBounds.bottom - descender)) + IOS_SAFETY_INSET;
    const inkWidth = Math.max(0, Math.ceil(advance + paddingLeft + paddingRight));
    const isOvershooting = paddingLeft > 0 || paddingRight > 0 || paddingTop > 0 || paddingBottom > 0;
    return {
        padding: { paddingLeft, paddingRight, paddingTop, paddingBottom },
        inkWidth,
        advance,
        inkBounds,
        isOvershooting,
    };
}
function estimateAdvance(text, style) {
    return text.length * style.fontSize * 0.55;
}
//# sourceMappingURL=ink-safe.js.map