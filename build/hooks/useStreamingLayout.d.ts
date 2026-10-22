import type { TextStyle } from '../types';
type StreamingLayoutResult = {
    height: number;
    lineCount: number;
    lastLineWidth: number;
    doesNextTokenWrap: (token: string) => boolean;
};
export declare function useStreamingLayout(text: string, style: TextStyle, maxWidth: number): StreamingLayoutResult;
export {};
//# sourceMappingURL=useStreamingLayout.d.ts.map