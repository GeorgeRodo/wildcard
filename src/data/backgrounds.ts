// Every image dropped into src/assets/backgrounds is picked up automatically,
// sorted by filename so the order is predictable.
const modules = import.meta.glob<string>(
  '../assets/backgrounds/*.{jpg,jpeg,png,webp,avif}',
  { eager: true, import: 'default' },
)

export const backgrounds: string[] = Object.keys(modules)
  .sort()
  .map((path) => modules[path])
