import { type TextProps, type ViewProps } from 'react-native';
import { type BalanceOptions } from '../text-wrap';
import type { TextStyle } from '../types';
export type BalancedTextProps = Omit<TextProps, 'style'> & {
    /** Text style — must include `fontFamily` and `fontSize`. */
    style: TextStyle;
    /** The full text. A string, not nested `<Text>`. */
    children: string;
    /** Container width for line-fit computation. Required. */
    maxWidth: number;
    /** Options for the balance algorithm (precision, max lines, max iterations). */
    balanceOptions?: BalanceOptions;
    /** Props forwarded to the outer `<View>` wrapper. */
    containerProps?: Omit<ViewProps, 'children'>;
};
/**
 * Balanced-wrap text — equivalent to CSS `text-wrap: balance`.
 *
 * Headlines and subtitles rendered via `<BalancedText>` end up pyramid-
 * shaped instead of greedy-shaped with a lonely last word. Works
 * identically on iOS, Android, and Web.
 *
 * @example
 * ```tsx
 * <BalancedText
 *   style={{ fontFamily: 'Inter', fontSize: 32, lineHeight: 40, fontWeight: '700' }}
 *   maxWidth={containerWidth}
 * >
 *   React Native was missing a great text layout primitive
 * </BalancedText>
 * ```
 */
export declare function BalancedText({ children, style, maxWidth, balanceOptions, containerProps, ...textProps }: BalancedTextProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=BalancedText.d.ts.map