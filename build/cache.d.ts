export declare function getCachedWidth(fontKey: string, segment: string): number | undefined;
export declare function setCachedWidth(fontKey: string, segment: string, width: number): void;
export declare function cacheNativeResult(fontKey: string, segments: string[], widths: number[]): void;
export declare function tryResolveAllFromCache(fontKey: string, segments: string[]): number[] | null;
export declare function clearJSCache(): void;
/**
 * Set the per-font LRU budget for the JS width cache.
 *
 * Default is 10,000 entries per font (~320 KB). Increase if you use many
 * distinct segments per font; decrease if you need a tighter memory budget.
 *
 * Existing fonts shrink immediately if `n` is smaller than their current size.
 *
 * @param n  max entries per font (≥ 0)
 */
export declare function setCacheBudget(n: number): void;
/**
 * Introspect cache state — useful for memory-profiling long-running apps.
 */
export declare function getCacheStats(): {
    fonts: number;
    totalEntries: number;
    perFontBudget: number;
    perFont: Array<{
        fontKey: string;
        entries: number;
    }>;
};
//# sourceMappingURL=cache.d.ts.map