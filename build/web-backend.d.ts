import type { FontDescriptor, InkBounds, NativeSegmentResult } from './types';
type MeasureNativeOptions = {
    whiteSpace?: string;
    locale?: string;
};
export interface WebBackendModule {
    segmentAndMeasure(text: string, font: FontDescriptor, options?: MeasureNativeOptions): NativeSegmentResult;
    batchSegmentAndMeasure(texts: string[], font: FontDescriptor, options?: MeasureNativeOptions): NativeSegmentResult[];
    measureGraphemeWidths(segment: string, font: FontDescriptor): number[];
    remeasureMerged(segments: string[], font: FontDescriptor): number[];
    segmentAndMeasureAsync(text: string, font: FontDescriptor, options?: MeasureNativeOptions): Promise<NativeSegmentResult>;
    measureTextHeight(text: string, font: FontDescriptor, maxWidth: number, lineHeight: number): {
        height: number;
        lineCount: number;
    };
    clearNativeCache(): void;
    setNativeCacheSize(size: number): void;
    measureInkWidth(text: string, font: FontDescriptor): number;
    measureInkBounds(text: string, font: FontDescriptor): InkBounds;
    getFontMetrics(font: FontDescriptor): {
        ascender: number;
        descender: number;
        xHeight: number;
        capHeight: number;
        lineGap: number;
    };
}
export declare function createWebBackend(): WebBackendModule;
export {};
//# sourceMappingURL=web-backend.d.ts.map