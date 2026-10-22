// src/morphing.ts
// Text morphing: compute interpolation data between two text layouts.
// Used for "Thinking..." → final response transitions in AI chat.
/**
 * Compute morph transition data between two sets of layout lines.
 *
 * Pairs up lines from `fromLines` and `toLines` by index. Lines that exist
 * in only one state get empty counterparts in the other. Use `progress`
 * (0 to 1) to interpolate height and visible line count.
 *
 * @param fromLines - Layout lines from the source state (e.g., "Thinking...")
 * @param toLines - Layout lines from the target state (e.g., final response)
 * @param lineHeight - Height per line in pixels
 * @returns Morph data with per-line info and interpolation functions
 *
 * @example
 * ```ts
 * import { prepareWithSegments, layoutWithLines, buildTextMorph } from 'expo-pretext'
 *
 * const fromPrepared = prepareWithSegments('Thinking...', style)
 * const toPrepared = prepareWithSegments(finalResponse, style)
 * const fromLayout = layoutWithLines(fromPrepared, width)
 * const toLayout = layoutWithLines(toPrepared, width)
 *
 * const morph = buildTextMorph(fromLayout.lines, toLayout.lines, 24)
 *
 * // At progress 0.5: halfway between heights
 * const midHeight = morph.heightAt(0.5)
 * ```
 */
export function buildTextMorph(fromLines, toLines, lineHeight) {
    const maxLines = Math.max(fromLines.length, toLines.length);
    const lines = [];
    for (let i = 0; i < maxLines; i++) {
        const from = i < fromLines.length ? fromLines[i] : null;
        const to = i < toLines.length ? toLines[i] : null;
        lines.push({
            fromText: from?.text ?? '',
            toText: to?.text ?? '',
            fromWidth: from?.width ?? 0,
            toWidth: to?.width ?? 0,
            existsInFrom: from !== null,
            existsInTo: to !== null,
        });
    }
    const fromHeight = fromLines.length * lineHeight;
    const toHeight = toLines.length * lineHeight;
    const fromLineCount = fromLines.length;
    const toLineCount = toLines.length;
    return {
        lines,
        fromHeight,
        toHeight,
        fromLineCount,
        toLineCount,
        heightAt(progress) {
            const p = Math.max(0, Math.min(1, progress));
            return fromHeight + (toHeight - fromHeight) * p;
        },
        visibleLinesAt(progress) {
            const p = Math.max(0, Math.min(1, progress));
            return Math.round(fromLineCount + (toLineCount - fromLineCount) * p);
        },
    };
}
//# sourceMappingURL=morphing.js.map