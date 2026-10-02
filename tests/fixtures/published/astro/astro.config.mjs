import integration, { schemaGraph } from '@unschema-graph/astro';
import { defineConfig } from 'astro/config';

if (typeof integration !== 'function' || integration !== schemaGraph) {
  throw new TypeError('The package root must expose the Astro integration as its default export.');
}

export default defineConfig({
  integrations: [integration()],
});
