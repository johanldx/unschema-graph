import { fileURLToPath } from 'node:url';
import { defineProject } from 'vitest/config';

export default defineProject({
  resolve: {
    alias: {
      '@unschema-graph/core/audit': fileURLToPath(new URL('./src/core/audit.ts', import.meta.url)),
      '@unschema-graph/core': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
    },
  },
  test: {
    name: 'core',
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
