import schemaGraph from '@unschema-graph/astro/integration';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [schemaGraph()],
});
