import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineProject } from 'vitest/config';

export default defineProject({
  plugins: [svelte({ configFile: false })],
  resolve: {
    alias: {
      '@unschema-graph/svelte/Schema.svelte': fileURLToPath(
        new URL('./src/Schema.svelte', import.meta.url)
      ),
      '@unschema-graph/svelte': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
    },
  },
  test: {
    name: 'svelte',
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
