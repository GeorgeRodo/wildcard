/**
 * Resizes the originals in photos/ into web-sized WebP files in
 * src/assets/animals/, which is what the site loads.
 *
 * Each photo is written at two widths. Tiles on a phone are only a couple
 * of hundred pixels wide, so the browser can pick the small one there and
 * save most of the download and memory, while large screens get the big one.
 *
 * Run with: npm run optimize-images
 */
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import sharp from 'sharp'

const SOURCE_DIR = 'photos'
const OUTPUT_DIR = join('src', 'assets', 'animals')
const SIZES = [
  { width: 1200, dir: OUTPUT_DIR },
  { width: 600, dir: join(OUTPUT_DIR, 'small') },
]
const QUALITY = 76
const SOURCE_TYPES = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff'])

/** Pass --force to rebuild photos that are already converted. */
const force = process.argv.includes('--force')

const format = (bytes) => `${(bytes / 1024).toFixed(0)} kB`

async function modifiedTime(path) {
  try {
    return (await stat(path)).mtimeMs
  } catch {
    return 0
  }
}

const files = (await readdir(SOURCE_DIR).catch(() => [])).filter((file) =>
  SOURCE_TYPES.has(extname(file).toLowerCase()),
)

if (files.length === 0) {
  console.log(`No photos found in ${SOURCE_DIR}/. Put the originals there and run this again.`)
  process.exit(0)
}

for (const size of SIZES) await mkdir(size.dir, { recursive: true })

const totals = new Map(SIZES.map((size) => [size.width, 0]))
let sourceBytes = 0
let written = 0

for (const file of files.sort()) {
  const source = join(SOURCE_DIR, file)
  const name = `${basename(file, extname(file))}.webp`
  const sourceStat = await stat(source)
  sourceBytes += sourceStat.size

  const sizes = []

  for (const size of SIZES) {
    const output = join(size.dir, name)

    // Skip anything already converted since the original last changed.
    if (!force && (await modifiedTime(output)) > sourceStat.mtimeMs) {
      totals.set(size.width, totals.get(size.width) + (await stat(output)).size)
      continue
    }

    const data = await sharp(source)
      .rotate() // honour the EXIF orientation before it is stripped
      .resize({ width: size.width, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer()

    await writeFile(output, data)
    totals.set(size.width, totals.get(size.width) + data.length)
    sizes.push(`${size.width}px ${format(data.length)}`)
  }

  if (sizes.length > 0) {
    written += 1
    console.log(`  ${name.padEnd(24)} ${format(sourceStat.size).padStart(9)} -> ${sizes.join(', ')}`)
  }
}

console.log(`\n${written} of ${files.length} photos written. Originals: ${format(sourceBytes)}.`)
for (const [width, bytes] of totals) console.log(`  ${width}px set: ${format(bytes)}`)
