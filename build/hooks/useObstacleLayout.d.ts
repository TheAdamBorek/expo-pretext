import { type CircleObstacle, type RectObstacle, type LayoutRegion, type PositionedLine } from '../obstacle-layout';
import type { TextStyle, LayoutCursor } from '../types';
/**
 * Result returned by {@link useObstacleLayout}.
 */
export type ObstacleLayoutResult = {
    /** Positioned text lines with x, y, width, and text content */
    lines: PositionedLine[];
    /** Cursor position after last laid-out text — use to continue layout in another region */
    cursor: LayoutCursor;
};
/**
 * React hook for editorial text-around-obstacles layout.
 *
 * Wraps the `layoutColumn()` engine with React memoization. Text reflows
 * around circle and rectangle obstacles in real-time — move an obstacle
 * and the text reflows instantly (layoutColumn runs in pure arithmetic).
 *
 * `prepareWithSegments()` is called once when text/style changes.
 * `layoutColumn()` re-runs when obstacles or region change — fast enough
 * for 60fps gesture-driven obstacle dragging.
 *
 * @param text - The text content to lay out
 * @param style - Text style (fontFamily, fontSize, lineHeight, etc.)
 * @param region - Rectangular region to fill with text
 * @param circleObstacles - Circle obstacles to flow text around
 * @param rectObstacles - Rectangle obstacles to flow text around
 * @param options - Optional: startCursor, singleSlotOnly
 * @returns Positioned lines and cursor for continuation
 *
 * @example
 * ```tsx
 * import { useObstacleLayout } from 'expo-pretext'
 *
 * function EditorialPage({ text, imagePosition }) {
 *   const { lines } = useObstacleLayout(
 *     text,
 *     { fontFamily: 'Georgia', fontSize: 16, lineHeight: 26 },
 *     { x: 0, y: 0, width: screenWidth, height: screenHeight },
 *     [{ cx: imagePosition.x, cy: imagePosition.y, r: 80, hPad: 12 }],
 *   )
 *
 *   return (
 *     <View>
 *       {lines.map((line, i) => (
 *         <Text key={i} style={{ position: 'absolute', left: line.x, top: line.y }}>
 *           {line.text}
 *         </Text>
 *       ))}
 *     </View>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With drag gesture — text reflows at 60fps
 * function DraggableObstacle({ text }) {
 *   const [pos, setPos] = useState({ x: 150, y: 200 })
 *
 *   const { lines } = useObstacleLayout(
 *     text, style, region,
 *     [{ cx: pos.x, cy: pos.y, r: 60 }],
 *   )
 *
 *   return (
 *     <View>
 *       {lines.map((line, i) => (
 *         <Text key={i} style={{ position: 'absolute', left: line.x, top: line.y }}>
 *           {line.text}
 *         </Text>
 *       ))}
 *       <Draggable onDrag={setPos}>
 *         <Circle cx={pos.x} cy={pos.y} r={60} />
 *       </Draggable>
 *     </View>
 *   )
 * }
 * ```
 */
export declare function useObstacleLayout(text: string, style: TextStyle, region: LayoutRegion, circleObstacles?: CircleObstacle[], rectObstacles?: RectObstacle[], options?: {
    startCursor?: LayoutCursor;
    singleSlotOnly?: boolean;
}): ObstacleLayoutResult;
//# sourceMappingURL=useObstacleLayout.d.ts.map