# Gambling Nature

A full-screen wall of wild animal photos. Rest the mouse on a photo for a
second and it expands to show the animal's scientific name, a short
description and a weird fact.

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

## Adding an animal

1. Add an entry to `src/data/animals.ts`.
2. Put its photo in `src/assets/animals/`, named after the entry's `id`
   (for example `red-fox.jpg`).

Animals without a photo are skipped, so the grid never shows an empty tile.

## How the layout works

The screen is split evenly between all photos. `splitIntoRows` uses
`floor(√n)` rows and spreads the photos across them so row lengths differ
by at most one, e.g. 4 photos → 2 × 2, 5 → 3 + 2. On portrait screens the
rows turn into columns.

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
│   └── useHoverIntent.ts
├── utils/
│   └── splitIntoRows.ts
└── styles/
    └── global.css
```
