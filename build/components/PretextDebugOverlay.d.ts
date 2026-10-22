import { type ReactNode } from 'react';
import { type DebugMeasurement } from '../debug';
export type PretextDebugOverlayProps = {
    /** Predicted height from prepare() + layout() */
    predictedHeight: number;
    /** Children to wrap (the actual text content) */
    children: ReactNode;
    /** Show label with diff info (default: true) */
    showLabel?: boolean;
    /** Custom label formatter */
    labelFormatter?: (m: DebugMeasurement) => string;
    /** Callback when measurement is captured */
    onMeasurement?: (m: DebugMeasurement) => void;
};
/**
 * Visual debug overlay showing predicted vs actual text height.
 *
 * Wraps children in a bordered container, measures actual height via onLayout,
 * compares against the provided predicted height, and shows a colored border:
 * - Green: exact match (<1px)
 * - Yellow: close (<5% diff)
 * - Orange: loose (<15% diff)
 * - Red: wrong (>15% diff)
 *
 * Production-safe: only renders overlay chrome in __DEV__ mode.
 *
 * @example
 * ```tsx
 * import { PretextDebugOverlay } from 'expo-pretext'
 *
 * function Message({ text, style, width }) {
 *   const predictedHeight = useTextHeight(text, style, width)
 *   return (
 *     <PretextDebugOverlay predictedHeight={predictedHeight}>
 *       <Text style={style}>{text}</Text>
 *     </PretextDebugOverlay>
 *   )
 * }
 * ```
 */
export declare function PretextDebugOverlay({ predictedHeight, children, showLabel, labelFormatter, onMeasurement, }: PretextDebugOverlayProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PretextDebugOverlay.d.ts.map