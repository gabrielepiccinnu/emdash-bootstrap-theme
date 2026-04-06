# EmDash Bootstrap 5 Theme

A full-featured EmDash CMS starter theme built with Bootstrap 5.3. Includes a blog with posts, pages, categories, tags, search, RSS, and comments — all styled with Bootstrap components and Bootstrap's built-in dark mode.

## Template Structure

```
src/
├── layouts/Base.astro           # Bootstrap navbar + footer + dark mode
├── components/PostCard.astro    # Bootstrap card for post listings
├── pages/
│   ├── index.astro              # Home: hero + Bootstrap card grid
│   ├── 404.astro
│   ├── rss.xml.ts
│   ├── search.astro
│   ├── posts/
│   │   ├── index.astro          # Archive list
│   │   └── [slug].astro         # Single post with sidebar
│   ├── pages/[slug].astro       # CMS pages
│   ├── category/[slug].astro
│   └── tag/[slug].astro
├── styles/theme.css             # Bootstrap CSS variable overrides
└── utils/reading-time.ts        # Portable text reading time helper
seed/seed.json                   # Collections, taxonomies, demo content
```

## Bootstrap Integration

- Bootstrap 5.3 installed via npm (`bootstrap` package)
- CSS imported in `Base.astro` frontmatter: `import 'bootstrap/dist/css/bootstrap.min.css'`
- JS imported in `<script>` tag for Vite bundling (Dropdown, Collapse, etc.)
- Dark mode via `data-bs-theme="dark|light"` on `<html>` — Bootstrap 5.3 native
- Theme preference persisted in a cookie (`theme=dark|light|auto`)

## EmDash Conventions

- All pages are server-rendered (`output: "server"` in astro.config.mjs)
- Always call `Astro.cache.set(cacheHint)` after `getEmDashCollection` / `getEmDashEntry`
- `entry.id` = slug (for URLs), `entry.data.id` = ULID (for API calls)
- Images are objects `{ id, src?, alt? }` — render with `<Image image={...} />` from `emdash/ui`
- `EmDashHead`, `EmDashBodyStart`, `EmDashBodyEnd` must be present in every layout
- Visual editing: spread `{...entry.edit.fieldName}` on editable elements

## Local Dev

```bash
pnpm install
pnpm --filter @emdash-cms/template-bootstrap bootstrap
pnpm --filter @emdash-cms/template-bootstrap dev
```

Dev bypass (skips passkey): `http://localhost:4321/_emdash/api/setup/dev-bypass?redirect=/_emdash/admin`

## Customization

- **Colors / Bootstrap tokens**: edit `src/styles/theme.css` — override `:root` CSS variables
- **Site title / tagline**: update `Base.astro` (`siteTitle`) and `seed/seed.json` (`settings.title`)
- **Navigation**: edit `seed/seed.json` under `menus` (primary) or manage in the admin UI
- **Sidebar widgets**: configure in admin UI under Appearance → Widget Areas → Sidebar
