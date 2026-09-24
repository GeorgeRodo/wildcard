import creditsMarkdown from '../../CREDITS.md?raw'

export interface PhotoCredit {
  animal: string
  photographer: string
  licence: string
  source: string
}

/**
 * The wall's photo credits, read from CREDITS.md at build time so the
 * repo and the site can never disagree. Each table row looks like:
 *
 *   | Red fox | Jane Doe | CC BY-SA 4.0 | [Commons](https://...) |
 */
export const photoCredits: PhotoCredit[] = creditsMarkdown
  .split('\n')
  .filter((line) => line.startsWith('| ') && !/^\| (Animal|-)/.test(line))
  .map((line) => {
    const [animal, photographer, licence, source] = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim())

    return {
      animal,
      photographer,
      licence,
      source: /\((.+)\)/.exec(source)?.[1] ?? '',
    }
  })
