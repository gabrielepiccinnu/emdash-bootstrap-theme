# EmDash Bootstrap 5 Starter Theme

A full-featured blog starter theme for [EmDash CMS](https://emdashcms.com), built with [Bootstrap 5.3](https://getbootstrap.com).

## Features

- **Bootstrap 5.3** — installed via npm, not CDN. Tree-shakeable, works with any Bootstrap tooling.
- **Native dark mode** — Bootstrap `data-bs-theme` attribute, toggled by a 3-button switcher (Light / Dark / Auto). Preference persisted in a cookie; applied before paint to prevent flash.
- **Responsive navbar** — sticky top bar with dropdown sub-menu support (one level deep). Driven by EmDash menu system.
- **Live search** — `emdash/ui` `<LiveSearch>` component integrated in the navbar. Keyboard shortcut: `Ctrl+K` / `⌘K`.
- **Hero + grid home page** — first post with a featured image becomes the full-width hero; remaining posts render as a `col-sm-6 col-lg-4` card grid.
- **Post archive** — `list-group` layout with byline, date, reading time, excerpt, and tag badges.
- **Single post** — hero image, breadcrumb, byline with avatars, PortableText content, sticky sidebar with TOC (auto-built from `h2`/`h3` headings) and widget area, "Continue reading" section.
- **Category & tag archives** — filtered collections with post count.
- **Full-text search page** — server-side search across title, excerpt, and content.
- **CMS pages** — generic slug-based page renderer for About, Contact, etc.
- **Comments** — EmDash built-in comment system with threaded replies.
- **Widget areas** — `sidebar` and `footer` widget areas, driven by EmDash `<WidgetArea>`.
- **RSS feed** — `/rss.xml` auto-generated from published posts.
- **404 page** — custom with Home and Browse links.
- **SEO** — `getSeoMeta()` on post pages; Open Graph image, canonical URL, article metadata.
- **Reading time** — word-count based estimate (200 wpm) from PortableText content.

---

## Pages

| URL | File | Description |
|-----|------|-------------|
| `/` | `src/pages/index.astro` | Home: hero post + 6-post grid |
| `/posts` | `src/pages/posts/index.astro` | All posts archive (list layout) |
| `/posts/[slug]` | `src/pages/posts/[slug].astro` | Single post with sidebar + comments |
| `/pages/[slug]` | `src/pages/pages/[slug].astro` | CMS pages (About, etc.) |
| `/category/[slug]` | `src/pages/category/[slug].astro` | Category archive |
| `/tag/[slug]` | `src/pages/tag/[slug].astro` | Tag archive |
| `/search` | `src/pages/search.astro` | Full-text search results |
| `/rss.xml` | `src/pages/rss.xml.ts` | RSS feed |
| `/404` | `src/pages/404.astro` | Not found page |

---

## Project Structure

```
emdash-bootstrap-theme/
├── astro.config.mjs          # Astro config: Node adapter, emdash() integration, SQLite
├── emdash-env.d.ts           # Auto-generated TypeScript types (run: npx emdash types)
├── package.json
├── tsconfig.json
├── seed/
│   └── seed.json             # Schema + demo content (posts, pages, categories, tags, menus)
└── src/
    ├── live.config.ts        # Registers the _emdash live collection (boilerplate)
    ├── styles/
    │   └── theme.css         # Bootstrap CSS variable overrides + article prose styles
    ├── utils/
    │   └── reading-time.ts   # extractText(), getReadingTime(), formatReadingTime()
    ├── layouts/
    │   └── Base.astro        # HTML shell, Bootstrap navbar, footer, dark mode switcher
    ├── components/
    │   └── PostCard.astro    # Bootstrap card with image zoom, bylines, tags, reading time
    └── pages/
        ├── index.astro
        ├── 404.astro
        ├── rss.xml.ts
        ├── search.astro
        ├── posts/
        │   ├── index.astro
        │   └── [slug].astro
        ├── pages/
        │   └── [slug].astro
        ├── category/
        │   └── [slug].astro
        └── tag/
            └── [slug].astro
```

---

## Getting Started

### Prerequisites

- **Node.js** 22+
- **pnpm** 10+

### Installation (standalone)

```bash
# Clone or copy this theme
git clone https://github.com/gabrielepiccinnu/emdash-bootstrap-theme.git my-blog
cd my-blog

# Install dependencies
pnpm install

# Set up the database and seed demo content
pnpm bootstrap

# Start the dev server
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321) for the site and [http://localhost:4321/_emdash/admin](http://localhost:4321/_emdash/admin) for the admin panel.

> **Dev mode:** Passkey authentication is bypassed automatically in development. If you see the login screen, visit:
> `http://localhost:4321/_emdash/api/setup/dev-bypass?redirect=/_emdash/admin`

### Installation (inside the EmDash monorepo)

```bash
# From the monorepo root
pnpm --filter @emdash-cms/template-bootstrap bootstrap
pnpm --filter @emdash-cms/template-bootstrap dev
```

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `astro dev` | Start dev server |
| `build` | `astro build` | Production build |
| `bootstrap` | `emdash init && emdash seed` | Initialize DB and seed demo content |
| `seed` | `emdash seed` | Re-apply seed (skips already existing entries) |

---

## Customization

### Site title and tagline

Edit `seed/seed.json` → `settings.title` and `settings.tagline`.

Then update the hardcoded `siteTitle` in `src/layouts/Base.astro` and `src/pages/posts/[slug].astro` to match.

### Colors and typography

Override Bootstrap CSS custom properties in `src/styles/theme.css`:

```css
:root {
  --bs-primary: #your-color;
  --bs-primary-rgb: r, g, b;
  --bs-body-font-family: 'YourFont', system-ui, sans-serif;
  --bs-border-radius: 0.5rem;
}
```

The full list of available variables is at [getbootstrap.com/docs/5.3/customize/css-variables](https://getbootstrap.com/docs/5.3/customize/css-variables/).

### Navigation menu

Go to the admin panel → **Menus** → **Primary**.

- Add pages, posts, taxonomy terms, or custom links.
- Drag items vertically to reorder.
- Drag an item to the **right** to nest it as a sub-item (creates a Bootstrap dropdown).
- Drag an item to the **left** to promote it back to the top level.
- Use the **←** / **→** buttons for keyboard-accessible nesting.

Only one level of nesting is supported (Bootstrap navbar convention).

### Widget areas

Two widget areas are available:

- **`sidebar`** — shown on single post pages (desktop only, sticky).
- **`footer`** — shown in the site footer.

Manage widgets at admin → **Widgets**.

### Adding content fields

Edit `seed/seed.json` → `collections[].fields` to add new fields, then run:

```bash
pnpm seed            # applies schema changes
npx emdash types     # regenerates emdash-env.d.ts
```

Use the new field in templates via `post.data.your_field`.

---

## Content Types

### Posts collection

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Post title (required, searchable) |
| `featured_image` | `image` | Hero image — use the EmDash `<Image>` component |
| `content` | `portableText` | Rich text body (searchable) |
| `excerpt` | `text` | Short summary shown in cards and archive |

Supports: drafts, revisions, search, SEO, comments, bylines, categories, tags.

### Pages collection

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Page title (required) |
| `content` | `portableText` | Page body |

---

## Dark Mode

Bootstrap 5.3 dark mode works by setting `data-bs-theme="dark"` on the `<html>` element.

This theme stores the user's preference in a cookie (`theme=dark|light`; omitted for Auto). An inline script in `<head>` reads the cookie and sets the attribute before the page renders, preventing any flash of wrong theme.

The three-button switcher in the navbar updates both the attribute and the cookie on click, and listens for `prefers-color-scheme` changes when set to Auto.

---

## RSS Feed

The RSS feed at `/rss.xml` includes all published posts with title, description (excerpt), publication date, and link.

To change the feed title and description, edit `src/pages/rss.xml.ts`.

---

## Deployment

This theme uses `@astrojs/node` in standalone mode. After building:

```bash
pnpm build
node dist/server/entry.mjs
```

For Cloudflare Workers deployment, see the [EmDash Cloudflare documentation](https://docs.emdashcms.com).

### Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite file path | `file:./data.db` |
| `PORT` | Server port | `4321` |
| `HOST` | Server host | `localhost` |

---

## TypeScript

Run `npx emdash types` after changing `seed/seed.json` to regenerate `emdash-env.d.ts`. This file gives you full autocompletion for `post.data.*`, `page.data.*`, etc.

The theme uses strict TypeScript (`astro/tsconfigs/base` + `"types": ["node"]`).

---

## Known Limitations

- **No pagination** — the post archive (`/posts`) renders all posts. For sites with many posts, add a `limit` + offset parameter to `getEmDashCollection()` and a `<nav>` pagination component.
- **One level of sub-menus** — Bootstrap navbar dropdowns support one level. Deeper nesting is intentionally not implemented.
- **Sidebar hidden on mobile** — the sidebar (TOC + widgets) is `d-none d-lg-block`. On smaller screens, the TOC is not accessible. Consider adding a collapsible version for mobile.
- **Search is server-side only** — `/search` loads all posts in memory and filters them. For large sites, use EmDash live search (`<LiveSearch>`) instead, which uses the database index.

---

## Contributing

This theme is open source. Issues and PRs are welcome at [github.com/gabrielepiccinnu/emdash-bootstrap-theme](https://github.com/gabrielepiccinnu/emdash-bootstrap-theme).

---

## License

MIT
