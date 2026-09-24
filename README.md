# Wildcard

[![CI](https://github.com/GeorgeRodo/wildcard/actions/workflows/ci.yml/badge.svg)](https://github.com/GeorgeRodo/wildcard/actions/workflows/ci.yml)

**Live:** https://wildcard-green.vercel.app

A full-screen wall of wild animal photos that drifts slowly sideways. Rest
the mouse on a photo and it grows to show the animal's scientific name and
a weird fact.

Press **Spin the wild** and a card shuffles through the wall like a slot
machine, then lands on one of 2,600 real species: its photo, taxonomy,
conservation status, sighting count and a summary. The species come from
[iNaturalist](https://www.inaturalist.org), stored in a Supabase database.

The shuffle clicks as it spins and chimes when it lands. The sounds are
synthesised in the browser with the Web Audio API, so there are no audio
files, and a toggle in the corner mutes them and remembers your choice.
A credits panel beside it lists every photographer.

Built with React, TypeScript, Vite and Supabase.

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
| `npm test`        | Run the tests once                  |
| `npm run test:watch` | Re-run the tests on every change |
| `npm run typecheck` | Type-check without building       |
| `npm run optimize-images` | Build web-sized photos from the originals |
| `npm run seed`    | Fill the Supabase table from iNaturalist |

## Adding an animal

1. Add an entry to `src/data/animals.ts`.
2. Put the original photo in `photos/`, named after the entry's `id`
   (for example `red-fox.jpg`).
3. Run `npm run optimize-images`.

Animals without a photo are skipped, so the grid never shows an empty tile.

## Photos

`photos/` holds the full-size originals and is kept out of git.
`npm run optimize-images` resizes them to WebP files in
`src/assets/animals/`, at 1200px and at 600px in `small/`, which is what
the site loads. Photos that are
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

## Tests

Vitest with React Testing Library, run on every push and pull request by
GitHub Actions, alongside the linter, the type-checker and a production
build.

- **Pure logic:** `chunk`, the edge-fitting maths in `shiftToFit`, and the
  credits parser, including a check that every photo on the wall has a
  credit.
- **Hooks:** `useShuffle` and `useHoverIntent`, with fake timers so the
  tests control time instead of waiting for it: the minimum shuffle
  duration, never repeating an item, mouse hover versus finger taps.
- **Components:** the `Modal`'s focus handling, Tab trapping, Escape, and
  stacked dialogs.
- **The app:** a full shuffle against a mocked database, plus a regression
  test for a real bug where "Spin again" never stopped. With the old
  code put back, that test fails.

## Mobile

Phones have no hover, so a tap opens a photo straight away, a second tap
closes it, and tapping anywhere else closes it too. The wall can also be
swiped either way: it follows the finger, glides on with momentum after a
flick, then eases back into its drift. A swipe that starts on a photo
doesn't open it. Each tap is checked for
the kind of pointer that made it, rather than guessing from the device, so
touch-screen laptops work with a mouse and a finger alike.

Every photo is also built at 600px wide. With `srcset` and `sizes`, the
browser picks the smallest file that is sharp enough for the tile and the
screen: a phone downloads about 2 MB of photos instead of 7.6 MB, and has far
less to hold in memory. The corner buttons and dialogs keep clear of notches
and home bars, and hover styles only apply where there is a real pointer,
so they don't stick after a tap.

## Accessibility

Both dialogs (the shuffle card and the credits) share one `Modal`
component. It moves focus into the dialog when it opens, keeps Tab cycling
inside it, closes on Escape or a click outside, and returns focus to the
button that opened it. Captions stay available to screen readers even while
they are visually hidden, and the sound toggle reports its state with
`aria-pressed`.

## How the layout works

The wall is always five rows tall. Animals are grouped into columns of
five, six columns fit across the screen, and the whole strip drifts
slowly to the left so every animal comes round in turn. The track holds
two copies of the columns: once the first copy has scrolled past, the
offset jumps back by one copy's width, which lands on the matching column
and looks seamless. The offset is written straight to the track's
transform each frame, so scrolling never re-renders React.

Resting on a photo for 0.4 seconds scales it up over its neighbours
rather than resizing it, so nothing else in the wall moves. Scrolling
pauses while a photo is expanded or the shuffle card is open. On portrait
screens two columns fit across instead of six.

The title sits on a scrim, a soft blurred shadow, so it stays readable
whatever photo drifts behind it.

## Project structure

```
src/
├── api/
│   ├── supabase.ts         # reads a random animal from our table
│   └── inaturalist.ts      # fallback: asks iNaturalist directly
├── audio/
│   └── sfx.ts              # synthesised tick, chime and error sounds
├── components/
│   ├── AnimalGrid/         # the scrolling wall; decides which tile is expanded
│   ├── AnimalTile/         # one photo and its caption
│   ├── Credits/            # the credits panel
│   ├── Hero/               # title and button, with the scrim behind them
│   ├── Modal/              # shared dialog: focus, Escape, click outside
│   ├── Showcase/           # the shuffle card, loading and error states
│   ├── ShuffleButton/
│   └── Toolbar/            # sound toggle and credits button
├── data/
│   ├── animals.ts          # the wall's animals: names, descriptions, facts
│   ├── credits.ts          # reads the photo credits from CREDITS.md
│   └── gallery.ts          # matches each animal to its photo
├── hooks/
│   ├── useHoverIntent.ts   # waits until the pointer rests on a photo
│   ├── useMarquee.ts       # scrolls the wall left, frame by frame
│   ├── useShuffle.ts       # the slot-machine flicker
│   ├── useRandomSpecies.ts # fetching, prefetching, errors and retries
│   └── useSoundEnabled.ts  # the mute setting, remembered between visits
├── utils/
│   ├── chunk.ts
│   └── shiftToFit.ts       # keeps expanded tiles inside the window
└── styles/
    └── global.css
scripts/
├── optimize-images.mjs     # resizes photos to WebP
└── seed-animals.mjs        # harvests species into Supabase
supabase/
└── schema.sql              # table, read-only policy, random_animal()
```
