# emdash-bootstrap-theme

Bootstrap 5.3 starter theme for [EmDash CMS](https://emdash.dev), built with Astro. Includes a blog with posts, pages, categories, tags, search, RSS, and comments — all styled with Bootstrap components and Bootstrap's native dark mode.

## Features

- **Bootstrap 5.3** — full component library, CSS variables, native dark/light mode
- **Blog** — post archive, single post with sidebar, categories, tags
- **CMS pages** — dynamic pages via EmDash
- **Search** — built-in search page
- **RSS feed** — auto-generated at `/rss.xml`
- **Dark mode** — toggled via cookie, persisted across sessions
- **Visual editing** — EmDash live edit support out of the box
- **Server-rendered** — Astro SSR with Node.js standalone adapter

## Project Structure

```
src/
├── layouts/Base.astro           # Navbar, footer, dark mode toggle
├── components/PostCard.astro    # Bootstrap card for post listings
├── pages/
│   ├── index.astro              # Home: hero + card grid
│   ├── 404.astro
│   ├── rss.xml.ts
│   ├── search.astro
│   ├── posts/
│   │   ├── index.astro          # Post archive
│   │   └── [slug].astro         # Single post with sidebar
│   ├── pages/[slug].astro       # CMS static pages
│   ├── category/[slug].astro
│   └── tag/[slug].astro
├── styles/theme.css             # Bootstrap CSS variable overrides
└── utils/reading-time.ts        # Reading time helper for portable text
seed/seed.json                   # Collections, taxonomies, and demo content
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (this package is part of the EmDash CMS monorepo)

### Setup

```bash
pnpm install

# Initialize the database and seed demo content
pnpm --filter @emdash-cms/template-bootstrap bootstrap

# Start the dev server
pnpm --filter @emdash-cms/template-bootstrap dev
```

The dev server runs at `http://localhost:4321`.

To access the admin panel without passkey during development:

```
http://localhost:4321/_emdash/api/setup/dev-bypass?redirect=/_emdash/admin
```

### Other scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Build for production |
| `pnpm start` | Run the production build |
| `pnpm seed` | Re-seed the database |
| `pnpm typecheck` | Run Astro type checking |

## Customization

- **Colors and tokens** — edit `src/styles/theme.css` to override Bootstrap CSS variables (`:root`)
- **Site title / tagline** — update `siteTitle` in `Base.astro` and `settings.title` in `seed/seed.json`
- **Navigation** — edit the `menus` section in `seed/seed.json` or manage it in the admin UI under Appearance → Menus
- **Sidebar widgets** — configure in the admin UI under Appearance → Widget Areas → Sidebar

## EmDash Conventions

- All pages use `output: "server"` (SSR) — no static generation
- Call `Astro.cache.set(cacheHint)` after every `getEmDashCollection` / `getEmDashEntry` call
- `entry.id` is the slug (used in URLs); `entry.data.id` is the ULID (used for API calls)
- Images are objects `{ id, src?, alt? }` — render them with `<Image image={...} />` from `emdash/ui`
- Every layout must include `<EmDashHead>`, `<EmDashBodyStart>`, and `<EmDashBodyEnd>`
- Enable visual editing by spreading `{...entry.edit.fieldName}` on editable elements

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
