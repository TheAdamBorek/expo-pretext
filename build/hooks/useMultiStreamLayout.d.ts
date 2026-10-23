import type { TextStyle } from '../types';
type StreamInput = {
    key: string;
    text: string;
};
type StreamResult = {
    height: number;
    lineCount: number;
};
export declare function useMultiStreamLayout(streams: StreamInput[], style: TextStyle, maxWidth: number): Map<string, StreamResult>;
export {};
//# sourceMappingURL=useMultiStreamLayout.d.ts.map