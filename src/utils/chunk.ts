/**
 * Splits items into groups of `size`. The last group is short if the items
 * don't divide evenly.
 *
 *   chunk([1, 2, 3, 4, 5], 2) -> [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(items: T[], size: number): T[][] {
  const groups: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    groups.push(items.slice(i, i + size))
  }
  return groups
}
