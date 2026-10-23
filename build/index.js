// src/index.ts
// Public API for expo-pretext.
// Simple API (hooks) + Power API (Pretext 1:1) + Utilities.
// --- Simple API ---
export { useTextHeight } from './hooks/useTextHeight';
export { usePreparedText } from './hooks/usePreparedText';
export { useFlashListHeights } from './hooks/useFlashListHeights';
export { useStreamingLayout } from './hooks/useStreamingLayout';
export { useMultiStreamLayout } from './hooks/useMultiStreamLayout';
export { measureHeights, measureTokenWidth } from './prepare';
// --- Core API ---
export { prepare, prepareWithSegments } from './prepare';
export { layout, layoutWithLines, layoutNextLine, layoutNextLineRange, walkLineRanges, measureNaturalWidth, measureLineGeometry, getLastLineWidth, materializeLineRange, } from './layout';
// --- Rich Inline (formerly inline-flow) ---
export { prepareInlineFlow, walkInlineFlowLines, measureInlineFlow } from './rich-inline';
// --- Obstacle Layout ---
export { carveTextLineSlots, circleIntervalForBand, rectIntervalForBand, layoutColumn, } from './obstacle-layout';
export { useObstacleLayout } from './hooks/useObstacleLayout';
// --- Streaming ---
export { prepareStreaming, clearStreamingState } from './streaming';
// --- Text Utilities ---
export { fitFontSize, truncateText, measureCodeBlockHeight } from './text-utils';
// --- Hyphenation ---
export { compileHyphenationPatterns, hyphenate, hyphenateAndJoin } from './hyphenation';
// --- Skia adapter ---
export { measureRuns } from './skia-adapter';
// --- Typewriter ---
export { buildTypewriterFrames } from './typewriter';
export { useTypewriterLayout } from './hooks/useTypewriterLayout';
// --- Text Morphing ---
export { buildTextMorph } from './morphing';
export { useTextMorphing } from './hooks/useTextMorphing';
// --- Zoom ---
export { computeZoomLayout } from './zoom';
// --- Animated (requires react-native-reanimated) ---
// Import from 'expo-pretext/animated' to avoid requiring reanimated for non-animated usage:
//   import { useAnimatedTextHeight, useCollapsibleHeight, usePinchToZoomText } from 'expo-pretext/animated'
// Or import directly from hook files:
//   import { useAnimatedTextHeight } from 'expo-pretext/src/hooks/useAnimatedTextHeight'
// --- Engine Profile ---
export { getEngineProfile, setEngineProfile, ENGINE_PROFILES } from './engine-profile';
// --- Font Metrics ---
export { getFontMetrics, validateFont, resolveFontFamily } from './font-utils';
// --- Font Load Verification (silent-fallback detection) ---
export { verifyFontsLoaded } from './verify-font';
// --- Ink-bounds Measurement ---
export { measureInkBounds, measureInkWidth, measureInkDebug, logInkDebugMessage } from './ink-width';
// --- Ink-Safe Text ---
export { getInkSafePadding } from './ink-safe';
export { useInkSafeStyle } from './hooks/useInkSafeStyle';
export { InkSafeText } from './components/InkSafeText';
// --- Truncated Text ---
export { TruncatedText } from './components/TruncatedText';
// --- Safe Text (line-by-line renderer) ---
export { SafeText } from './components/SafeText';
// --- Balanced / Pretty Text (CSS text-wrap: balance / pretty) ---
export { BalancedText } from './components/BalancedText';
export { PrettyText } from './components/PrettyText';
export { balanceLayout, balanceLayoutWithLines, prettyLayout, layoutWithWrap } from './text-wrap';
// --- Accessibility ---
export { getFontScale, onFontScaleChange, clearAllCaches } from './accessibility';
export { enableAutoInvalidation, disableAutoInvalidation, notifyFontsLoaded, } from './auto-invalidate';
// --- Developer Tools ---
export { compareDebugMeasurement, DEBUG_ACCURACY_COLORS } from './debug';
export { PretextDebugOverlay } from './components/PretextDebugOverlay';
export { buildHeightSnapshot, compareHeightSnapshots } from './snapshot';
export { prepareWithBudget, PrepareBudgetTracker } from './perf-budget';
// --- Utilities ---
export { clearCache, setLocale } from './layout';
export { setCacheBudget, getCacheStats } from './cache';
// --- Kinsoku Shori (CJK line-break prohibitions) ---
// Read-only sets exposing the characters forbidden at line start (closing
// punctuation like 、。）」) and at line end (opening punctuation like （「『).
// The engine applies these automatically; users can inspect them for
// custom line-break logic.
export { kinsokuStart, kinsokuEnd } from './analysis';
//# sourceMappingURL=index.js.map