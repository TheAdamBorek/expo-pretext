// letter-spacing-native.test.ts
// letterSpacing against a fake native module that follows the iOS contract:
// segment widths are unkerned for letterSpacing 0 and kerned otherwise
// (UIKit turns pair kerning off only for an NSKern of exactly 0), and native
// never adds the spacing itself. These tests check the JS half: what the
// descriptor carries, that the spacing is added exactly once, and that unset
// and 0 never share a cache.

;(globalThis as unknown as Record<string, unknown>).__DEV__ = false

import { describe, test, expect, beforeEach, afterAll, mock } from 'bun:test'
import type { FontDescriptor, NativeSegmentResult, TextStyle } from '../types'

const ADVANCE = 10
const PAIR_KERNING: Record<string, number> = { AV: -2, VA: -2, Wa: -1 }

function nativeWidth(text: string, font: FontDescriptor): number {
  let width = 0
  for (let i = 0; i < text.length; i++) {
    width += ADVANCE
    if (font.letterSpacing !== 0 && i > 0) {
      width += PAIR_KERNING[text.slice(i - 1, i + 1)] ?? 0
    }
  }
  return width
}

function nativeSegment(text: string, font: FontDescriptor): NativeSegmentResult {
  // Like the native tokenizer: words, whitespace runs and punctuation apart.
  const segments = text.split(/(\s+|[,.!?])/).filter((s) => s.length > 0)
  return {
    segments,
    isWordLike: segments.map((s) => /\w/.test(s)),
    widths: segments.map((s) => nativeWidth(s, font)),
  }
}

const descriptors: FontDescriptor[] = []
let remeasureCalls = 0

const fakeNative = {
  segmentAndMeasure(text: string, font: FontDescriptor) {
    descriptors.push(font)
    return nativeSegment(text, font)
  },
  batchSegmentAndMeasure(texts: string[], font: FontDescriptor) {
    descriptors.push(font)
    return texts.map((t) => nativeSegment(t, font))
  },
  remeasureMerged(segments: string[], font: FontDescriptor) {
    descriptors.push(font)
    remeasureCalls++
    return segments.map((s) => nativeWidth(s, font))
  },
  measureTextHeight() {
    return { height: 20, lineCount: 1 }
  },
}

let activeNative: typeof fakeNative | null = fakeNative

mock.module('../ExpoPretext', () => ({
  getNativeModule: () => activeNative,
}))

const { prepareWithSegments, measureHeights } = await import('../prepare')
const { measureNaturalWidth } = await import('../layout')
const { clearJSCache, tryResolveAllFromCache } = await import('../cache')
const { getFontKey } = await import('../font-utils')

const BASE: TextStyle = { fontFamily: 'System', fontSize: 17 }
const TEXT = 'AVATAR Wave'
// A V A T A R = 6 glyphs, "AV" + "VA" pairs kern by -2 each.
// W a v e     = 4 glyphs, "Wa" kerns by -1. The space is one glyph.
const UNKERNED = 11 * ADVANCE
const KERNED = UNKERNED - 2 - 2 - 1
const GLYPHS = 11

function naturalWidth(style: TextStyle, accuracy?: 'fast' | 'exact'): number {
  return measureNaturalWidth(prepareWithSegments(TEXT, style, accuracy ? { accuracy } : undefined))
}

beforeEach(() => {
  activeNative = fakeNative
  descriptors.length = 0
  remeasureCalls = 0
  clearJSCache()
})

afterAll(() => {
  // Other test files expect no native module.
  activeNative = null
  clearJSCache()
})

describe('letterSpacing on the native descriptor', () => {
  test('unset letterSpacing is not sent, so native keeps kerning', () => {
    expect(naturalWidth(BASE)).toBe(KERNED)
    expect(descriptors.every((d) => !('letterSpacing' in d))).toBe(true)
  })

  test('letterSpacing 0 is sent, so native measures without kerning', () => {
    expect(naturalWidth({ ...BASE, letterSpacing: 0 })).toBe(UNKERNED)
    expect(descriptors.every((d) => d.letterSpacing === 0)).toBe(true)
  })
})

describe('non-zero letterSpacing keeps kerning and is added once per glyph', () => {
  test.each([1, -0.5, 2.25])('letterSpacing %p, fast mode', (ls) => {
    expect(naturalWidth({ ...BASE, letterSpacing: ls })).toBeCloseTo(KERNED + ls * GLYPHS, 10)
    expect(descriptors.every((d) => d.letterSpacing === ls)).toBe(true)
  })

  test.each([1, -0.5, 2.25])('letterSpacing %p, exact mode', (ls) => {
    expect(naturalWidth({ ...BASE, letterSpacing: ls }, 'exact')).toBeCloseTo(KERNED + ls * GLYPHS, 10)
  })
})

describe('unset and 0 letterSpacing never share cached widths', () => {
  test('getFontKey differs for unset and 0, and keeps the old key for unset', () => {
    expect(getFontKey(BASE)).toBe('System_17_400_normal')
    expect(getFontKey({ ...BASE, letterSpacing: 0 })).toBe('System_17_400_normal_ls0')
    expect(getFontKey({ ...BASE, letterSpacing: 1 })).toBe('System_17_400_normal_ls1')
  })

  test('exact mode does not reuse merged widths measured with unset letterSpacing', () => {
    // Analysis glues the comma to "AVATAR", so exact mode re-measures
    // "AVATAR," natively and caches it under the font key.
    const text = 'AVATAR, Wave'
    const exact = (style: TextStyle) =>
      measureNaturalWidth(prepareWithSegments(text, style, { accuracy: 'exact' }))

    expect(exact(BASE)).toBe(12 * ADVANCE - 2 - 2 - 1)
    expect(remeasureCalls).toBe(1)
    expect(exact({ ...BASE, letterSpacing: 0 })).toBe(12 * ADVANCE)
    expect(remeasureCalls).toBe(2)
  })
})

describe('measureHeights pre-warming applies letterSpacing like prepare does', () => {
  const SPACED: TextStyle = { ...BASE, letterSpacing: 1 }

  test('measureHeights caches widths that include letterSpacing', () => {
    measureHeights(['AVATAR'], SPACED, 300)
    // Kerned (AV, VA: -2 each) plus 1 per glyph.
    expect(tryResolveAllFromCache(getFontKey(SPACED), ['AVATAR'])).toEqual([6 * ADVANCE - 4 + 6])
  })
})
