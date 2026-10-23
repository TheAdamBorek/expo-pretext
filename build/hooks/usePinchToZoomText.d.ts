import { type SharedValue } from 'react-native-reanimated';
import { type ZoomLayoutResult } from '../zoom';
import type { TextStyle } from '../types';
/**
 * Result returned by {@link usePinchToZoomText}.
 */
export type PinchToZoomResult = {
    /** Current animated font size — use in text style */
    animatedFontSize: SharedValue<number>;
    /** Current animated height — use in container style */
    animatedHeight: SharedValue<number>;
    /** Current animated line height — use in text style */
    animatedLineHeight: SharedValue<number>;
    /** Call on each pinch gesture frame with the scale value */
    onPinchUpdate: (scale: number) => void;
    /** Reset zoom to base font size */
    resetZoom: () => void;
    /** Compute layout at a specific scale (for non-animated use) */
    layoutAtScale: (scale: number) => ZoomLayoutResult;
};
/**
 * React hook for pinch-to-zoom text with per-frame layout recalculation.
 *
 * On each pinch gesture frame, scales the fontSize proportionally and
 * recalculates the text layout. Since `layout()` runs in ~0.0002ms,
 * this achieves 120+ recalculations per frame without dropping frames.
 *
 * Returns Reanimated SharedValues for fontSize, height, and lineHeight
 * that update on every gesture frame. Use `onPinchUpdate(scale)` as the
 * handler for your pinch gesture.
 *
 * Requires `react-native-reanimated` >= 3.0.0.
 *
 * @param text - Text content
 * @param style - Base text style (fontSize will be scaled)
 * @param maxWidth - Container width in pixels
 * @param options - Optional: min/max font size clamps
 * @returns SharedValues and gesture handler for pinch-to-zoom
 *
 * @example
 * ```tsx
 * import { usePinchToZoomText } from 'expo-pretext'
 * import { Gesture, GestureDetector } from 'react-native-gesture-handler'
 * import Animated, { useAnimatedStyle } from 'react-native-reanimated'
 *
 * function ZoomableText({ text }) {
 *   const zoom = usePinchToZoomText(text, {
 *     fontFamily: 'System',
 *     fontSize: 16,
 *     lineHeight: 24,
 *   }, containerWidth)
 *
 *   const pinch = Gesture.Pinch().onUpdate(e => {
 *     zoom.onPinchUpdate(e.scale)
 *   })
 *
 *   const textStyle = useAnimatedStyle(() => ({
 *     fontSize: zoom.animatedFontSize.value,
 *     lineHeight: zoom.animatedLineHeight.value,
 *   }))
 *
 *   const containerStyle = useAnimatedStyle(() => ({
 *     height: zoom.animatedHeight.value,
 *   }))
 *
 *   return (
 *     <GestureDetector gesture={pinch}>
 *       <Animated.View style={containerStyle}>
 *         <Animated.Text style={textStyle}>{text}</Animated.Text>
 *       </Animated.View>
 *     </GestureDetector>
 *   )
 * }
 * ```
 */
export declare function usePinchToZoomText(text: string, style: TextStyle, maxWidth: number, options?: {
    minFontSize?: number;
    maxFontSize?: number;
}): PinchToZoomResult;
//# sourceMappingURL=usePinchToZoomText.d.ts.map