import { type LayoutCursor, type LayoutResult } from './layout';
import type { InlineFlowItem, PreparedInlineFlow, InlineFlowCursor, InlineFlowFragment, InlineFlowLine } from './types';
export type { InlineFlowItem, PreparedInlineFlow, InlineFlowCursor, InlineFlowFragment, InlineFlowLine };
export type InlineFlowFragmentRange = {
    itemIndex: number;
    gapBefore: number;
    occupiedWidth: number;
    start: LayoutCursor;
    end: LayoutCursor;
};
export type InlineFlowLineRange = {
    fragments: InlineFlowFragmentRange[];
    width: number;
    end: InlineFlowCursor;
};
export type InlineFlowGeometry = {
    lineCount: number;
    maxLineWidth: number;
};
export declare function prepareInlineFlow(items: InlineFlowItem[]): PreparedInlineFlow;
export declare function layoutNextInlineFlowLineRange(prepared: PreparedInlineFlow, maxWidth: number, start?: InlineFlowCursor): InlineFlowLineRange | null;
export declare function layoutNextInlineFlowLine(prepared: PreparedInlineFlow, maxWidth: number, start?: InlineFlowCursor): InlineFlowLine | null;
export declare function walkInlineFlowLineRanges(prepared: PreparedInlineFlow, maxWidth: number, onLine: (line: InlineFlowLineRange) => void): number;
export declare function measureInlineFlowGeometry(prepared: PreparedInlineFlow, maxWidth: number): InlineFlowGeometry;
export declare function walkInlineFlowLines(prepared: PreparedInlineFlow, maxWidth: number, onLine: (line: InlineFlowLine) => void): number;
export declare function measureInlineFlow(prepared: PreparedInlineFlow, maxWidth: number, lineHeight: number): LayoutResult;
//# sourceMappingURL=rich-inline.d.ts.map