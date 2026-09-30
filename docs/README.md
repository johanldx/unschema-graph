# unschema-graph documentation

The documentation site is built with Astro Starlight. English is served at the site root and the
complete French translation is served from `/fr/`.

## Development

```bash
npm install
npm run dev
```

Use `npm run typecheck` to validate the project and `npm run build` to generate the production site
in `dist/`.

## Content structure

English pages live directly in `src/content/docs/`. French translations live in
`src/content/docs/fr/` and use the same relative paths and filenames so Starlight can associate each
translation pair.

The library is consumed locally through the `@unschema-graph/*` workspace packages.

## AI-readable documentation

The static build also generates:

- `llms.txt`, a concise discovery index;
- `llms-full.txt`, the complete English documentation bundle;
- a raw `.md` route for every English documentation page.

These English-only AI routes are generated from the same Markdown sources as the Starlight site.

Builder reference pages are generated from `src/data/builders.mjs`. Run `npm run generate:builders`
after changing the registry; development and production builds run this command automatically.
