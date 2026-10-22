import { type TextProps, type ViewProps } from 'react-native';
import { type PrettyOptions } from '../text-wrap';
import type { TextStyle } from '../types';
export type PrettyTextProps = Omit<TextProps, 'style'> & {
    /** Text style — must include `fontFamily` and `fontSize`. */
    style: TextStyle;
    /** The full text. A string, not nested `<Text>`. */
    children: string;
    /** Container width for line-fit computation. Required. */
    maxWidth: number;
    /** Options for the pretty algorithm (minLastLineWords, precision, etc.). */
    prettyOptions?: PrettyOptions;
    /** Props forwarded to the outer `<View>` wrapper. */
    containerProps?: Omit<ViewProps, 'children'>;
};
/**
 * Widow-free paragraph text — equivalent to CSS `text-wrap: pretty`.
 *
 * Long-form paragraphs rendered via `<PrettyText>` never end with a
 * single-word last line (a "widow"). Most of the paragraph keeps its
 * greedy layout — only the tail is rewrapped.
 *
 * @example
 * ```tsx
 * <PrettyText
 *   style={{ fontFamily: 'Georgia', fontSize: 16, lineHeight: 24 }}
 *   maxWidth={containerWidth}
 * >
 *   {articleParagraph}
 * </PrettyText>
 * ```
 */
export declare function PrettyText({ children, style, maxWidth, prettyOptions, containerProps, ...textProps }: PrettyTextProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=PrettyText.d.ts.map