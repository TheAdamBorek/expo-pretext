import { type TextProps } from 'react-native';
import type { TextStyle } from '../types';
export type InkSafeTextProps = Omit<TextProps, 'style'> & {
    /** Text style — must include fontFamily and fontSize */
    style: TextStyle;
    children: string | number | false | null | undefined;
    /**
     * Measure ink bounds for every text, not just italic. Set to `true` on
     * Android 13+ with RN 0.78+ where non-italic descenders can clip. See
     * [RN #49886], [RN #53286], [RN #56402]. Default: `false`.
     */
    strict?: boolean;
};
/**
 * Drop-in `<Text>` replacement that prevents italic/bold text clipping.
 *
 * Automatically measures ink bounds and applies padding so glyphs
 * that extend beyond their advance width are not cut off.
 * Non-italic text renders with zero overhead (no measurement, no padding).
 *
 * For complex children (nested `<Text>`), use `useInkSafeStyle` instead.
 *
 * @example
 * ```tsx
 * import { InkSafeText } from 'expo-pretext'
 *
 * <InkSafeText style={{ fontFamily: 'Georgia', fontSize: 80, fontWeight: 'bold', fontStyle: 'italic' }}>
 *   fly
 * </InkSafeText>
 * ```
 */
export declare function InkSafeText({ children, style, strict, ...textProps }: InkSafeTextProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=InkSafeText.d.ts.map