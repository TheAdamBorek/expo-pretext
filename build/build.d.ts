import { type SegmentBreakKind, type TextAnalysis, type WhiteSpaceMode, type WordBreakMode } from './analysis';
import type { TextStyle, PreparedText, PreparedTextWithSegments as PublicPreparedTextWithSegments } from './types';
export interface GraphemeSegmenterLike {
    segment(text: string): Iterable<{
        segment: string;
        index: number;
    }>;
}
export declare function getSharedGraphemeSegmenter(): GraphemeSegmenterLike;
export declare function clearGraphemeSegmenter(): void;
export type PreparedCore = {
    widths: number[];
    lineEndFitAdvances: number[];
    lineEndPaintAdvances: number[];
    kinds: SegmentBreakKind[];
    simpleLineWalkFastPath: boolean;
    segLevels: Int8Array | null;
    breakableFitAdvances: (number[] | null)[];
    discretionaryHyphenWidth: number;
    tabStopAdvance: number;
    chunks: PreparedLineChunk[];
    style: TextStyle | null;
};
export type InternalPreparedText = PreparedText & PreparedCore;
export type InternalPreparedTextWithSegments = InternalPreparedText & {
    segments: string[];
};
export type PreparedLineChunk = {
    startSegmentIndex: number;
    endSegmentIndex: number;
    consumedEndSegmentIndex: number;
};
export type PrepareOptions = {
    whiteSpace?: WhiteSpaceMode;
    wordBreak?: WordBreakMode;
};
export declare function buildPreparedText(analysis: TextAnalysis, widthMap: Map<string, number>, style: TextStyle, options?: PrepareOptions): PreparedText;
export declare function buildPreparedTextWithSegments(analysis: TextAnalysis, widthMap: Map<string, number>, style: TextStyle, options?: PrepareOptions): PublicPreparedTextWithSegments;
//# sourceMappingURL=build.d.ts.map