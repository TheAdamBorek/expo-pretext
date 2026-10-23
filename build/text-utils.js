import { prepare, prepareWithSegments } from './prepare';
import { layout, layoutWithLines, layoutNextLineRange, materializeLineRange } from './layout';
/**
 * Find the largest fontSize that fits text in a box.
 * Binary search over prepare() + layout().
 */
export function fitFontSize(text, style, boxWidth, boxHeight, options) {
    if (!text || boxWidth <= 0 || boxHeight <= 0)
        return options?.minSize ?? 1;
    const minSize = options?.minSize ?? 1;
    const maxSize = options?.maxSize ?? 200;
    const step = options?.step ?? 0.5;
    let lo = minSize;
    let hi = maxSize;
    while (hi - lo > step) {
        const mid = Math.round((lo + hi) / 2 / step) * step;
        const prepared = prepare(text, { ...style, fontSize: mid });
        const result = layout(prepared, boxWidth);
        if (result.height <= boxHeight) {
            lo = mid;
        }
        else {
            hi = mid - step;
        }
    }
    // Verify lo fits
    const prepared = prepare(text, { ...style, fontSize: lo });
    const result = layout(prepared, boxWidth);
    return result.height <= boxHeight ? lo : minSize;
}
/**
 * Truncate text to fit within maxLines at the given width.
 * Returns the truncated text with optional ellipsis.
 */
export function truncateText(text, style, maxWidth, maxLines, options) {
    if (!text || maxWidth <= 0 || maxLines <= 0) {
        return { text: '', truncated: false, lineCount: 0 };
    }
    const ellipsis = options?.ellipsis ?? '\u2026';
    const prepared = prepareWithSegments(text, style);
    const result = layoutWithLines(prepared, maxWidth);
    // Fits within maxLines — no truncation needed
    if (result.lineCount <= maxLines) {
        return { text, truncated: false, lineCount: result.lineCount };
    }
    // Walk lines to find text up to maxLines
    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    let totalText = '';
    for (let i = 0; i < maxLines; i++) {
        const lineRange = layoutNextLineRange(prepared, cursor, maxWidth);
        if (!lineRange)
            break;
        const line = materializeLineRange(prepared, lineRange);
        totalText += line.text;
        cursor = lineRange.end;
    }
    const trimmed = totalText.trimEnd();
    return {
        text: trimmed + ellipsis,
        truncated: true,
        lineCount: maxLines,
    };
}
export function measureCodeBlockHeight(code, style, maxWidth) {
    if (!code || maxWidth <= 0)
        return { height: 0, lineCount: 0 };
    const prepared = prepare(code, style, { whiteSpace: 'pre-wrap' });
    const result = layout(prepared, maxWidth);
    return { height: result.height, lineCount: result.lineCount };
}
//# sourceMappingURL=text-utils.js.map