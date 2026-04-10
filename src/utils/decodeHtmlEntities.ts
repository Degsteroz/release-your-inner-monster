/** Именованные сущности, которые часто встречаются в переводах */
const NAMED: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00A0',
}

/**
 * Декодирует HTML-сущности в строке (`&#160;`, `&#xA0;`, `&nbsp;`, `&amp;` …).
 * Удобно для JSON-переводов: вместо неразрывного пробела можно писать `&#160;` или `\u00A0`.
 */
export function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (match, name) => {
      const key = name.toLowerCase()
      return key in NAMED ? NAMED[key]! : match
    })
}
