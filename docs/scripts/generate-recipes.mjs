import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { builders } from '../src/data/builders.mjs';
import { recipes } from '../src/data/recipes.mjs';

const byName = new Map(builders.map((builder) => [builder.name, builder]));
const root = resolve('src/content/docs');
const link = (locale, path) => `${locale === 'fr' ? '/fr' : ''}${path}`;

function page(recipe, locale) {
  const fr = locale === 'fr';
  const builder = byName.get(recipe.primary);
  if (!builder) throw new Error(`Unknown recipe builder: ${recipe.primary}`);
  const title = fr ? recipe.titleFr : recipe.title;
  const goal = fr ? recipe.goalFr : recipe.goal;
  const production = fr ? recipe.productionFr : recipe.production;
  const errors = fr ? recipe.errorsFr : recipe.errors;
  const sample = JSON.stringify(builder.input, null, 2);
  const related = recipe.builders
    .map(
      (name) =>
        `[\`${name}\`](${link(locale, `/reference/builders/${byName.get(name)?.slug ?? name.toLowerCase()}/`)})`
    )
    .join(', ');
  const external = recipe.schema.startsWith('/')
    ? `[${fr ? 'Documentation liée' : 'Related documentation'}](${link(locale, recipe.schema)})`
    : `[${recipe.schema.includes('google') ? 'Google Search Central' : 'Schema.org / official documentation'}](${recipe.schema})`;
  return `---\ntitle: ${title}\ndescription: ${goal}\n---\n\n## ${fr ? 'Objectif' : 'Outcome'}\n\n${goal}\n\n> **${fr ? 'Validation locale' : 'Local validation'}** — ${fr ? 'Les builders rejettent les propriétés inconnues et exposent `safeParse()` pour les données externes.' : 'Builders reject unknown properties and expose `safeParse()` for external data.'}\n>\n> **Schema.org** — ${fr ? 'Le vocabulaire décrit le sens des propriétés ; il ne garantit aucun affichage dans un moteur.' : 'The vocabulary defines property meaning; it does not guarantee any search appearance.'}\n>\n> **${fr ? 'Éligibilité Google' : 'Google eligibility'}** — ${fr ? 'Les exigences Google sont supplémentaires et peuvent évoluer. Un balisage valide ne garantit jamais un résultat enrichi.' : 'Google requirements are additional and can change. Valid markup never guarantees a rich result.'}\n\n## ${fr ? 'Prérequis' : 'Prerequisites'}\n\n- ${fr ? 'Une URL canonique et un `baseUrl` fiables.' : 'A trustworthy canonical URL and `baseUrl`.'}\n- ${fr ? 'Des données visibles, actuelles et issues de votre source métier.' : 'Current, visible data from your domain source.'}\n- ${fr ? 'Les builders liés' : 'Related builders'}: ${related}.\n\n## ${fr ? 'Graphe recommandé' : 'Recommended graph'}\n\n${recipe.builders.map((name, index) => `${index + 1}. \`${name}\`${index === 0 ? ` — ${fr ? 'nœud principal' : 'primary node'}` : ''}`).join('\n')}\n\n## ${fr ? 'Exemple minimal' : 'Minimal example'}\n\n\`\`\`ts\nimport { ${recipe.primary} } from '@unschema-graph/core';\n\nconst entity = ${recipe.primary}(${sample});\n\`\`\`\n\n## ${fr ? 'Exemple de production' : 'Production pattern'}\n\n${production}\n\n\`\`\`ts\nconst result = ${recipe.primary}.safeParse(cmsData);\nif (!result.success) {\n  throw new Error(result.error.issues.map((issue) => issue.message).join('\\n'));\n}\n\nconst graph = buildJsonLdGraph([result.data], { baseUrl: 'https://example.com' });\n\`\`\`\n\n## ${fr ? 'Variantes par environnement' : 'Environment variants'}\n\n| Astro | Svelte 5 / SvelteKit | Core |\n| --- | --- | --- |\n| \`<Schema items={items} />\` | \`<Schema items={items} />\` | \`serializeJsonLd(buildJsonLdGraph(items))\` |\n\n${recipe.slug === 'audit-ci' ? `## GitHub Actions\n\n\`\`\`yaml\n- run: pnpm run build\n- run: pnpm exec unschema-graph audit dist\n\`\`\`\n\n${fr ? 'La commande renvoie `0` si tout est valide et un code non nul si des erreurs sont trouvées.' : 'The command exits with `0` when valid and a non-zero code when errors are found.'}\n\n` : ''}## ${fr ? 'Erreurs fréquentes et diagnostic' : 'Common errors and diagnosis'}\n\n${errors.map((error, index) => `${index + 1}. **${error}.** ${fr ? 'Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.' : 'Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.'}`).join('\n')}\n\n## ${fr ? 'Validation' : 'Validation'}\n\n1. ${fr ? 'Exécutez `safeParse()` à la frontière des données.' : 'Run `safeParse()` at the data boundary.'}\n2. ${fr ? 'Inspectez le script du HTML construit.' : 'Inspect the script in built HTML.'}\n3. ${fr ? 'Lancez `unschema-graph audit` sur le dossier de sortie.' : 'Run `unschema-graph audit` against the output directory.'}\n4. ${external}.\n\n## ${fr ? 'Checklist finale' : 'Final checklist'}\n\n- [ ] ${fr ? 'Le contenu balisé est visible et actuel.' : 'Marked-up content is visible and current.'}\n- [ ] ${fr ? 'Chaque identité réutilisable possède un `@id` stable.' : 'Every reusable identity has a stable `@id`.'}\n- [ ] ${fr ? 'La validation locale et l’audit du build passent.' : 'Local validation and the build audit pass.'}\n- [ ] ${fr ? 'Les limites de garantie sont comprises.' : 'Eligibility is understood as non-guaranteed.'}\n\n${fr ? 'Approfondir' : 'Go deeper'}: [${fr ? 'graphes et références' : 'graphs and references'}](${link(locale, '/guides/graphs-and-references/')}), [${fr ? 'validation' : 'validation'}](${link(locale, '/guides/validation/')}), [${fr ? 'audit CLI' : 'audit CLI'}](${link(locale, '/audit-and-quality/audit-cli/')}).\n`;
}

for (const recipe of recipes) {
  for (const locale of ['en', 'fr']) {
    const directory = resolve(
      root,
      locale === 'fr' ? `fr/recipes/${recipe.slug}` : `recipes/${recipe.slug}`
    );
    await mkdir(directory, { recursive: true });
    await writeFile(resolve(directory, 'index.md'), page(recipe, locale));
  }
}
console.log(`Generated ${recipes.length * 2} recipe pages.`);
