import { type TextProps } from 'react-native';
import type { TextStyle } from '../types';
export type TruncatedTextProps = Omit<TextProps, 'style'> & {
    /** Text style — must include `fontFamily` and `fontSize`. */
    style: TextStyle;
    /** The full text. A string, not nested `<Text>`. */
    children: string;
    /**
     * Maximum number of lines before truncation kicks in. Default: 1.
     */
    maxLines?: number;
    /**
     * Container width for line-fit computation. Typically the width of the
     * parent `<View>` (measure with `onLayout` and pass through).
     */
    maxWidth: number;
    /**
     * Ellipsis character inserted at the truncation point. Default: `…` (U+2026).
     */
    ellipsis?: string;
    /**
     * Truncation mode.
     * - `'tail'` (default) — keep the start, drop the end: "The quick brown…"
     * - `'head'` — drop the start, keep the end: "…over the lazy dog"
     * - `'middle'` — keep both ends: "The quick…the lazy dog"
     */
    mode?: 'tail' | 'head' | 'middle';
    /**
     * Callback fired when truncation state changes. Useful for "Read more"
     * toggles that only show the button when truncation actually happened.
     */
    onTruncate?: (truncated: boolean) => void;
};
/**
 * Truncate a string to fit `maxLines` at `maxWidth` and render it via a
 * plain `<Text>`. Avoids every edge case of RN's built-in `numberOfLines`
 * + `ellipsizeMode` pair.
 *
 * @example
 * ```tsx
 * <TruncatedText
 *   style={{ fontFamily: 'Inter', fontSize: 14 }}
 *   maxWidth={containerWidth}
 *   maxLines={3}
 *   mode="tail"
 * >
 *   {longArticleText}
 * </TruncatedText>
 * ```
 */
export declare function TruncatedText({ children, style, maxLines, maxWidth, ellipsis, mode, onTruncate, ...textProps }: TruncatedTextProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=TruncatedText.d.ts.map