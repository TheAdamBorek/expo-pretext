// src/auto-invalidate.ts
// One-call automatic cache invalidation for the two real-world triggers:
//
//   1. System font-scale change (iOS Dynamic Type, Android Font Size).
//      Fully automatic — subscribes to AccessibilityInfo / Dimensions.
//   2. `expo-font` finishing a load. Two modes:
//      - `notifyFontsLoaded()` — explicit call after your `useFonts()` flips.
//        Zero overhead, runs exactly when needed.
//      - `fontLoadPoll: true` — background poll of `Font.getLoadedFonts()`,
//        clears caches when the set grows. Handy for apps that load fonts
//        in arbitrary places and don't want to track every load site.
//
// Both paths ultimately call `clearAllCaches()` which flushes both the
// JS LRU width cache and the native iOS/Android caches.
import { clearAllCaches, onFontScaleChange } from './accessibility';
let scaleUnsub = null;
let pollTimer = null;
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
export function enableAutoInvalidation(opts = {}) {
    const enableScale = opts.fontScaleChange ?? true;
    const poll = opts.fontLoadPoll ?? false;
    if (enableScale && !scaleUnsub) {
        scaleUnsub = onFontScaleChange(() => {
            clearAllCaches();
        });
    }
    if (poll && !pollTimer) {
        const intervalMs = typeof poll === 'object' && poll.intervalMs ? poll.intervalMs : 1000;
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const Font = require('expo-font');
            let known = Font.getLoadedFonts?.().length ?? 0;
            pollTimer = setInterval(() => {
                const now = Font.getLoadedFonts?.().length ?? 0;
                if (now !== known) {
                    known = now;
                    clearAllCaches();
                }
            }, intervalMs);
        }
        catch {
            // expo-font not present — silently skip; user can still call
            // notifyFontsLoaded() if they load fonts via another mechanism.
        }
    }
    return disableAutoInvalidation;
}
/**
 * Tear down any auto-invalidation subscriptions started by
 * `enableAutoInvalidation()`. Safe to call when nothing is subscribed.
 */
export function disableAutoInvalidation() {
    if (scaleUnsub) {
        scaleUnsub();
        scaleUnsub = null;
    }
    if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
    }
}
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
export function notifyFontsLoaded() {
    clearAllCaches();
}
//# sourceMappingURL=auto-invalidate.js.map