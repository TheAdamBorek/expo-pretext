import { jsx as _jsx } from "react/jsx-runtime";
// src/components/BalancedText.tsx
// Drop-in <Text> replacement that applies CSS `text-wrap: balance` semantics
// on every platform (iOS, Android, Web) via line-by-line JS rendering.
//
// Balanced layout eliminates the "lonely last word" pattern common in
// greedy first-fit wrapping — every line in a headline ends up roughly
// the same width, giving a pyramidal shape. Runs in ~log₂ of the container
// width, typically 5–8 layout calls under 10 µs total.
import { useMemo } from 'react';
import { View, Text } from 'react-native';
import { prepareWithSegments } from '../prepare';
import { balanceLayoutWithLines } from '../text-wrap';
import { resolveFontFamily } from '../font-utils';
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
export function BalancedText({ children, style, maxWidth, balanceOptions, containerProps, ...textProps }) {
    const result = useMemo(() => {
        if (!children || maxWidth <= 0)
            return null;
        const prepared = prepareWithSegments(children, style);
        return balanceLayoutWithLines(prepared, maxWidth, balanceOptions);
    }, [
        children,
        maxWidth,
        style.fontFamily,
        style.fontSize,
        style.fontWeight,
        style.fontStyle,
        style.lineHeight,
        style.letterSpacing,
        balanceOptions?.precision,
        balanceOptions?.maxIterations,
        balanceOptions?.maxLines,
    ]);
    const rnStyle = useMemo(() => ({ ...style, fontFamily: resolveFontFamily(style.fontFamily) }), [style]);
    if (!result)
        return null;
    return (_jsx(View, { accessible: true, accessibilityRole: "text", accessibilityLabel: children, style: { width: result.effectiveWidth }, ...containerProps, children: result.lines.map((line, i) => (_jsx(Text, { style: rnStyle, numberOfLines: 1, accessible: false, importantForAccessibility: "no-hide-descendants", ...textProps, children: line.text }, i))) }));
}
//# sourceMappingURL=BalancedText.js.map