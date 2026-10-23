/**
 * Compiled pattern dictionary ready for fast `hyphenate()` lookups.
 *
 * Treat as opaque — produced by `compileHyphenationPatterns`, consumed by
 * `hyphenate`.
 */
export type CompiledHyphenationPatterns = {
    /** Pattern letters → per-position level array (length = letters + 1). */
    readonly entries: Map<string, readonly number[]>;
    /** Minimum letters required before a break (default 2). */
    readonly leftMin: number;
    /** Minimum letters required after a break (default 2). */
    readonly rightMin: number;
    /**
     * Optional exception dictionary for words that don't follow patterns.
     * Maps lowercased word → explicit break positions.
     */
    readonly exceptions: Map<string, readonly number[]>;
};
export type CompileOptions = {
    /** Min letters before a break (default 2). English typography uses 2. */
    leftMin?: number;
    /** Min letters after a break (default 2). English typography uses 3. */
    rightMin?: number;
    /**
     * Exception words written with explicit hyphens, e.g. `'as-so-ciate'`.
     * Override pattern-based output for these exact lowercased words.
     */
    exceptions?: string[];
};
/**
 * Compile TeX-format hyphenation patterns into a fast lookup dictionary.
 *
 * Each raw pattern is a string of letters interspersed with digits, e.g.
 * `"hy3ph"` means: weight 3 between `y` and `p` (odd → break allowed).
 * Dots mark word boundaries, e.g. `".un2"` means: weight 2 right after a
 * leading `u-n-` prefix (even → forbid the break).
 *
 * @example
 * ```ts
 * const patterns = compileHyphenationPatterns(
 *   ['hy3ph', 'phen5ation', '.com5put'],
 *   { leftMin: 2, rightMin: 3, exceptions: ['as-so-ciate'] },
 * )
 * ```
 */
export declare function compileHyphenationPatterns(rawPatterns: string[], options?: CompileOptions): CompiledHyphenationPatterns;
/**
 * Return the set of positions inside `word` where a soft-hyphen break is
 * allowed. Position `p` means "break between `word[p-1]` and `word[p]`",
 * i.e. the break splits the word into `word.slice(0, p)` + `word.slice(p)`.
 *
 * Preserves case in the output positions — only the lookup is lowercased.
 * Non-letter characters anchor to the surrounding pattern as-is.
 *
 * Returns an empty array when:
 * - the word is shorter than `leftMin + rightMin` letters, or
 * - no pattern matches (common for very short or very rare words).
 *
 * @example
 * ```ts
 * hyphenate('hyphenation', patterns)  // → [2, 6, 9]  (hy-phen-a-tion)
 * hyphenate('hi', patterns)            // → []         (too short)
 * ```
 */
export declare function hyphenate(word: string, patterns: CompiledHyphenationPatterns): number[];
/**
 * Convenience: insert `sep` (default U+00AD SOFT HYPHEN) at every allowed
 * break position. Handy for handing a string to any renderer that honors
 * soft hyphens (e.g., web browsers, Android `<Text>` with hyphenationFrequency).
 */
export declare function hyphenateAndJoin(word: string, patterns: CompiledHyphenationPatterns, separator?: string): string;
//# sourceMappingURL=hyphenation.d.ts.map