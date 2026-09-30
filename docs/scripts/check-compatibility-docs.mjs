import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const packageFiles = [
  '../packages/core/package.json',
  '../packages/astro/package.json',
  '../packages/svelte/package.json',
];
const documentationFiles = [
  'src/content/docs/reference/compatibility.md',
  'src/content/docs/fr/reference/compatibility.md',
];

const manifests = await Promise.all(
  packageFiles.map(async (path) => JSON.parse(await readFile(resolve(path), 'utf8')))
);
const requiredRanges = new Set(
  manifests.flatMap((manifest) => [
    ...Object.values(manifest.engines ?? {}),
    ...Object.values(manifest.peerDependencies ?? {}),
  ])
);

for (const path of documentationFiles) {
  const documentation = await readFile(resolve(path), 'utf8');
  const missingRanges = [...requiredRanges].filter((range) => !documentation.includes(range));

  if (missingRanges.length > 0) {
    throw new Error(`${path} is missing manifest ranges: ${missingRanges.join(', ')}`);
  }
}

console.log(`Compatibility documentation matches ${manifests.length} package manifests.`);
