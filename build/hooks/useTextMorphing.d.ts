import { type TextMorphResult } from '../morphing';
import type { TextStyle } from '../types';
/**
 * React hook for smooth text morphing between two text states.
 *
 * Computes layout for both `fromText` and `toText`, then provides
 * per-line morph data and interpolation functions for animating
 * the transition. Ideal for "Thinking..." → final response in AI chat.
 *
 * @param fromText - Source text state (e.g., "Thinking...", loading placeholder)
 * @param toText - Target text state (e.g., final AI response)
 * @param style - Text style (fontFamily, fontSize, lineHeight, etc.)
 * @param maxWidth - Container width in pixels
 * @returns Morph data with per-line info and height/visibility interpolation
 *
 * @example
 * ```tsx
 * import { useTextMorphing } from 'expo-pretext'
 *
 * function MorphingMessage({ placeholder, finalText, progress }) {
 *   const morph = useTextMorphing(placeholder, finalText, style, width)
 *
 *   return (
 *     <View style={{ height: morph.heightAt(progress) }}>
 *       {morph.lines.map((line, i) => {
 *         const opacity = line.existsInTo ? progress : 1 - progress
 *         const text = progress > 0.5 ? line.toText : line.fromText
 *         return (
 *           <Text key={i} style={{ opacity }}>{text}</Text>
 *         )
 *       })}
 *     </View>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With Reanimated (after v0.6.4 adds Reanimated support)
 * function AnimatedMorph({ from, to }) {
 *   const progress = useSharedValue(0)
 *   const morph = useTextMorphing(from, to, style, width)
 *
 *   useEffect(() => {
 *     progress.value = withTiming(1, { duration: 500 })
 *   }, [to])
 *
 *   const animatedStyle = useAnimatedStyle(() => ({
 *     height: morph.heightAt(progress.value),
 *   }))
 *
 *   return <Animated.View style={animatedStyle}>...</Animated.View>
 * }
 * ```
 */
export declare function useTextMorphing(fromText: string, toText: string, style: TextStyle, maxWidth: number): TextMorphResult;
//# sourceMappingURL=useTextMorphing.d.ts.map