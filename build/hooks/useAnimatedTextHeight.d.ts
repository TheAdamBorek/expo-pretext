import { type SharedValue, type WithTimingConfig, type WithSpringConfig } from 'react-native-reanimated';
import type { TextStyle, PrepareOptions } from '../types';
/**
 * Animation configuration for height transitions.
 * Pass either `timing` or `spring` config — not both.
 */
export type HeightAnimationConfig = {
    /** Use timing-based animation (default: duration 200ms) */
    timing?: WithTimingConfig;
    /** Use spring-based animation (overrides timing if both set) */
    spring?: WithSpringConfig;
};
/**
 * React hook for smooth animated text height transitions using Reanimated.
 *
 * Computes text height via `prepare()` + `layout()` (pure arithmetic, ~0.0002ms),
 * then animates the SharedValue to the new height using Reanimated's `withTiming`
 * or `withSpring`. The SharedValue can be used directly in `useAnimatedStyle`.
 *
 * Requires `react-native-reanimated` >= 3.0.0.
 *
 * @param text - Text content (can change over time, e.g., streaming AI response)
 * @param style - Text style (fontFamily, fontSize, lineHeight, etc.)
 * @param maxWidth - Container width in pixels
 * @param animConfig - Optional animation config (timing or spring)
 * @returns Reanimated SharedValue that animates to the current text height
 *
 * @example
 * ```tsx
 * import { useAnimatedTextHeight } from 'expo-pretext'
 * import Animated, { useAnimatedStyle } from 'react-native-reanimated'
 *
 * function ChatBubble({ text }) {
 *   const animatedHeight = useAnimatedTextHeight(text, {
 *     fontFamily: 'Inter',
 *     fontSize: 16,
 *     lineHeight: 24,
 *   }, bubbleWidth)
 *
 *   const containerStyle = useAnimatedStyle(() => ({
 *     height: animatedHeight.value,
 *   }))
 *
 *   return (
 *     <Animated.View style={containerStyle}>
 *       <Text>{text}</Text>
 *     </Animated.View>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With spring animation for bouncy transitions
 * const animatedHeight = useAnimatedTextHeight(text, style, width, {
 *   spring: { damping: 15, stiffness: 150 },
 * })
 * ```
 */
export declare function useAnimatedTextHeight(text: string, style: TextStyle, maxWidth: number, animConfig?: HeightAnimationConfig, options?: PrepareOptions): SharedValue<number>;
//# sourceMappingURL=useAnimatedTextHeight.d.ts.map