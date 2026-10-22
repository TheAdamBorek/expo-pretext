import { useMemo } from 'react';
import { prepare } from '../prepare';
export function usePreparedText(text, style, options) {
    return useMemo(() => {
        if (!text)
            return null;
        return prepare(text, style, options);
    }, [text, style.fontFamily, style.fontSize, style.fontWeight,
        style.fontStyle, style.lineHeight,
        options?.whiteSpace, options?.locale, options?.accuracy]);
}
//# sourceMappingURL=usePreparedText.js.map