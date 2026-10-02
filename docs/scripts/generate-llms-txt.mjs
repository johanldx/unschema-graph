import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { builders } from '../src/data/builders.mjs';

const publicDir = resolve('public');
const documentationOrigin = 'https://unschema-graph.jhdx.dev';
const markdown = (path) => `${documentationOrigin}/${path}.md`;

const content = `# unschema-graph

> Type-safe Schema.org JSON-LD builders and graph tooling for Core TypeScript, Astro, and Svelte 5.

- Documentation: ${documentationOrigin}/
- GitHub: https://github.com/johanldx/unschema-graph
- License: MIT
- Status: 0.9.0 (v1 stabilization candidate)

## Choose the package

- **@unschema-graph/core**: framework-independent builders, graph resolution, safe serialization, duration utilities, and the audit CLI/API.
- **@unschema-graph/astro**: Core exports plus the Astro integration, server-rendered \`<Schema />\`, Dev Toolbar app, and Content Collections helpers.
- **@unschema-graph/svelte**: Core exports plus the Svelte 5 server-rendered \`<Schema />\` component.

Astro is the recommended starting path for an Astro documentation site. Core and Svelte are first-class entry points for their respective environments.

## Agent workflow

1. Read the implementation guide and the focused quick start for the project environment.
2. Model only facts visible on the page with official builders.
3. Give reusable entities stable \`@id\` values and render one unified graph.
4. Configure an intentional canonical base URL.
5. Build the project, inspect the emitted LD+JSON, and run \`npx @unschema-graph/core audit <output-directory>\`.
6. Do not claim that valid markup guarantees ranking, eligibility, or rich results.

## Start here

- [AI implementation guide](${markdown('ai/implementation-guide')})
- [Using Markdown with an agent](${markdown('ai/using-markdown')})
- [Choose an environment](${markdown('getting-started/choose-your-environment')})
- [Architecture pipeline](${markdown('architecture/pipeline')})
- [Troubleshooting](${markdown('operations/troubleshooting')})
- [Compatibility and stability](${markdown('reference/compatibility')})
- [Known limitations](${markdown('operations/known-limitations')})
- [Complete English documentation bundle](${documentationOrigin}/llms-full.txt)

Focused French Markdown routes are available under \`${documentationOrigin}/fr/<route>.md\`. The concise index and complete bundle remain English canonical machine entry points. These files are optional context for agents, not a Google Search requirement or ranking signal.

## Quick starts

- [Astro](${markdown('getting-started/quick-start/astro')})
- [Svelte 5](${markdown('getting-started/quick-start/svelte')})
- [Core / other frameworks](${markdown('getting-started/quick-start/core')})

## ${builders.length} supported Schema.org builders

${builders.map((builder) => `- [${builder.name}](${markdown(`reference/builders/${builder.slug}`)})`).join('\n')}
`;

await mkdir(publicDir, { recursive: true });
await writeFile(resolve(publicDir, 'llms.txt'), `${content.trim()}\n`, 'utf8');
console.log('Successfully generated public/llms.txt');
