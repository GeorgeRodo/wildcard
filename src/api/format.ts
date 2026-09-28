/**
 * Tidying what iNaturalist sends back. Shared by the site's fallback and by
 * `scripts/seed-animals.mjs`, which imports this file directly (Node runs
 * TypeScript that only uses plain type annotations), so a card looks the
 * same whichever path its animal came from.
 */

/** Longest summary to show before trimming to the last full sentence. */
const SUMMARY_LIMIT = 360

/** iNaturalist serves several sizes from one URL. */
export const largePhoto = (url: string) => url.replace(/\/(square|small|medium)\./, '/large.')

/** Turns a Wikipedia summary's HTML into a short run of plain text. */
export function cleanSummary(html: string | null | undefined) {
  const text = (html ?? '')
    .replace(/<[^>]+>/g, '')
    // Wikipedia leaves pronunciation asides like "(help·info)" behind.
    .replace(/\(\s*help\s*[·.]\s*info\s*\)/gi, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s+([;,.])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= SUMMARY_LIMIT) return text

  const cut = text.slice(0, SUMMARY_LIMIT)
  const lastSentence = cut.lastIndexOf('. ')
  return lastSentence > 120 ? cut.slice(0, lastSentence + 1) : `${cut.trimEnd()}…`
}
