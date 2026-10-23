import { getNativeModule } from './ExpoPretext';
import { textStyleToFontDescriptor } from './font-utils';
const EMPTY_BOUNDS = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
};
function toInkBounds(value) {
    if (!value || typeof value !== 'object')
        return null;
    const bounds = value;
    if (typeof bounds.left !== 'number' ||
        typeof bounds.top !== 'number' ||
        typeof bounds.right !== 'number' ||
        typeof bounds.bottom !== 'number') {
        return null;
    }
    const width = typeof bounds.width === 'number' ? bounds.width : bounds.right - bounds.left;
    const height = typeof bounds.height === 'number' ? bounds.height : bounds.bottom - bounds.top;
    return {
        left: bounds.left,
        top: bounds.top,
        right: bounds.right,
        bottom: bounds.bottom,
        width,
        height,
    };
}
function mergeInkBounds(current, next) {
    if (!current)
        return next;
    const left = Math.min(current.left, next.left);
    const top = Math.min(current.top, next.top);
    const right = Math.max(current.right, next.right);
    const bottom = Math.max(current.bottom, next.bottom);
    return {
        left,
        top,
        right,
        bottom,
        width: right - left,
        height: bottom - top,
    };
}
function estimateInkBounds(text, style) {
    const italic = style.fontStyle === 'italic';
    const advance = text.length * style.fontSize * 0.55;
    const left = italic ? -style.fontSize * 0.12 : 0;
    const right = advance * (italic ? 1.08 : 1);
    const top = -style.fontSize * 0.8;
    const bottom = style.fontSize * 0.2;
    return {
        left,
        top,
        right,
        bottom,
        width: right - left,
        height: bottom - top,
    };
}
export function measureInkBounds(text, style) {
    if (text.length === 0)
        return EMPTY_BOUNDS;
    const lines = /\r?\n/.test(text) ? text.split(/\r?\n/) : [text];
    const native = getNativeModule();
    const font = textStyleToFontDescriptor(style);
    if (native && typeof native.measureInkBounds === 'function') {
        try {
            let merged = null;
            for (const line of lines) {
                if (line.length === 0)
                    continue;
                const bounds = toInkBounds(native.measureInkBounds(line, font));
                if (bounds)
                    merged = mergeInkBounds(merged, bounds);
            }
            if (merged)
                return merged;
        }
        catch {
        }
    }
    if (native && typeof native.measureInkWidth === 'function') {
        try {
            let merged = null;
            for (const line of lines) {
                if (line.length === 0)
                    continue;
                const width = native.measureInkWidth(line, font);
                if (typeof width !== 'number' || !isFinite(width))
                    continue;
                merged = mergeInkBounds(merged, {
                    left: 0,
                    top: -style.fontSize * 0.8,
                    right: width,
                    bottom: style.fontSize * 0.2,
                    width,
                    height: style.fontSize,
                });
            }
            if (merged)
                return merged;
        }
        catch {
        }
    }
    let merged = null;
    for (const line of lines) {
        if (line.length === 0)
            continue;
        merged = mergeInkBounds(merged, estimateInkBounds(line, style));
    }
    return merged ?? EMPTY_BOUNDS;
}
export function measureInkWidth(text, style) {
    return measureInkBounds(text, style).width;
}
export function measureInkDebug(text, style) {
    if (text.length === 0)
        return null;
    const native = getNativeModule();
    if (!native || typeof native.measureInkDebug !== 'function')
        return null;
    try {
        const debug = native.measureInkDebug(text, textStyleToFontDescriptor(style));
        if (!debug || typeof debug !== 'object')
            return null;
        return debug;
    }
    catch {
        return null;
    }
}
export function logInkDebugMessage(message) {
    const native = getNativeModule();
    if (!native || typeof native.logDebugMessage !== 'function')
        return;
    try {
        native.logDebugMessage(message);
    }
    catch {
    }
}
//# sourceMappingURL=ink-width.js.map