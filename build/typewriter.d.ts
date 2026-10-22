import type { LayoutLine } from './types';
/**
 * A single frame in a typewriter animation sequence.
 * Each frame represents the state after revealing one additional character.
 *
 * @example
 * ```ts
 * // Frame 0: "H"  → lineCount: 1, height: 24
 * // Frame 1: "He" → lineCount: 1, height: 24
 * // Frame 5: "Hello " → lineCount: 1, height: 24
 * // Frame 10: "Hello Worl" → lineCount: 2, height: 48 (wrapped to next line)
 * ```
 */
export type TypewriterFrame = {
    /** Text revealed so far (e.g., "Hel" on frame 3 of "Hello") */
    revealedText: string;
    /** Number of visible lines at this reveal point — monotonically increases */
    lineCount: number;
    /** Total height in pixels at this point (lineCount * lineHeight) */
    height: number;
    /** True only on the final frame when all text has been revealed */
    isComplete: boolean;
};
/**
 * Build an array of typewriter frames from pre-computed layout lines.
 * Each frame represents one more character of text revealed, with the correct
 * line count and height at that point in the animation.
 *
 * Use this with `prepareWithSegments()` + `layoutWithLines()` to pre-compute
 * the exact layout, then animate the reveal without any additional measurement.
 *
 * @param lines - Output from `layoutWithLines().lines`
 * @param text - The original source text
 * @param lineHeight - Height per line in pixels
 * @returns One frame per character in the text, or `[]` for empty text
 *
 * @example
 * ```ts
 * import { prepareWithSegments, layoutWithLines, buildTypewriterFrames } from 'expo-pretext'
 *
 * const prepared = prepareWithSegments(text, style)
 * const { lines } = layoutWithLines(prepared, containerWidth)
 * const frames = buildTypewriterFrames(lines, text, style.lineHeight ?? 24)
 *
 * // Animate: reveal one frame per interval
 * let i = 0
 * const timer = setInterval(() => {
 *   const frame = frames[i]
 *   setDisplayText(frame.revealedText)
 *   setHeight(frame.height) // smooth height growth as lines wrap
 *   if (frame.isComplete) clearInterval(timer)
 *   i++
 * }, 30)
 * ```
 */
export declare function buildTypewriterFrames(lines: LayoutLine[], text: string, lineHeight: number): TypewriterFrame[];
//# sourceMappingURL=typewriter.d.ts.map