import * as core from '@unschema-graph/core';
import { builders } from '../src/data/builders.mjs';
import { recipes } from '../src/data/recipes.mjs';

const byName = new Map(builders.map((builder) => [builder.name, builder]));
for (const recipe of recipes) {
  for (const name of recipe.builders) {
    // biome-ignore lint/performance/noDynamicNamespaceImportAccess: recipe data names the public export to verify.
    if (typeof core[name] !== 'function')
      throw new Error(`${recipe.slug}: missing public builder ${name}`);
  }
  const builder = byName.get(recipe.primary);
  // biome-ignore lint/performance/noDynamicNamespaceImportAccess: recipe data selects the builder under test.
  const entity = core[recipe.primary](builder.input);
  const graph = core.buildJsonLdGraph([entity], { baseUrl: 'https://example.com' });
  const serialized = core.serializeJsonLd(graph);
  if (!serialized.includes(`"@type":"${entity['@type']}"`))
    throw new Error(`${recipe.slug}: invalid serialized example`);
}
console.log(`Validated ${recipes.length} recipe examples against public Core exports.`);
