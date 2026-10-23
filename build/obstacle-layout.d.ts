import { type LayoutCursor, type PreparedTextWithSegments } from './layout';
export type Interval = {
    left: number;
    right: number;
};
export type CircleObstacle = {
    cx: number;
    cy: number;
    r: number;
    hPad?: number;
    vPad?: number;
};
export type RectObstacle = {
    x: number;
    y: number;
    w: number;
    h: number;
};
export type LayoutRegion = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export type PositionedLine = {
    x: number;
    y: number;
    width: number;
    text: string;
};
export type LayoutColumnResult = {
    lines: PositionedLine[];
    cursor: LayoutCursor;
};
/**
 * Compute the horizontal interval blocked by a circle at a given line band.
 * Returns null if the circle doesn't intersect this band.
 */
export declare function circleIntervalForBand(cx: number, cy: number, r: number, bandTop: number, bandBottom: number, hPad?: number, vPad?: number): Interval | null;
/**
 * Compute the horizontal interval blocked by a rectangle at a given line band.
 * Returns null if the rect doesn't intersect this band.
 */
export declare function rectIntervalForBand(rect: RectObstacle, bandTop: number, bandBottom: number): Interval | null;
/**
 * Carve a base interval into free text slots by subtracting blocked intervals.
 * Returns slots wider than minSlotWidth (default 30px).
 */
export declare function carveTextLineSlots(base: Interval, blocked: Interval[], minSlotWidth?: number): Interval[];
/**
 * Layout text in a rectangular region, flowing around circle and rect obstacles.
 * Text fills all free slots on each line (both sides of obstacles).
 *
 * prepare() is called ONCE before this. layoutNextLine() is called per slot per line.
 * This is Pretext's core "editorial engine" pattern.
 */
export declare function layoutColumn(prepared: PreparedTextWithSegments, startCursor: LayoutCursor, region: LayoutRegion, lineHeight: number, circleObstacles?: CircleObstacle[], rectObstacles?: RectObstacle[], singleSlotOnly?: boolean): LayoutColumnResult;
//# sourceMappingURL=obstacle-layout.d.ts.map