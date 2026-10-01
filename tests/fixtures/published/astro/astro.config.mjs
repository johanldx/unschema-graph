import schemaGraph from '@unschema-graph/astro/integration';
import { defineConfig } from 'astro/config';

export default defineConfig({
  integrations: [schemaGraph()],
});
