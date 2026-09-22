/**
 * Splits items into rows so they fill the screen evenly. Uses
 * floor(sqrt(n)) rows, which keeps the layout wider than it is tall on
 * landscape screens. Leftover items go to the top rows, so row lengths
 * never differ by more than one.
 *
 *   1 -> [1]   2 -> [2]   4 -> [2, 2]   5 -> [3, 2]   9 -> [3, 3, 3]
 */
export function splitIntoRows<T>(items: T[]): T[][] {
  if (items.length === 0) return []

  const rowCount = Math.floor(Math.sqrt(items.length))
  const base = Math.floor(items.length / rowCount)
  const extra = items.length % rowCount

  const rows: T[][] = []
  let start = 0
  for (let i = 0; i < rowCount; i++) {
    const size = base + (i < extra ? 1 : 0)
    rows.push(items.slice(start, start + size))
    start += size
  }
  return rows
}
