# Wildcard

A full-screen wall of wild animal photos. Rest the mouse on a photo and it
expands to show the animal's scientific name, a short description and a
weird fact.

Press **Pick an animal** and the wall shuffles like a slot machine, then
lands on a real species pulled live from the
[iNaturalist API](https://api.inaturalist.org/v1/docs/): its photo,
taxonomy, conservation status, sighting count and a summary.

Built with React, TypeScript and Vite.

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start the dev server                |
| `npm run build`   | Type-check and build for production |
| `npm run preview` | Preview the production build        |
| `npm run lint`    | Lint the project with Oxlint        |
| `npm run optimize-images` | Build web-sized photos from the originals |

## Adding an animal

1. Add an entry to `src/data/animals.ts`.
2. Put the original photo in `photos/`, named after the entry's `id`
   (for example `red-fox.jpg`).
3. Run `npm run optimize-images`.

Animals without a photo are skipped, so the grid never shows an empty tile.

## Photos

`photos/` holds the full-size originals and is kept out of git.
`npm run optimize-images` resizes them to 1200px WebP files in
`src/assets/animals/`, which is what the site loads. Photos that are
already converted are skipped; pass `--force` to rebuild them all.

The web-sized photos are committed; the originals are not. Every photo
comes from Wikimedia Commons, and [CREDITS.md](CREDITS.md) lists the
photographer and licence for each one.

Keeping the originals out of the build matters here: every photo on the
page is decoded into memory at once, so full-size files make the page slow
to load and heavy to render.

## Live data

Species come from a Supabase table seeded from iNaturalist. Asking
iNaturalist directly works, but their search takes three to ten seconds,
which is far too long to wait after a button press. Harvesting once and
reading a random row takes milliseconds.

- `supabase/schema.sql` — the table, its read-only row-level security
  policy, and a `random_animal()` function that skips recently seen ids.
- `scripts/seed-animals.mjs` — harvests species from iNaturalist and
  upserts them. Run with `npm run seed`.
- `src/api/supabase.ts` — reads one random row.
- `src/api/inaturalist.ts` — the fallback, used when Supabase is
  unreachable or unconfigured, so the site still works either way.
- `useRandomSpecies` — owns loading, error and retry states, times out,
  waits for the photo to load before showing a card, keeps one animal
  prefetched so the next press is instant, and remembers the last ten so
  they don't repeat.

Only observations can be filtered by photo licence, so both paths use that
endpoint rather than the taxa one: the site may only show photos it is
allowed to show, and each photographer is credited on the card.

### Setting it up

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy `.env.example` to `.env.local` and fill in the URL, the anon key
   and the service role key.
4. `npm run seed`

## How the layout works

The wall is always four rows tall. Animals are grouped into columns of
four, six columns fit across the screen, and the whole strip drifts
slowly to the left so every animal comes round in turn. The track holds
two copies of the columns: once the first copy has scrolled past, the
offset jumps back by one copy's width, which lands on the matching column
and looks seamless.

Scrolling pauses while a photo is expanded. On portrait screens two
columns fit across instead of six.

## Project structure

```
src/
├── components/
│   ├── AnimalGrid/    # lays out the rows and decides which tile is expanded
│   └── AnimalTile/    # one photo and its caption
├── data/
│   ├── animals.ts     # names, descriptions and facts
│   └── gallery.ts     # matches each animal to its photo
├── hooks/
│   ├── useHoverIntent.ts   # waits until the pointer rests on a photo
│   └── useMarquee.ts       # scrolls the wall left, frame by frame
├── utils/
│   └── chunk.ts
└── styles/
    └── global.css
```
