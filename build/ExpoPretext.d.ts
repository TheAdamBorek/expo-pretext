import { NativeModule } from 'expo-modules-core';
import type { FontDescriptor, InkBounds, InkMeasurementDebug, NativeSegmentResult } from './types';
type MeasureNativeOptions = {
    whiteSpace?: string;
    locale?: string;
};
export interface ExpoPretextNativeModule extends InstanceType<typeof NativeModule> {
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
    measureInkSafe?(text: string, font: FontDescriptor): {
        left: number;
        top: number;
        right: number;
        bottom: number;
        width: number;
        height: number;
        advance: number;
        ascender: number;
        descender: number;
    };
    measureInkDebug?(text: string, font: FontDescriptor): InkMeasurementDebug;
    logDebugMessage?(message: string): void;
    getFontMetrics(font: FontDescriptor): {
        ascender: number;
        descender: number;
        xHeight: number;
        capHeight: number;
        lineGap: number;
    };
}
export declare function getNativeModule(): ExpoPretextNativeModule | null;
export {};
//# sourceMappingURL=ExpoPretext.d.ts.map