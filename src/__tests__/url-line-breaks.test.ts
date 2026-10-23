// url-line-breaks.test.ts
// URLs and paths against a fake native module that segments like iOS's
// CFStringTokenizer: words (with dots between letters, as in "example.com"),
// whitespace runs, and every other character on its own. Every character is
// ADVANCE wide, so the expected lines can be worked out by hand.
//
// The expected breaks are the ones TextKit reports for the same strings
// (UAX #14): after "/" before a letter, after "-" or "?", never after "." or
// inside "//", and not inside "1/2".

;(globalThis as unknown as Record<string, unknown>).__DEV__ = false

import { describe, test, expect, beforeEach, afterEach, afterAll, mock } from 'bun:test'
import type { NativeSegmentResult, TextStyle } from '../types'

const ADVANCE = 10

function nativeSegment(text: string): NativeSegmentResult {
  const segments = text.match(/[\p{L}\p{N}]+(?:\.[\p{L}\p{N}]+)*|\s+|./gu) ?? []
  return {
    segments,
    isWordLike: segments.map((s) => /[\p{L}\p{N}]/u.test(s)),
    widths: segments.map((s) => s.length * ADVANCE),
  }
}

const fakeNative = {
  segmentAndMeasure: (text: string) => nativeSegment(text),
  batchSegmentAndMeasure: (texts: string[]) => texts.map(nativeSegment),
  remeasureMerged: (segments: string[]) => segments.map((s) => s.length * ADVANCE),
}

let activeNative: typeof fakeNative | null = fakeNative

mock.module('../ExpoPretext', () => ({
  getNativeModule: () => activeNative,
}))

const { prepareWithSegments } = await import('../prepare')
const { layoutWithLines, measureNaturalWidth } = await import('../layout')
const { prepareInlineFlow, measureInlineFlow } = await import('../rich-inline')
const { clearJSCache } = await import('../cache')
const { setEngineProfile, ENGINE_PROFILES } = await import('../engine-profile')

const STYLE: TextStyle = { fontFamily: 'UrlBreaksTestFont', fontSize: 17, lineHeight: 21 }
const URL = 'https://example.com/some/really/long/path/to/a/record'

function lines(text: string, maxWidth: number): string[] {
  return layoutWithLines(prepareWithSegments(text, STYLE), maxWidth).lines.map((l) => l.text.trimEnd())
}

beforeEach(() => {
  activeNative = fakeNative
  clearJSCache()
})

afterEach(() => {
  setEngineProfile(null)
})

afterAll(() => {
  // Other test files expect no native module.
  activeNative = null
  clearJSCache()
})

describe('URLs wrap at their line-break opportunities', () => {
  test('a URL breaks after slashes instead of filling each line to the edge', () => {
    // 19.7 characters per line.
    expect(lines(URL, 197)).toEqual([
      'https://',
      'example.com/some/',
      'really/long/path/',
      'to/a/record',
    ])
  })

  test('the inline flow wraps a URL to the same number of lines', () => {
    const flow = prepareInlineFlow([{ text: URL, style: STYLE }])
    expect(measureInlineFlow(flow, 197, 21)).toEqual({ lineCount: 4, height: 84 })
  })

  test('a URL is as wide as all its characters on one line', () => {
    expect(measureNaturalWidth(prepareWithSegments(URL, STYLE))).toBe(53 * ADVANCE)
  })

  test('a path breaks after its slashes and hyphens', () => {
    expect(lines('/Users/adam/Documents/report-final.pdf', 150)).toEqual([
      '/Users/adam/',
      'Documents/',
      'report-',
      'final.pdf',
    ])
  })

  test('a date does not break at its slashes', () => {
    expect(lines('2024/10/23', 60)).toEqual(['2024/1', '0/23'])
  })
})

describe('what stays as it was', () => {
  test('prose wraps between words', () => {
    expect(lines('The quick brown fox jumps over the lazy dog', 197)).toEqual([
      'The quick brown fox',
      'jumps over the lazy',
      'dog',
    ])
  })

  test('the web profile keeps a URL whole until it overflows, as Blink does', () => {
    setEngineProfile(ENGINE_PROFILES.web)
    expect(lines(URL, 197)).toEqual([
      'https://example.com',
      '/some/really/long/p',
      'ath/to/a/record',
    ])
  })
})
