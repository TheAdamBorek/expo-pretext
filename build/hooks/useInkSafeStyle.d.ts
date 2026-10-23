import { type InkSafeOptions } from '../ink-safe';
import type { TextStyle, InkBounds } from '../types';
type InkSafeStyleResult = {
    /** Base style merged with ink-safe padding — apply directly to <Text> */
    style: TextStyle & {
        paddingLeft: number;
        paddingRight: number;
        paddingTop: number;
        paddingBottom: number;
    };
    /** Total width including ink overshoot */
    inkWidth: number;
    /** True if text overshoots advance width */
    isOvershooting: boolean;
    /** Raw ink bounds (for advanced use) */
    inkBounds: InkBounds;
};
/**
 * Returns a merged text style with ink-safe padding.
 *
 * Use this when you need the ink width for container sizing.
 * For simple drop-in usage, prefer `<InkSafeText>` instead.
 *
 * @param text - The text string to measure
 * @param style - TextStyle to augment with padding
 * @returns Merged style, ink width, overshoot flag, and ink bounds
 *
 * @example
 * ```tsx
 * const { style: safeStyle, inkWidth } = useInkSafeStyle('fly', baseStyle)
 *
 * <View style={{ width: inkWidth, overflow: 'hidden' }}>
 *   <Text style={safeStyle} numberOfLines={1}>fly</Text>
 * </View>
 * ```
 */
export declare function useInkSafeStyle(text: string, style: TextStyle, options?: InkSafeOptions): InkSafeStyleResult;
export {};
//# sourceMappingURL=useInkSafeStyle.d.ts.map