import type { LayoutCursor, LayoutResult, LayoutLine, LayoutLineRange, PreparedText, PreparedTextWithSegments as PublicPreparedTextWithSegments } from './types';
export { buildPreparedText, buildPreparedTextWithSegments } from './build';
export type { PreparedLineChunk, PrepareOptions } from './build';
export type LineGeometry = {
    lineCount: number;
    maxLineWidth: number;
};
export type LayoutLinesResult = LayoutResult & {
    lines: LayoutLine[];
};
export declare function layout(prepared: PreparedText, maxWidth: number, lineHeight?: number): LayoutResult;
export declare function materializeLineRange(prepared: PublicPreparedTextWithSegments, line: LayoutLineRange): LayoutLine;
export declare function walkLineRanges(prepared: PublicPreparedTextWithSegments, maxWidth: number, onLine: (line: LayoutLineRange) => void): number;
export declare function measureLineGeometry(prepared: PublicPreparedTextWithSegments, maxWidth: number): LineGeometry;
export declare function measureNaturalWidth(prepared: PublicPreparedTextWithSegments): number;
export declare function layoutNextLine(prepared: PublicPreparedTextWithSegments, start: LayoutCursor, maxWidth: number): LayoutLine | null;
export declare function layoutNextLineRange(prepared: PublicPreparedTextWithSegments, start: LayoutCursor, maxWidth: number): LayoutLineRange | null;
export declare function layoutWithLines(prepared: PublicPreparedTextWithSegments, maxWidth: number, lineHeight?: number): LayoutLinesResult;
export type { PublicPreparedTextWithSegments as PreparedTextWithSegments };
export type { LayoutCursor, LayoutResult, LayoutLineRange, LayoutLine };
export declare function clearCache(): void;
export declare function getLastLineWidth(prepared: PublicPreparedTextWithSegments, maxWidth: number): number;
export declare function setLocale(locale?: string): void;
//# sourceMappingURL=layout.d.ts.map