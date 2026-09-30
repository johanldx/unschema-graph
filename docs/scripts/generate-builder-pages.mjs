import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import * as schemaGraph from '@unschema-graph/core';
import { z } from 'zod';
import { builderGroups, builders } from '../src/data/builders.mjs';
import { recipes } from '../src/data/recipes.mjs';

const englishDirectory = resolve('src/content/docs/reference/builders');
const frenchDirectory = resolve('src/content/docs/fr/reference/builders');

function serializeInput(name, input) {
  return `import { ${name} } from '@unschema-graph/core';\n\nconst entity = ${name}(${JSON.stringify(input, null, 2)});`;
}

const dateProperties = new Set([
  'dateCreated',
  'dateModified',
  'datePosted',
  'datePublished',
  'foundingDate',
  'priceValidUntil',
  'startDate',
  'endDate',
  'uploadDate',
  'validThrough',
]);

const durationProperties = new Set(['cookTime', 'duration', 'prepTime', 'totalTime']);

const objectTypeNames = {
  address: 'PostalAddress | EntityReference',
  aggregateRating: 'AggregateRating',
  author: 'Person | Organization | EntityReference',
  brand: 'Brand | Organization | EntityReference',
  contactPoint: 'ContactPoint',
  distribution: 'DataDownload',
  geo: 'GeoCoordinates',
  hiringOrganization: 'Organization | EntityReference',
  image: 'ImageObject',
  itemReviewed: 'SchemaOrgEntity | EntityReference',
  jobLocation: 'Place | PostalAddress | EntityReference',
  logo: 'ImageObject',
  offers: 'Offer | AggregateOffer',
  organizer: 'Person | Organization | EntityReference',
  performer: 'Person | Organization | EntityReference',
  provider: 'Person | Organization | LocalBusiness | EntityReference',
  publisher: 'Organization | EntityReference',
  review: 'Review',
  reviewRating: 'Rating',
  screenshot: 'ImageObject',
  seller: 'Person | Organization | EntityReference',
  thumbnailUrl: 'ImageObject',
  trailer: 'VideoObject',
};

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function describeType(schema, propertyName) {
  if (dateProperties.has(propertyName)) return 'string | number | Date';
  if (durationProperties.has(propertyName)) return 'string | number | DurationObject';

  const variants = schema.anyOf ?? schema.oneOf;
  if (variants) {
    const types = unique(variants.map((variant) => describeType(variant, propertyName)));
    const usefulTypes = types.length > 1 ? types.filter((type) => type !== 'unknown') : types;
    return usefulTypes.join(' | ') || 'unknown';
  }

  if (schema.const !== undefined) return JSON.stringify(schema.const);
  if (schema.enum) return schema.enum.map((value) => JSON.stringify(value)).join(' | ');

  if (Array.isArray(schema.type)) return schema.type.join(' | ');
  if (schema.type === 'array') return `Array<${describeType(schema.items ?? {}, propertyName)}>`;
  if (schema.type === 'object') return objectTypeNames[propertyName] ?? 'object';
  if (schema.type === 'integer' || schema.type === 'number') return 'number';
  if (schema.type) return schema.type;
  return 'unknown';
}

function collectConstraints(schema) {
  const constraints = [];
  const variants = schema.anyOf ?? schema.oneOf ?? [];

  if (schema.default !== undefined) constraints.push(`default: ${JSON.stringify(schema.default)}`);
  if (schema.const !== undefined) constraints.push(`literal: ${JSON.stringify(schema.const)}`);
  if (schema.format) constraints.push(`format: ${schema.format}`);
  if (schema.type === 'integer') constraints.push('integer');
  if (schema.minLength === 1) constraints.push('non-empty');
  else if (schema.minLength !== undefined) constraints.push(`minimum length: ${schema.minLength}`);
  if (schema.maxLength !== undefined) constraints.push(`maximum length: ${schema.maxLength}`);
  if (schema.minItems !== undefined) constraints.push(`minimum items: ${schema.minItems}`);
  if (schema.maxItems !== undefined) constraints.push(`maximum items: ${schema.maxItems}`);
  if (schema.minimum !== undefined) constraints.push(`minimum: ${schema.minimum}`);
  if (schema.exclusiveMinimum !== undefined)
    constraints.push(`greater than ${schema.exclusiveMinimum}`);
  if (schema.maximum !== undefined) constraints.push(`maximum: ${schema.maximum}`);
  if (schema.exclusiveMaximum !== undefined)
    constraints.push(`less than ${schema.exclusiveMaximum}`);
  if (schema.enum) constraints.push(`values: ${schema.enum.map(String).join(', ')}`);

  for (const variant of variants) constraints.push(...collectConstraints(variant));
  return unique(constraints);
}

function escapeTableValue(value) {
  return value.replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function linkNestedTypes(value, locale) {
  let linked = escapeTableValue(value);
  for (const nested of builders) {
    const route = `${locale === 'fr' ? '/fr' : ''}/reference/builders/${nested.slug}/`;
    linked = linked.replaceAll(nested.name, `[${nested.name}](${route})`);
  }
  return linked;
}

function buildPropertyTable(builder, schema, locale) {
  const jsonSchema = z.toJSONSchema(schema, { io: 'input', unrepresentable: 'any' });
  const requiredProperties = new Set(jsonSchema.required ?? []);
  const conditionalInput = builder.required.join(' ');
  const properties = { '@id': { type: 'string', minLength: 1 }, ...jsonSchema.properties };
  delete properties['@type'];

  const rows = Object.entries(properties).map(([name, propertySchema]) => {
    const requirement = requiredProperties.has(name)
      ? locale === 'fr'
        ? 'Oui'
        : 'Yes'
      : conditionalInput.includes(name)
        ? locale === 'fr'
          ? 'Conditionnel'
          : 'Conditional'
        : locale === 'fr'
          ? 'Non'
          : 'No';
    const constraints = collectConstraints(propertySchema).join('; ');
    const type = linkNestedTypes(describeType(propertySchema, name), locale);

    return `| \`${name}\` | ${type} | ${requirement} | ${constraints || '—'} |`;
  });

  const header =
    locale === 'fr'
      ? '| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |\n| --- | --- | :---: | --- |'
      : '| Property | Input type | Required | Default / constraints |\n| --- | --- | :---: | --- |';

  return `${header}\n${rows.join('\n')}`;
}

function buildPage(builder, output, propertyTable, locale) {
  const french = locale === 'fr';
  const title = `${builder.name} builder`;
  const description = french
    ? `Référence du builder ${builder.name} pour créer une entité Schema.org ${builder.schemaType} validée.`
    : `Reference for the ${builder.name} builder and its validated Schema.org ${builder.schemaType} output.`;
  const example = serializeInput(builder.name, builder.input);
  const documentation = builder.documentation;
  const relatedBuilders = documentation.related
    .map((name) => {
      const related = builders.find((candidate) => candidate.name === name);
      return `[\`${name}\`](${french ? '/fr' : ''}/reference/builders/${related.slug}/)`;
    })
    .join(', ');
  const usedBy = recipes
    .filter((recipe) => recipe.builders.includes(builder.name))
    .map(
      (recipe) =>
        `[${french ? recipe.titleFr : recipe.title}](${french ? '/fr' : ''}/recipes/${recipe.slug}/)`
    )
    .join(', ');
  const sourceLinks = [
    `[Schema.org ${builder.schemaType}](${documentation.schemaOrg})`,
    documentation.google ? `[Google Search Central](${documentation.google})` : null,
  ]
    .filter(Boolean)
    .join(' · ');
  const errorList = documentation.commonErrors[french ? 'fr' : 'en']
    .map((error) => `- ${error}`)
    .join('\n');

  if (french) {
    return `---
title: ${title}
description: ${description}
---

Le builder \`${builder.name}\` crée une entité \`${builder.schemaType}\`, injecte son \`@type\`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

\`\`\`ts
// Astro — shown first when Astro is selected
${documentation.imports.astro}

// Svelte 5
${documentation.imports.svelte}

// Core / Node.js
${documentation.imports.core}
import { ${builder.schema} } from '@unschema-graph/core';
\`\`\`

Le schéma Zod \`${builder.schema}\` est également exporté pour la composition et la validation avancées.

## Types TypeScript

\`\`\`ts
import {
  ${builder.schema},
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ${builder.name}Input = SchemaInput<typeof ${builder.schema}>;
type ${builder.name}Output = SchemaOutput<typeof ${builder.schema}, '${builder.schemaType}'>;
\`\`\`

## Propriétés d’entrée

${propertyTable}

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
\`@type\` vaut toujours \`${builder.schemaType}\`.

## Exemple minimal

\`\`\`ts
${example}
\`\`\`

## Sortie

\`\`\`json
${JSON.stringify(output, null, 2)}
\`\`\`

## Relations et recettes

- Builders liés : ${relatedBuilders || '—'}
- Utilisé par : ${usedBy || 'aucune recette dédiée'}
- Sources externes : ${sourceLinks}

## Erreurs fréquentes

${errorList}

## Validation

Utilisez \`${builder.name}.safeParse(input)\` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
\`withAdditionalProperties()\`. N’ajoutez jamais une propriété inventée au builder.
`;
  }

  return `---
title: ${title}
description: ${description}
---

${builder.summary} The \`${builder.name}\` builder injects \`@type\`, validates synchronously, and
rejects unknown properties.

## Import

\`\`\`ts
// Astro — shown first when Astro is selected
${documentation.imports.astro}

// Svelte 5
${documentation.imports.svelte}

// Core / Node.js
${documentation.imports.core}
import { ${builder.schema} } from '@unschema-graph/core';
\`\`\`

The \`${builder.schema}\` Zod schema is also exported for composition and advanced validation.

## TypeScript types

\`\`\`ts
import {
  ${builder.schema},
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ${builder.name}Input = SchemaInput<typeof ${builder.schema}>;
type ${builder.name}Output = SchemaOutput<typeof ${builder.schema}, '${builder.schemaType}'>;
\`\`\`

## Input properties

${propertyTable}

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns \`@type: '${builder.schemaType}'\`.

## Minimal example

\`\`\`ts
${example}
\`\`\`

## Output

\`\`\`json
${JSON.stringify(output, null, 2)}
\`\`\`

## Relationships and recipes

- Related builders: ${relatedBuilders || '—'}
- Used by: ${usedBy || 'no dedicated recipe'}
- External sources: ${sourceLinks}

## Common errors

${errorList}

## Validation

Use \`${builder.name}.safeParse(input)\` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use \`withAdditionalProperties()\`. Never
pass invented properties to the strict builder.
`;
}

function buildIndex(locale) {
  const french = locale === 'fr';
  const groups = builderGroups
    .map((group) => {
      const links = group.builders
        .map((builder) => `- [\`${builder.name}\`](./${builder.slug}/)`)
        .join('\n');
      return `## ${french ? group.labelFr : group.label}\n\n${links}`;
    })
    .join('\n\n');

  return `---
title: Schema builders
description: ${french ? 'Catalogue complet des 51 builders Schema.org stricts.' : 'Complete catalog of the 51 strict Schema.org entity builders.'}
---

${
  french
    ? 'Chaque builder possède une page dédiée avec ses champs obligatoires, ses entrées principales, un exemple validé et le JSON-LD produit.'
    : 'Each builder has a dedicated page with required fields, key inputs, a validated example, and the generated JSON-LD output.'
}

${groups}
`;
}

await mkdir(englishDirectory, { recursive: true });
await mkdir(frenchDirectory, { recursive: true });

for (const builder of builders) {
  // biome-ignore lint/performance/noDynamicNamespaceImportAccess: Builder metadata intentionally drives export lookup.
  const build = schemaGraph[builder.name];
  // biome-ignore lint/performance/noDynamicNamespaceImportAccess: Builder metadata intentionally drives export lookup.
  const schema = schemaGraph[builder.schema];
  if (typeof build !== 'function') throw new Error(`Missing exported builder: ${builder.name}`);
  if (!schema) throw new Error(`Missing exported schema: ${builder.schema}`);

  const output = build(builder.input);
  if (!output) throw new Error(`Invalid documentation example for ${builder.name}`);

  await Promise.all([
    writeFile(
      resolve(englishDirectory, `${builder.slug}.md`),
      buildPage(builder, output, buildPropertyTable(builder, schema, 'en'), 'en')
    ),
    writeFile(
      resolve(frenchDirectory, `${builder.slug}.md`),
      buildPage(builder, output, buildPropertyTable(builder, schema, 'fr'), 'fr')
    ),
  ]);
}

await Promise.all([
  writeFile(resolve(englishDirectory, 'index.md'), buildIndex('en')),
  writeFile(resolve(frenchDirectory, 'index.md'), buildIndex('fr')),
]);

console.log(`Generated ${builders.length * 2 + 2} builder reference pages.`);
