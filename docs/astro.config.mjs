// @ts-check

import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import { builderGroups } from './src/data/builders.mjs';
import { recipeGroups } from './src/data/recipes.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://unschema-graph.jhdx.dev',
  base: '/',
  vite: {
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (
            warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
            warning.message.includes('use astro:head-inject')
          ) {
            return;
          }
          warn(warning);
        },
      },
    },
  },
  integrations: [
    starlight({
      title: 'unschema-graph',
      description:
        'Type-safe Schema.org JSON-LD builders and graph tooling for Core TypeScript, Astro, and Svelte 5.',
      disable404Route: true,
      locales: {
        root: { label: 'English', lang: 'en' },
        fr: { label: 'Français', lang: 'fr' },
      },
      editLink: {
        baseUrl: 'https://github.com/johanldx/unschema-graph/edit/main/docs/',
      },
      lastUpdated: true,
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/johanldx/unschema-graph',
        },
      ],
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'describedby',
            href: '/llms.txt',
            type: 'text/markdown',
          },
        },
      ],
      components: {
        Header: './src/components/Header.astro',
        PageTitle: './src/components/PageTitle.astro',
        SiteTitle: './src/components/SiteTitle.astro',
        Footer: './src/components/Footer.astro',
      },
      customCss: [
        '@fontsource-variable/instrument-sans/wght.css',
        '@fontsource/commit-mono/400.css',
        '@fontsource/commit-mono/600.css',
        '@fontsource/cormorant-garamond/400.css',
        '@fontsource/cormorant-garamond/600.css',
        '@fontsource/cormorant-garamond/600-italic.css',
        './src/styles/tokens.css',
        './src/styles/theme.css',
      ],
      sidebar: [
        {
          label: 'Get started',
          translations: { fr: 'Bien démarrer' },
          items: [
            { slug: 'getting-started/overview' },
            { slug: 'getting-started/choose-your-environment' },
            { slug: 'getting-started/installation' },
            {
              label: 'First schema',
              translations: { fr: 'Premier schéma' },
              items: [
                {
                  slug: 'getting-started/quick-start/astro',
                  badge: {
                    text: 'Astro',
                    class: 'tech-badge tech-badge--astro',
                  },
                },
                {
                  slug: 'getting-started/quick-start/svelte',
                  badge: { text: 'Svelte', class: 'tech-badge tech-badge--svelte' },
                },
                {
                  slug: 'getting-started/quick-start/core',
                  badge: { text: 'TypeScript', class: 'tech-badge tech-badge--typescript' },
                },
              ],
            },
          ],
        },
        {
          label: 'Learn',
          translations: { fr: 'Apprendre' },
          items: [
            { slug: 'guides/mental-model' },
            { slug: 'guides/entities-types-and-properties' },
            { slug: 'guides/identities' },
            { slug: 'guides/graphs-and-references' },
            { slug: 'guides/validation' },
            { slug: 'guides/dates-and-durations' },
            { slug: 'architecture/pipeline' },
            { slug: 'audit-and-quality/security' },
          ],
        },
        {
          label: 'Recipes',
          translations: { fr: 'Recettes' },
          items: recipeGroups.map((group) => ({
            label: group.label,
            translations: { fr: group.labelFr },
            items: group.recipes.map((recipe) => ({ slug: `recipes/${recipe.slug}` })),
          })),
        },
        {
          label: 'Reference',
          translations: { fr: 'Référence' },
          items: [
            {
              slug: 'integrations/astro',
              badge: { text: 'Astro', class: 'tech-badge tech-badge--astro' },
            },
            {
              slug: 'integrations/svelte',
              badge: { text: 'Svelte', class: 'tech-badge tech-badge--svelte' },
            },
            {
              slug: 'integrations/core',
              badge: { text: 'TypeScript', class: 'tech-badge tech-badge--typescript' },
            },
            { slug: 'reference/component' },
            {
              label: 'Schema builders',
              translations: { fr: 'Builders Schema' },
              items: [
                { slug: 'reference/builders' },
                ...builderGroups.map((group) => ({
                  label: group.label,
                  translations: { fr: group.labelFr },
                  collapsed: true,
                  items: group.builders.map((builder) => ({
                    slug: `reference/builders/${builder.slug}`,
                  })),
                })),
              ],
            },
            { slug: 'reference/helpers' },
            { slug: 'reference/configuration' },
            { slug: 'reference/compatibility' },
            { slug: 'guides/custom-schemas' },
            { slug: 'audit-and-quality/audit-api' },
            { slug: 'guides/voice-and-ai-speakable' },
          ],
        },
        {
          label: 'Operations',
          translations: { fr: 'Exploitation' },
          items: [
            { slug: 'audit-and-quality/audit-cli' },
            { slug: 'operations/troubleshooting' },
            { slug: 'reference/compatibility' },
            { slug: 'operations/migrations' },
            { slug: 'operations/known-limitations' },
            { slug: 'ai/implementation-guide' },
            { slug: 'ai/using-markdown' },
          ],
        },
      ],
    }),
  ],
});
