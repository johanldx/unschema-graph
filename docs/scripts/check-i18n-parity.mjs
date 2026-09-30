import { readdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const docsDirectory = resolve(projectDirectory, 'src/content/docs');

async function collectFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(resolve(directory, entry.name), path)));
    } else if (/\.mdx?$/.test(entry.name)) {
      files.push(path);
    }
  }

  return files;
}

function withoutCodeBlocks(source) {
  return source.replace(/```[\s\S]*?```/g, '');
}

function frontmatterValue(source, key) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  return frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim();
}

function headingLevels(source) {
  return [...withoutCodeBlocks(source).matchAll(/^(#{2,3})\s+.+$/gm)].map(
    (match) => match[1].length
  );
}

function fenceLanguages(source) {
  return [...source.matchAll(/^```([^\s]*)/gm)].map((match) => match[1] || 'plain');
}

function routeForSource(path) {
  const withoutLocale = path.replace(/^fr\//, '').replace(/\.mdx?$/, '');
  const slug = withoutLocale.endsWith('/index')
    ? withoutLocale.slice(0, -'/index'.length)
    : withoutLocale;
  return slug === 'index' ? '/' : `/${slug}/`;
}

function localLinks(source) {
  return [...withoutCodeBlocks(source).matchAll(/\]\((\/[^)#?]*)(?:[?#][^)]*)?\)/g)].map((match) =>
    match[1]
      .replace(/^\/fr(?=\/)/, '')
      .replace(/\.md$/, '/')
      .replace(/\/+$/, '/')
  );
}

const files = await collectFiles(docsDirectory);
const englishFiles = files.filter((path) => !path.startsWith('fr/'));
const fileSet = new Set(files);
const routeSet = new Set(englishFiles.map(routeForSource));
const errors = [];

for (const englishPath of englishFiles) {
  const frenchPath = `fr/${englishPath}`;
  if (!fileSet.has(frenchPath)) {
    errors.push(`${englishPath}: missing French counterpart ${frenchPath}`);
    continue;
  }

  const [english, french] = await Promise.all([
    readFile(resolve(docsDirectory, englishPath), 'utf8'),
    readFile(resolve(docsDirectory, frenchPath), 'utf8'),
  ]);

  if (!frontmatterValue(english, 'title') || !frontmatterValue(french, 'title')) {
    errors.push(`${englishPath}: both locales must define a frontmatter title`);
  }

  const englishHeadings = headingLevels(english);
  const frenchHeadings = headingLevels(french);
  if (englishHeadings.join(',') !== frenchHeadings.join(',')) {
    errors.push(
      `${englishPath}: heading structure differs (${englishHeadings} vs ${frenchHeadings})`
    );
  }

  const englishFences = fenceLanguages(english);
  const frenchFences = fenceLanguages(french);
  if (englishFences.join(',') !== frenchFences.join(',')) {
    errors.push(`${englishPath}: code examples differ (${englishFences} vs ${frenchFences})`);
  }

  for (const [locale, source] of [
    ['en', english],
    ['fr', french],
  ]) {
    for (const link of localLinks(source)) {
      if (!routeSet.has(link) && link !== '/llms.txt' && link !== '/llms-full.txt') {
        errors.push(`${englishPath}: broken ${locale} documentation link ${link}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`Documentation parity check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Documentation parity check passed for ${englishFiles.length} route(s).`);
}
