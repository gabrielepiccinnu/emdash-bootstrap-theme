# EmDash Bootstrap 5 Theme — Developer Reference

A full-featured EmDash CMS starter theme built with Bootstrap 5.3. Includes a blog with posts, pages, categories, tags, search, RSS, and comments — all styled with Bootstrap components and Bootstrap's built-in dark mode.

---

## Project Structure

```
emdash-bootstrap-theme/
├── astro.config.mjs             # Astro config: Node adapter, emdash(), SQLite, Vite fs.allow
├── emdash-env.d.ts              # Auto-generated types — regenerate with: npx emdash types
├── package.json
├── tsconfig.json
├── seed/
│   └── seed.json                # Schema (collections, fields, taxonomies) + demo content
└── src/
    ├── live.config.ts           # Boilerplate: registers _emdash live collection
    ├── styles/
    │   └── theme.css            # Bootstrap CSS variable overrides + article prose styles
    ├── utils/
    │   └── reading-time.ts      # extractText(), getReadingTime(), formatReadingTime()
    ├── layouts/
    │   └── Base.astro           # HTML shell, navbar, footer, dark mode switcher
    ├── components/
    │   └── PostCard.astro       # Bootstrap card: image, bylines, date, reading time, tags
    └── pages/
        ├── index.astro          # Home: hero featured post + 6-post card grid
        ├── 404.astro
        ├── rss.xml.ts
        ├── search.astro         # Server-side full-text search
        ├── posts/
        │   ├── index.astro      # All posts archive (list-group layout)
        │   └── [slug].astro     # Single post: hero, content, sidebar, comments
        ├── pages/[slug].astro   # CMS pages (About, Contact, etc.)
        ├── category/[slug].astro
        └── tag/[slug].astro
```

---

## Bootstrap Integration

- Bootstrap 5.3 installed via npm (`bootstrap` package in `dependencies`)
- CSS imported in `Base.astro` frontmatter: `import 'bootstrap/dist/css/bootstrap.min.css'`
- JS imported in a `<script>` tag for Vite bundling: `import 'bootstrap/dist/js/bootstrap.bundle.min.js'`
  - `bootstrap.bundle` includes Popper — required for dropdowns, tooltips, modals
- Dark mode: `data-bs-theme="dark|light"` on `<html>` — Bootstrap 5.3 native, no `.dark` class needed
- Theme preference stored in cookie `theme=dark|light` (absent = Auto)
- Anti-FOUC inline script in `<head>` reads the cookie and sets `data-bs-theme` before paint

---

## EmDash Conventions

### Required layout hooks

Every layout must include:
```astro
import { EmDashHead, EmDashBodyStart, EmDashBodyEnd } from "emdash/ui";
// In <head>:
<EmDashHead page={pageCtx} />
// First in <body>:
<EmDashBodyStart page={pageCtx} />
// Last in <body>:
<EmDashBodyEnd page={pageCtx} />
```

These inject the admin toolbar, visual editing markers, and plugin contributions.

### Page context

`createPublicPageContext()` is required to build the `page` object passed to the hooks:
```ts
import { createPublicPageContext } from "emdash/page";
const pageCtx = createPublicPageContext({ Astro, kind: "custom", ... });
```

### Cache hints

Always call `Astro.cache.set(cacheHint)` after `getEmDashCollection` / `getEmDashEntry`. This enables automatic cache invalidation when content is published or updated.

### Entry shape

- `entry.id` → slug string (use for URL construction: `/posts/${entry.id}`)
- `entry.data.id` → ULID (use for API calls, taxonomy lookups, comments)
- `entry.data.publishedAt` → `Date | null`
- `entry.data.bylines` → `ContentBylineCredit[]` (eagerly hydrated)
- `entry.edit` → spread onto editable elements for visual editing: `{...entry.edit.title}`

### Images

Image fields return an object `{ id, src?, alt?, width?, height?, meta? }`, not a plain string. Always render with:
```astro
import { Image } from "emdash/ui";
<Image image={post.data.featured_image} class="..." />
```

### Querying

```ts
import { getEmDashCollection, getEmDashEntry, getEntryTerms, getMenu } from "emdash";

// List
const { entries: posts, cacheHint } = await getEmDashCollection("posts", {
  orderBy: { published_at: "desc" },
  limit: 10,
  where: { tag: "bootstrap" },
});

// Single entry
const { entry: post, cacheHint } = await getEmDashEntry("posts", slug);
if (!post) return Astro.redirect("/404");

// Taxonomy terms on an entry
const tags = await getEntryTerms("posts", post.data.id, "tag");

// Navigation menu
const menu = await getMenu("primary");
// menu.items[n].children[] for sub-items (Bootstrap dropdowns)
```

---

## Menu Sub-items

The navbar in `Base.astro` renders one level of nesting as Bootstrap dropdowns:

```astro
{menu?.items.map((item) =>
  item.children && item.children.length > 0 ? (
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown">...</a>
      <ul class="dropdown-menu">
        {item.children.map((child) => <li><a class="dropdown-item">...</a></li>)}
      </ul>
    </li>
  ) : (
    <li class="nav-item"><a class="nav-link">...</a></li>
  )
)}
```

In the admin (Menus → Primary), drag items right to nest them, left to promote. Max one level enforced.

---

## Vite / Monorepo Note

When running inside the EmDash monorepo (which lives in a sibling directory), Vite's `server.fs.allow` must include the monorepo root. This is configured in `astro.config.mjs`:

```js
vite: {
  server: {
    fs: {
      allow: [path.resolve("../emdash")],
    },
  },
},
```

Without this, the admin UI assets (served from `packages/core`) fail to load in dev mode.

---

## Local Development

### Standalone

```bash
pnpm install
pnpm bootstrap   # emdash init && emdash seed
pnpm dev         # http://localhost:4321
```

Dev bypass (skips passkey auth in dev mode):
```
http://localhost:4321/_emdash/api/setup/dev-bypass?redirect=/_emdash/admin
```

### Inside the EmDash monorepo

```bash
# From monorepo root (d:\Sviluppo Web\EMDASH CMS\emdash)
pnpm --filter @emdash-cms/template-bootstrap bootstrap
pnpm --filter @emdash-cms/template-bootstrap dev
```

The package is registered in the monorepo via a symlink:
`templates/emdash-bootstrap-theme → ../../emdash-bootstrap-theme`

And the path is explicitly listed in `pnpm-workspace.yaml`:
```yaml
packages:
  - templates/*
  - ../emdash-bootstrap-theme   # resolves the symlink for pnpm
```

---

## Customization Guide

| What to change | Where |
|----------------|-------|
| Site title / tagline | `seed/seed.json` → `settings` + `Base.astro` `siteTitle` constant |
| Primary color | `src/styles/theme.css` → `--bs-primary` |
| Body font | `src/styles/theme.css` → `--bs-body-font-family` |
| Navigation | Admin → Menus → Primary |
| Sidebar widgets | Admin → Widgets → Sidebar |
| Footer widgets | Admin → Widgets → Footer |
| Post fields | `seed/seed.json` → `collections[0].fields`, then `npx emdash types` |
| Article prose styles | `src/styles/theme.css` → `.article-content *` rules |
| Card layout | `src/components/PostCard.astro` |
| Home hero | `src/pages/index.astro` |

---

## TypeScript

- `emdash-env.d.ts` is auto-generated — do not edit manually. Regenerate with `npx emdash types`.
- `tsconfig.json` extends `astro/tsconfigs/base` with `"types": ["node"]`.
- The theme is fully typed: all `post.data.*` fields are inferred from the collection schema.

---

## Known Limitations

- **No pagination** — `/posts` renders all posts. Add `limit` + page offset to `getEmDashCollection()` for large sites.
- **One level of sub-menus** — Bootstrap navbar dropdowns do not support grandchildren. Enforced in UI.
- **Sidebar hidden on mobile** — `d-none d-lg-block`. TOC is inaccessible on small screens.
- **Search loads all posts** — `/search` filters in memory. Use `<LiveSearch>` for large datasets.
