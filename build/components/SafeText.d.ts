import { type TextProps, type ViewProps } from 'react-native';
import type { TextStyle } from '../types';
export type SafeTextProps = Omit<TextProps, 'style'> & {
    /** Text style — must include `fontFamily` and `fontSize`. */
    style: TextStyle;
    /** The full text. A string, not nested `<Text>`. */
    children: string;
    /**
     * Container width for line-fit computation. Required — pass the width
     * you measured with `onLayout` on the parent View.
     */
    maxWidth: number;
    /**
     * Optional cap on rendered lines. Extra lines are dropped (no ellipsis).
     * Use `<TruncatedText>` if you want ellipsis tail/head/middle modes.
     */
    maxLines?: number;
    /**
     * Props forwarded to the outer `<View>` wrapper (styling, testID, etc.).
     */
    containerProps?: Omit<ViewProps, 'children'>;
};
/**
 * Line-by-line rendered Text that bypasses Android wrap/cut-off regressions.
 *
 * Renders every line in its own `<Text>` using line breaks pre-computed by
 * `layoutWithLines`. The wrapper `<View>` carries the accessibility label
 * so screenreaders read the full paragraph as one unit.
 *
 * @example
 * ```tsx
 * function Paragraph({ text, width }: { text: string; width: number }) {
 *   return (
 *     <SafeText
 *       style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: 24 }}
 *       maxWidth={width}
 *     >
 *       {text}
 *     </SafeText>
 *   )
 * }
 * ```
 */
export declare function SafeText({ children, style, maxWidth, maxLines, containerProps, ...textProps }: SafeTextProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SafeText.d.ts.map