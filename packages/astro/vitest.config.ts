/// <reference types="vitest/config" />

import { fileURLToPath } from 'node:url';
import { getViteConfig } from 'astro/config';

export default getViteConfig(
  {
    resolve: {
      alias: {
        '@unschema-graph/astro/Schema.astro': fileURLToPath(
          new URL('./src/Schema.astro', import.meta.url)
        ),
        '@unschema-graph/astro/content': fileURLToPath(
          new URL('./src/content.ts', import.meta.url)
        ),
        '@unschema-graph/astro/integration': fileURLToPath(
          new URL('./src/integration.ts', import.meta.url)
        ),
        '@unschema-graph/astro': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      },
    },
    test: {
      name: 'astro',
      environment: 'node',
      include: ['tests/**/*.test.ts'],
    },
  },
  {
    logLevel: 'error',
  }
);
