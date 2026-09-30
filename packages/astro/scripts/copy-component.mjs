import { copyFile, mkdir } from 'node:fs/promises';

await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await copyFile(
  new URL('../src/Schema.astro', import.meta.url),
  new URL('../dist/Schema.astro', import.meta.url)
);
