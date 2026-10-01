import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createPageGraph } from './schema.js';

async function build() {
  const distDir = resolve('dist');
  await mkdir(distDir, { recursive: true });

  const { jsonLd } = createPageGraph('https://example.com');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Building Type-Safe JSON-LD with @unschema-graph/core</title>
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <header>
    <nav>
      <a href="https://example.com">Home</a> &gt;
      <a href="https://example.com/blog">Blog</a> &gt;
      <span>Structured Data with Core</span>
    </nav>
  </header>
  <main>
    <article>
      <h1>Building Type-Safe JSON-LD with @unschema-graph/core</h1>
      <p class="lead-summary">
        A complete framework-neutral guide to generating Schema.org graphs in pure TypeScript.
      </p>
      <p>Published on October 1, 2026 by Ada Lovelace.</p>
    </article>
  </main>
</body>
</html>
`;

  await writeFile(resolve(distDir, 'index.html'), html, 'utf8');
  console.log('✓ Successfully generated dist/index.html with embedded JSON-LD');
}

build().catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});
