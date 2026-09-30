import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const docsDirectory = resolve('src/content/docs');

export interface DocumentationPage {
  body: string;
  description?: string;
  locale: 'en' | 'fr';
  slug: string;
  title: string;
}

interface SourceFile {
  path: string;
  sourcePath: string;
}

const preferredOrder = [
  'index',
  'getting-started/overview',
  'getting-started/choose-your-environment',
  'getting-started/installation',
  'getting-started/quick-start/astro',
  'getting-started/quick-start/svelte',
  'getting-started/quick-start/core',
  'guides/mental-model',
  'guides/entities-types-and-properties',
  'guides/identities',
  'guides/graphs-and-references',
  'guides/validation',
  'guides/dates-and-durations',
  'architecture/pipeline',
  'audit-and-quality/security',
  'guides/content-collections',
  'recipes/blog-media',
  'recipes/company-site',
  'recipes/ecommerce',
  'recipes/local-business',
  'recipes/events',
  'recipes/cms-content-collections',
  'recipes/sveltekit-ssr',
  'recipes/audit-ci',
  'recipes/core-frameworks',
  'integrations/astro',
  'integrations/svelte',
  'integrations/core',
  'guides/voice-and-ai-speakable',
  'guides/custom-schemas',
  'reference/component',
  'reference/builders',
  'reference/helpers',
  'reference/configuration',
  'reference/compatibility',
  'audit-and-quality/audit-api',
  'audit-and-quality/audit-cli',
  'operations/troubleshooting',
  'operations/migrations',
  'operations/known-limitations',
  'ai/implementation-guide',
  'ai/using-markdown',
];

async function findSourceFiles(directory: string, prefix = ''): Promise<SourceFile[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: SourceFile[] = [];

  for (const entry of entries) {
    const path = `${prefix}${entry.name}`;
    const sourcePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findSourceFiles(sourcePath, `${path}/`)));
    } else if (/\.mdx?$/.test(entry.name)) {
      files.push({ path, sourcePath });
    }
  }

  return files;
}

function readFrontmatterValue(frontmatter: string, key: string): string | undefined {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, 'm'));
  return match?.[1];
}

function convertDirectivesToBlockquotes(markdown: string): string {
  let directive: { kind: string; title?: string } | undefined;

  return markdown
    .split('\n')
    .map((line) => {
      const opening = line.match(/^\s*:{3,4}(note|tip|caution|danger)(?:\[([^\]]+)\])?\s*$/);
      if (opening) {
        directive = { kind: opening[1].toUpperCase(), title: opening[2] };
        return `> **${directive.kind}${directive.title ? ` — ${directive.title}` : ''}**`;
      }
      if (directive && /^\s*:{3,4}\s*$/.test(line)) {
        directive = undefined;
        return '';
      }
      if (directive) return line ? `> ${line}` : '>';
      return line;
    })
    .join('\n');
}

function stripMdxContainers(markdown: string): string {
  let depth = 0;

  return markdown
    .split('\n')
    .map((line) => {
      if (/^\s*<\/(?:Tabs|TabItem|CardGrid|Steps|Card)>\s*$/.test(line)) {
        depth = Math.max(0, depth - 1);
        return '';
      }

      const tabItem = line.match(/^\s*<TabItem\s+label="([^"]+)"[^>]*>\s*$/);
      if (tabItem) {
        depth += 1;
        return `### ${tabItem[1]}`;
      }

      const card = line.match(/^\s*<Card\s+title="([^"]+)"[^>]*>\s*$/);
      if (card) {
        depth += 1;
        return `## ${card[1]}`;
      }

      if (/^\s*<(?:Tabs|CardGrid|Steps)(?:\s[^>]*)?>\s*$/.test(line)) {
        depth += 1;
        return '';
      }

      const indentation = line.match(/^\s*/)?.[0].length ?? 0;
      return line.slice(Math.min(indentation, depth * 2));
    })
    .join('\n');
}

function parseDocumentationPage(
  source: string,
  slug: string,
  locale: 'en' | 'fr'
): DocumentationPage {
  const frontmatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const frontmatter = frontmatterMatch?.[1] ?? '';
  const content = source
    .slice(frontmatterMatch?.[0].length ?? 0)
    .replace(/^import\s.+?;\s*$/gm, '');
  const body = convertDirectivesToBlockquotes(stripMdxContainers(content))
    .replace(/\]\(((?!https?:|mailto:|#)[^)]+?)\/\)/g, ']($1.md)')
    .trim();

  return {
    body,
    description: readFrontmatterValue(frontmatter, 'description'),
    locale,
    slug,
    title: readFrontmatterValue(frontmatter, 'title') ?? slug,
  };
}

function comparePages(left: DocumentationPage, right: DocumentationPage): number {
  const leftIndex = preferredOrder.indexOf(left.slug);
  const rightIndex = preferredOrder.indexOf(right.slug);
  const leftOrder = leftIndex === -1 ? preferredOrder.length : leftIndex;
  const rightOrder = rightIndex === -1 ? preferredOrder.length : rightIndex;

  return leftOrder - rightOrder || left.slug.localeCompare(right.slug);
}

export async function getDocumentationPages(includeFrench = false): Promise<DocumentationPage[]> {
  const sourceFiles = await findSourceFiles(docsDirectory);
  const selectedFiles = sourceFiles.filter(({ path }) => includeFrench || !path.startsWith('fr/'));

  const pages = await Promise.all(
    selectedFiles
      .map(({ path, sourcePath }) => ({
        path,
        sourcePath,
      }))
      .filter(({ path }) => path !== '404.md')
      .map(async ({ path, sourcePath }) => {
        const source = await readFile(sourcePath, 'utf8');
        const sourceSlug = path.replace(/\.mdx?$/, '');
        const locale = sourceSlug.startsWith('fr/') ? 'fr' : 'en';
        const normalizedSlug = sourceSlug.endsWith('/index')
          ? sourceSlug.slice(0, -'/index'.length)
          : sourceSlug;
        const slug = sourceSlug === 'fr/index' ? 'fr/index' : normalizedSlug;
        return parseDocumentationPage(source, slug, locale);
      })
  );

  return pages.sort(comparePages);
}

export function getDocumentationBaseUrl(site: URL | undefined): URL {
  const deploymentSite = site ?? new URL('https://unschema-graph.jhdx.dev');
  const basePath = import.meta.env.BASE_URL.replace(/^\/+|\/+$/g, '');
  return new URL(basePath ? `${basePath}/` : '/', deploymentSite);
}

function withAbsoluteLinks(page: DocumentationPage, baseUrl: URL): string {
  const pageUrl = new URL(`${page.slug}.md`, baseUrl);
  return page.body.replace(
    /\]\(((?!https?:|mailto:|#)([^)]+))\)/g,
    (_match, href: string) => `](${new URL(href, pageUrl).href})`
  );
}

export async function createLlmsIndex(site: URL | undefined): Promise<string> {
  const baseUrl = getDocumentationBaseUrl(site);
  const link = (path: string) => new URL(path, baseUrl).href;
  const pages = await getDocumentationPages();
  const pageLinks = pages
    .map(
      (page) =>
        `- [${page.title}](${link(`${page.slug}.md`)})${page.description ? `: ${page.description}` : ''}`
    )
    .join('\n');

  return `# unschema-graph

> Strict, type-safe Schema.org JSON-LD builders and graph tooling for Core TypeScript, Astro, and Svelte 5.

The concise index and complete bundle are English canonical machine entry points. Focused French Markdown routes are also generated. Start with the implementation guide, then load only the pages required for the task.

## Start here

- [AI implementation guide](${link('ai/implementation-guide.md')}): Rules, workflow, constraints, and completion checklist for coding agents.
- [Complete documentation bundle](${link('llms-full.txt')}): All English documentation in one Markdown document when selective loading is not available.

## Markdown documentation

${pageLinks}

## Source and package

- [GitHub repository](https://github.com/johanldx/unschema-graph)
- [npm package](https://www.npmjs.com/package/@unschema-graph/astro)
`;
}

export async function createFullDocumentation(site: URL | undefined): Promise<string> {
  const pages = await getDocumentationPages();
  const baseUrl = getDocumentationBaseUrl(site);
  const sections = pages.map((page) => {
    const markdownUrl = new URL(`${page.slug}.md`, baseUrl).href;
    const description = page.description ? `\n${page.description}\n` : '';

    return `# ${page.title}\n\nMarkdown source: ${markdownUrl}\n${description}\n${withAbsoluteLinks(page, baseUrl)}`;
  });

  return `# unschema-graph — Complete English documentation

> This static Markdown bundle is generated from the same sources as the Starlight site. It is intended for coding agents implementing unschema-graph.

Use the AI implementation guide first. Treat builder inputs and exported APIs documented here as authoritative. Do not invent properties or bypass validation when an official builder or helper exists.

${sections.join('\n\n---\n\n')}
`;
}

export function createMarkdownPage(page: DocumentationPage, site?: URL): string {
  const description = page.description ? `${page.description}\n\n` : '';
  const baseUrl = getDocumentationBaseUrl(site);
  const canonical = new URL(`${page.slug}.md`, baseUrl).href;
  return `# ${page.title}\n\nCanonical Markdown: ${canonical}\n\n${description}${withAbsoluteLinks(page, baseUrl)}\n`;
}
