import { clearJSCache } from './cache';
import type { TextStyle, PreparedText, PreparedTextWithSegments, PrepareOptions } from './types';
export declare function prepare(text: string, style: TextStyle, options?: PrepareOptions): PreparedText;
export declare function prepareWithSegments(text: string, style: TextStyle, options?: PrepareOptions): PreparedTextWithSegments;
export declare function measureHeights(texts: string[], style: TextStyle, maxWidth: number): number[];
export declare function measureTokenWidth(token: string, style: TextStyle): number;
export { clearJSCache };
//# sourceMappingURL=prepare.d.ts.map