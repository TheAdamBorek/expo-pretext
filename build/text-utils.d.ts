import type { TextStyle } from './types';
export type TruncationResult = {
    text: string;
    truncated: boolean;
    lineCount: number;
};
/**
 * Find the largest fontSize that fits text in a box.
 * Binary search over prepare() + layout().
 */
export declare function fitFontSize(text: string, style: TextStyle, boxWidth: number, boxHeight: number, options?: {
    minSize?: number;
    maxSize?: number;
    step?: number;
}): number;
/**
 * Truncate text to fit within maxLines at the given width.
 * Returns the truncated text with optional ellipsis.
 */
export declare function truncateText(text: string, style: TextStyle, maxWidth: number, maxLines: number, options?: {
    ellipsis?: string;
}): TruncationResult;
/**
 * Measure the height of a code block with monospace font.
 *
 * Uses `whiteSpace: 'pre-wrap'` mode to preserve newlines, indentation,
 * and trailing spaces — matching how code is displayed in AI chat apps,
 * editors, and terminal UIs.
 *
 * Tabs are expanded at 8-space intervals (CSS `tab-size: 8` semantics).
 *
 * @param code - The source code text (newlines and whitespace preserved)
 * @param style - Text style (use a monospace fontFamily like 'Menlo', 'Courier', etc.)
 * @param maxWidth - Container width in pixels
 * @returns Height in pixels, line count, and whether the code was truncated
 *
 * @example
 * ```ts
 * import { measureCodeBlockHeight } from 'expo-pretext'
 *
 * const { height, lineCount } = measureCodeBlockHeight(
 *   'function hello() {\n  console.log("world")\n}',
 *   { fontFamily: 'Menlo', fontSize: 14, lineHeight: 20 },
 *   containerWidth,
 * )
 * ```
 *
 * @example
 * ```tsx
 * // In a FlashList AI chat — measure mixed prose + code blocks
 * function measureMessageHeight(message: Message, width: number): number {
 *   let totalHeight = 0
 *   for (const block of message.blocks) {
 *     if (block.type === 'code') {
 *       totalHeight += measureCodeBlockHeight(
 *         block.content, codeStyle, width - codePadding,
 *       ).height
 *     } else {
 *       totalHeight += layout(prepare(block.content, proseStyle), width).height
 *     }
 *   }
 *   return totalHeight
 * }
 * ```
 */
export type CodeBlockMeasurement = {
    /** Total height in pixels */
    height: number;
    /** Number of lines (including empty lines from newlines) */
    lineCount: number;
};
export declare function measureCodeBlockHeight(code: string, style: TextStyle, maxWidth: number): CodeBlockMeasurement;
//# sourceMappingURL=text-utils.d.ts.map