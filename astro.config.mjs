import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";
import { multilanguagePlugin } from "@emdash-cms/plugin-multilanguage";
import path from "node:path";

export default defineConfig({
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	// i18n config is required for EmDash admin locale features (locale filter,
	// translation panel). Keep this in sync with active languages in the plugin.
	// The [locale] dynamic routes work for ANY locale; this config only enables
	// Astro.currentLocale + admin manifest data + prefixDefaultLocale redirects.
	i18n: {
		defaultLocale: "en",
		locales: ["en", "it"],
		routing: {
			// false = Astro non prefissa gli entry.id con la locale,
			// quindi post.id rimane "my-slug" e non "en/my-slug".
			// I nostri [locale]/ routes gestiscono manualmente il prefisso.
			prefixDefaultLocale: false,
		},
	},
	integrations: [
		react(),
		emdash({
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
			plugins: [multilanguagePlugin()],
		}),
	],
	devToolbar: { enabled: false },
	vite: {
		server: {
			fs: {
				// Allow Vite to serve files from the project root and the monorepo (sibling)
				allow: [path.resolve("."), path.resolve("../emdash")],
			},
		},
	},
});
