import type { TextStyle, InkBounds } from './types';
export type TextRun = {
    /** Substring of the original text this run covers. */
    text: string;
    /** Byte (UTF-16 code unit) start index into the original text. */
    startIndex: number;
    /** Byte (UTF-16 code unit) end index, exclusive. */
    endIndex: number;
    /** Ink bounds of the run (left, top, right, bottom, width, height). */
    bounds: InkBounds;
    /** Natural advance width (sum of glyph advances — what SkFont returns). */
    advance: number;
    /** Font descriptor used for this run — carries through any fallback chain resolution. */
    font: {
        family: string;
        size: number;
        weight?: string;
        style?: string;
    };
};
export type ParagraphMeasurement = {
    /** Total width spanned by all runs (sum of advances). */
    naturalWidth: number;
    /** Height if laid out at `naturalWidth` with the style's `lineHeight`. */
    naturalHeight: number;
    /** Per-word runs, in visual order. */
    runs: TextRun[];
};
/**
 * Measure every word/segment in `text` and return per-run records ready for
 * a Skia Paragraph builder.
 *
 * Covers the common "I want precise glyph bounds with font fallback"
 * request on Skia (issues #3493, #3488, #1736). The returned advances
 * match what `SkFont.getTextWidth` produces; the ink bounds match the
 * `SkTypeface` glyph raster.
 *
 * @example
 * ```ts
 * import { Paragraph } from '@shopify/react-native-skia'
 * import { measureRuns } from 'expo-pretext'
 *
 * const { runs } = measureRuns('Hello World', { fontFamily: 'Inter', fontSize: 16 })
 * const paragraph = Paragraph.Make(...)
 * for (const run of runs) {
 *   paragraph.addText(run.text, { ... })  // use run.bounds / run.advance
 * }
 * ```
 */
export declare function measureRuns(text: string, style: TextStyle): ParagraphMeasurement;
//# sourceMappingURL=skia-adapter.d.ts.map