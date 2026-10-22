import type { TextStyle } from './types';
export type FontLoadVerification = {
    /**
     * `true` if the requested font is applied. Either the requested family
     * matches the System font (trivially applied) or its measured width
     * differs from System by more than `widthTolerance`.
     */
    applied: boolean;
    /** The concrete family name resolved from the style's `fontFamily` chain. */
    resolvedFamily: string;
    /** `true` if the resolved family is a generic system font. */
    isSystemFont: boolean;
    /** Advance sum for the reference string using the requested font. */
    requestedWidth: number;
    /** Advance sum for the reference string using the explicit System font. */
    systemWidth: number;
    /** Absolute width difference in points. */
    widthDifference: number;
};
/**
 * Diagnostic for the silent font-fallback case. Call at app startup after
 * your `useFonts()` hook flips to `loaded`.
 *
 * @returns `null` if the native module can't be reached (JS fallback).
 *          Otherwise a report with `applied`, the width comparison, and
 *          enough metadata to print a helpful warning.
 *
 * @example
 * ```ts
 * const [loaded] = useFonts({ Inter: require('./Inter.ttf') })
 * useEffect(() => {
 *   if (!loaded) return
 *   const v = verifyFontsLoaded({ fontFamily: 'Inter', fontSize: 16 })
 *   if (v && !v.applied) {
 *     console.warn('Inter is not being applied — falling back to System')
 *   }
 * }, [loaded])
 * ```
 */
export declare function verifyFontsLoaded(style: TextStyle, options?: {
    reference?: string;
    widthTolerance?: number;
}): FontLoadVerification | null;
//# sourceMappingURL=verify-font.d.ts.map