import type { TextStyle } from '../types';
export type FlashListHeightsResult<T> = {
    /**
     * Synchronous cached height lookup. Returns the measured text height for
     * the given item. If missing from the cache, falls back to a single
     * native (or JS) measurement and memoizes the result.
     *
     * Use this inside `renderItem` to set an explicit height on the wrapping
     * View, which lets FlashList v2 skip a measurement frame and eliminates
     * first-paint jitter.
     */
    getHeight: (item: T) => number;
};
/**
 * FlashList v2 height prediction helper.
 *
 * Pre-warms a height cache in the background (batched via `measureHeights`
 * and `requestIdleCallback`) and returns `getHeight(item)` for synchronous
 * lookup inside `renderItem`.
 *
 * FlashList v2 no longer accepts `estimatedItemSize` or a size-bearing
 * `overrideItemLayout`. Instead, set `height` explicitly on the wrapper
 * view in `renderItem` — that's what this hook makes fast.
 *
 * @example
 * ```tsx
 * const { getHeight } = useFlashListHeights(
 *   messages,
 *   (m) => m.text,
 *   { fontFamily: 'System', fontSize: 16, lineHeight: 24 },
 *   bubbleMaxWidth,
 * )
 *
 * <FlashList
 *   data={messages}
 *   keyExtractor={(m) => m.id}
 *   renderItem={({ item }) => (
 *     <View style={{ height: getHeight(item) + VERTICAL_PADDING }}>
 *       <Text>{item.text}</Text>
 *     </View>
 *   )}
 * />
 * ```
 *
 * @param data      — full list dataset (used for background pre-warming)
 * @param getText   — extracts the text to measure from each item
 * @param style     — text style (fontFamily, fontSize, lineHeight, etc.)
 * @param maxWidth  — wrapping width in pixels
 */
export declare function useFlashListHeights<T>(data: T[], getText: (item: T) => string, style: TextStyle, maxWidth: number): FlashListHeightsResult<T>;
//# sourceMappingURL=useFlashListHeights.d.ts.map