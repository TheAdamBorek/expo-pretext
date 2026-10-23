export type AutoInvalidateOptions = {
    /** Clear caches on system font-scale change (default: true). */
    fontScaleChange?: boolean;
    /**
     * Background poll of `expo-font`'s loaded-fonts registry. Pass `true`
     * for the default 1s cadence, or an object to customize.
     * Default: `false` — prefer explicit `notifyFontsLoaded()` for zero cost.
     */
    fontLoadPoll?: boolean | {
        intervalMs?: number;
    };
};
/**
 * Enable automatic cache invalidation. Idempotent — safe to call multiple
 * times. Returns a disposer that tears down every subscription it started.
 *
 * @example
 * ```tsx
 * // At your app root, once:
 * useEffect(() => {
 *   const stop = enableAutoInvalidation({ fontLoadPoll: true })
 *   return stop
 * }, [])
 * ```
 */
export declare function enableAutoInvalidation(opts?: AutoInvalidateOptions): () => void;
/**
 * Tear down any auto-invalidation subscriptions started by
 * `enableAutoInvalidation()`. Safe to call when nothing is subscribed.
 */
export declare function disableAutoInvalidation(): void;
/**
 * Explicitly mark that new fonts finished loading. Clears all caches so
 * subsequent `prepare()`/`layout()` calls re-measure against the now-correct
 * font file instead of the previously-resolved fallback.
 *
 * Call this in the effect that observes your `useFonts()` hook result flip
 * from `false` to `true`. Zero overhead — doesn't need a poll interval.
 *
 * @example
 * ```tsx
 * const [loaded] = useFonts({ Inter: require('./Inter.ttf') })
 * useEffect(() => { if (loaded) notifyFontsLoaded() }, [loaded])
 * ```
 */
export declare function notifyFontsLoaded(): void;
//# sourceMappingURL=auto-invalidate.d.ts.map