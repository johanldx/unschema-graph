import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error('dist directory not found. Run astro build first.');
  process.exit(1);
}

function getHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getHtmlFiles(full));
    } else if (entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const htmlFiles = getHtmlFiles(distDir);
const brokenLinks = [];
const hrefRegex = /href="([^"#:]+)(#[^"]*)?"/g;

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  for (const match of content.matchAll(hrefRegex)) {
    const target = match[1];
    if (
      target.startsWith('http://') ||
      target.startsWith('https://') ||
      target.startsWith('mailto:') ||
      target.startsWith('javascript:')
    ) {
      continue;
    }

    let resolved;
    if (target.startsWith('/')) {
      resolved = path.join(distDir, target.replace(/^\//, ''));
    } else {
      resolved = path.resolve(path.dirname(file), target);
    }

    const possiblePaths = [
      resolved,
      path.join(resolved, 'index.html'),
      `${resolved}.html`,
      `${resolved}.md`,
      `${resolved}.txt`,
    ];

    const exists = possiblePaths.some((p) => fs.existsSync(p));
    if (!exists) {
      brokenLinks.push({ file: path.relative(distDir, file), href: target });
    }
  }
}

if (brokenLinks.length > 0) {
  console.error(`Found ${brokenLinks.length} broken links:`);
  console.error(brokenLinks.slice(0, 20));
  process.exit(1);
}

console.log(`Validated internal links across ${htmlFiles.length} HTML files.`);
