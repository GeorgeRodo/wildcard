import { animals, type Animal } from './animals'

export interface GalleryItem extends Animal {
  /** 1200px wide, for large screens and the shuffle card. */
  image: string
  /** 600px wide, enough for a tile on most screens. */
  imageSmall: string
}

const byId = (images: Record<string, string>) =>
  new Map(
    Object.entries(images).map(([path, src]) => [
      path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.')),
      src,
    ]),
  )

const large = byId(
  import.meta.glob<string>('../assets/animals/*.webp', { eager: true, import: 'default' }),
)
const small = byId(
  import.meta.glob<string>('../assets/animals/small/*.webp', { eager: true, import: 'default' }),
)

// Animals without a photo are skipped so the grid never shows an empty tile.
export const gallery: GalleryItem[] = animals.flatMap((animal) => {
  const image = large.get(animal.id)
  if (!image) return []
  return [{ ...animal, image, imageSmall: small.get(animal.id) ?? image }]
})
