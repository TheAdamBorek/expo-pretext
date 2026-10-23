// src/ExpoPretext.ts
// JS binding to the native Expo module.
// On web: uses Canvas + Intl.Segmenter backend.
// On native: uses iOS/Android Expo module.
import { requireNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';
let cachedModule = undefined;
function getWebBackend() {
    const { createWebBackend } = require('./web-backend');
    return createWebBackend();
}
export function getNativeModule() {
    if (cachedModule !== undefined)
        return cachedModule;
    // Web: use Canvas + Intl.Segmenter backend
    if (Platform.OS === 'web') {
        try {
            cachedModule = getWebBackend();
            return cachedModule;
        }
        catch {
            cachedModule = null;
            return null;
        }
    }
    // Native: use Expo module
    try {
        cachedModule = requireNativeModule('ExpoPretext');
        return cachedModule;
    }
    catch {
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
            console.warn('[expo-pretext] Native module not available. ' +
                'Using JS estimates. Use a development build for accurate measurements.');
        }
        cachedModule = null;
        return null;
    }
}
//# sourceMappingURL=ExpoPretext.js.map