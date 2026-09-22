import { animals, type Animal } from './animals'

export interface GalleryItem extends Animal {
  image: string
}

const images = import.meta.glob<string>(
  '../assets/animals/*.{jpg,jpeg,png,webp,avif}',
  { eager: true, import: 'default' },
)

const imageById = new Map(
  Object.entries(images).map(([path, src]) => [
    path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.')),
    src,
  ]),
)

// Animals without a photo are skipped so the grid never shows an empty tile.
export const gallery: GalleryItem[] = animals.flatMap((animal) => {
  const image = imageById.get(animal.id)
  return image ? [{ ...animal, image }] : []
})
