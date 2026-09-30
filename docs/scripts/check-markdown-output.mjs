import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

async function findMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await findMarkdownFiles(path)));
    else if (entry.name.endsWith('.md')) files.push(path);
  }

  return files;
}

const files = await findMarkdownFiles(resolve('dist'));
if (files.length === 0) throw new Error('No generated Markdown pages found in dist/.');

for (const path of files) {
  const markdown = await readFile(path, 'utf8');
  const relativeLink = markdown.match(/\]\((?:\/|\.\.?\/)[^)]+\)/);
  const mdxMarker = markdown.match(/^\s*(?:<\/?(?:Tabs|TabItem|Card|CardGrid|Steps)\b|:::)/m);

  if (!markdown.startsWith('# ')) throw new Error(`${path} does not preserve its title.`);
  if (!markdown.includes('Canonical Markdown: https://')) {
    throw new Error(`${path} does not contain an absolute canonical Markdown URL.`);
  }
  if (relativeLink) throw new Error(`${path} contains a relative link: ${relativeLink[0]}`);
  if (mdxMarker) throw new Error(`${path} still contains MDX markup: ${mdxMarker[0]}`);
}

console.log(`Validated ${files.length} generated Markdown pages.`);
