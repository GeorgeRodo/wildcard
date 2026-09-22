/**
 * Resizes the originals in photos/ into web-sized WebP files in
 * src/assets/animals/, which is what the site loads.
 *
 * Run with: npm run optimize-images
 */
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import sharp from 'sharp'

const SOURCE_DIR = 'photos'
const OUTPUT_DIR = join('src', 'assets', 'animals')
const MAX_WIDTH = 1200
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

await mkdir(OUTPUT_DIR, { recursive: true })

let sourceBytes = 0
let outputBytes = 0
let written = 0

for (const file of files.sort()) {
  const source = join(SOURCE_DIR, file)
  const output = join(OUTPUT_DIR, `${basename(file, extname(file))}.webp`)

  const sourceStat = await stat(source)
  sourceBytes += sourceStat.size

  // Skip anything already converted since the original last changed.
  if (!force && (await modifiedTime(output)) > sourceStat.mtimeMs) {
    outputBytes += (await stat(output)).size
    console.log(`  skipped  ${file} (already up to date)`)
    continue
  }

  const data = await sharp(source)
    .rotate() // honour the EXIF orientation before it is stripped
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer()

  await writeFile(output, data)
  outputBytes += data.length
  written += 1
  console.log(`  ${basename(output).padEnd(24)} ${format(sourceStat.size).padStart(9)} -> ${format(data.length)}`)
}

const saved = sourceBytes > 0 ? Math.round((1 - outputBytes / sourceBytes) * 100) : 0
console.log(
  `\n${written} of ${files.length} written. ${format(sourceBytes)} -> ${format(outputBytes)} (${saved}% smaller).`,
)
