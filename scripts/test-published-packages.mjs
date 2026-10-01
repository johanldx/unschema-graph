import { spawnSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fixturesRoot = join(root, 'tests', 'fixtures', 'published');
const workspace = await mkdtemp(join(tmpdir(), 'unschema-graph-published-'));
const packsDirectory = join(workspace, 'packs');

function run(command, args, cwd = root, capture = false) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, CI: 'true', NO_COLOR: '1' },
    stdio: capture ? 'pipe' : 'inherit',
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join('\n');
    throw new Error(`${command} ${args.join(' ')} failed with status ${result.status}\n${output}`);
  }

  return result.stdout;
}

function requestedAstroMajors() {
  const inline = process.argv.find((argument) => argument.startsWith('--astro-major='));
  const index = process.argv.indexOf('--astro-major');
  const requested = inline?.split('=')[1] ?? (index >= 0 ? process.argv[index + 1] : undefined);
  const majors = requested ? requested.split(',') : ['5', '6', '7'];

  if (majors.some((major) => !['5', '6', '7'].includes(major))) {
    throw new Error(`Unsupported Astro major: ${requested}`);
  }

  return majors;
}

async function writePackage(directory, overrides) {
  const templatePath = join(directory, 'package.template.json');
  const template = JSON.parse(await readFile(templatePath, 'utf8'));
  await writeFile(
    join(directory, 'package.json'),
    `${JSON.stringify({ ...template, ...overrides }, null, 2)}\n`
  );
  await rm(templatePath);
}

async function writeWorkspace(directory, overrides = {}) {
  const workspacePath = join(directory, 'pnpm-workspace.yaml');
  let content = '';
  try {
    content = await readFile(workspacePath, 'utf8');
  } catch {
    content = "packages:\n  - '.'\n";
  }
  if (Object.keys(overrides).length > 0) {
    const lines = Object.entries(overrides)
      .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`)
      .join('\n');
    content += `\noverrides:\n${lines}\n`;
  }
  await writeFile(workspacePath, content);
}

async function materializeFixture(name, overrides, suffix = '', workspaceOverrides = {}) {
  const target = join(workspace, 'consumers', `${name}${suffix}`);
  await cp(join(fixturesRoot, name), target, { recursive: true });
  await writePackage(target, overrides);
  await writeWorkspace(target, workspaceOverrides);
  return target;
}

async function findTarball(packageSlug) {
  const files = await readdir(packsDirectory);
  const filename = files.find(
    (file) => file.startsWith(`${packageSlug}-`) && file.endsWith('.tgz')
  );
  if (!filename) throw new Error(`Missing tarball for ${packageSlug}`);
  return join(packsDirectory, filename);
}

function assertTarballContents(tarball, requiredFiles) {
  const entries = run('tar', ['-tzf', tarball], root, true).trim().split('\n');
  for (const requiredFile of requiredFiles) {
    if (!entries.includes(`package/${requiredFile}`)) {
      throw new Error(`${tarball} does not contain ${requiredFile}`);
    }
  }

  const forbidden = entries.find((entry) =>
    /(^|\/)(src|tests?|node_modules|\.svelte-kit)(\/|$)/.test(entry)
  );
  if (forbidden) throw new Error(`${tarball} contains an unpublished source: ${forbidden}`);

  return entries;
}

function collectExportTargets(value) {
  if (typeof value === 'string') return [value];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap(collectExportTargets);
}

function assertPackageMetadata(tarball, entries, expected) {
  const manifest = JSON.parse(run('tar', ['-xOf', tarball, 'package/package.json'], root, true));
  const readme = run('tar', ['-xOf', tarball, 'package/README.md'], root, true);
  const publishedFiles = new Set(entries.map((entry) => entry.replace(/^package\//, '')));

  const equal = (actual, wanted, label) => {
    if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
      throw new Error(`${manifest.name} has invalid ${label}: ${JSON.stringify(actual)}`);
    }
  };

  equal(manifest.name, expected.name, 'name');
  equal(manifest.files, expected.files, 'files');
  equal(manifest.peerDependencies, expected.peerDependencies, 'peerDependencies');
  equal(manifest.engines, { node: '>=22.12.0' }, 'engines');
  equal(manifest.repository?.directory, expected.directory, 'repository.directory');
  equal(manifest.homepage, 'https://unschema-graph.jhdx.dev', 'homepage');
  equal(manifest.bugs?.url, 'https://github.com/johanldx/unschema-graph/issues', 'bugs.url');
  equal(manifest.publishConfig, { access: 'public', provenance: true }, 'publishConfig');

  const entryTargets = [
    manifest.main,
    manifest.types,
    manifest.svelte,
    ...collectExportTargets(manifest.exports),
    ...Object.values(manifest.bin ?? {}),
  ].filter(Boolean);
  for (const target of new Set(entryTargets)) {
    const normalized = target.replace(/^\.\//, '');
    if (!publishedFiles.has(normalized)) {
      throw new Error(`${manifest.name} entry point is missing from its tarball: ${target}`);
    }
  }

  const serializedDependencies = JSON.stringify({
    dependencies: manifest.dependencies,
    peerDependencies: manifest.peerDependencies,
  });
  if (serializedDependencies.includes('workspace:')) {
    throw new Error(`${manifest.name} still contains a workspace protocol in its tarball`);
  }

  for (const section of ['# Installation', '# Usage', '# Compatibility']) {
    if (!readme.includes(section)) {
      throw new Error(`${manifest.name} README is missing ${section}`);
    }
  }
}

async function installAndBuild(directory) {
  run('pnpm', ['install', '--no-frozen-lockfile'], directory);
  run('pnpm', ['run', 'build'], directory);
}

try {
  const [nodeMajor, nodeMinor] = process.versions.node.split('.').map(Number);
  if (nodeMajor < 22 || (nodeMajor === 22 && nodeMinor < 12)) {
    throw new Error(`Node >=22.12.0 is required, received ${process.versions.node}`);
  }

  await mkdir(packsDirectory, { recursive: true });

  for (const packageName of ['core', 'astro', 'svelte']) {
    run('pnpm', [
      '--dir',
      join(root, 'packages', packageName),
      'pack',
      '--pack-destination',
      packsDirectory,
    ]);
  }

  const coreTarball = await findTarball('unschema-graph-core');
  const astroTarball = await findTarball('unschema-graph-astro');
  const svelteTarball = await findTarball('unschema-graph-svelte');
  const coreDependency = pathToFileURL(coreTarball).href;

  const coreEntries = assertTarballContents(coreTarball, [
    'dist/index.js',
    'dist/index.d.ts',
    'dist/core/audit.js',
    'bin/cli.js',
  ]);
  const astroEntries = assertTarballContents(astroTarball, [
    'dist/index.js',
    'dist/index.d.ts',
    'dist/integration.js',
    'dist/content.js',
    'dist/Schema.astro',
  ]);
  const svelteEntries = assertTarballContents(svelteTarball, [
    'dist/index.js',
    'dist/index.d.ts',
    'dist/Schema.svelte',
    'dist/Schema.svelte.d.ts',
  ]);

  assertPackageMetadata(coreTarball, coreEntries, {
    name: '@unschema-graph/core',
    directory: 'packages/core',
    files: ['dist', 'bin'],
    peerDependencies: { zod: '^4.6.0' },
  });
  assertPackageMetadata(astroTarball, astroEntries, {
    name: '@unschema-graph/astro',
    directory: 'packages/astro',
    files: ['dist'],
    peerDependencies: { astro: '^5.0.0 || ^6.0.0 || ^7.0.0' },
  });
  assertPackageMetadata(svelteTarball, svelteEntries, {
    name: '@unschema-graph/svelte',
    directory: 'packages/svelte',
    files: ['dist'],
    peerDependencies: { svelte: '^5.0.0' },
  });

  await writeFile(
    join(workspace, 'pnpm-workspace.yaml'),
    `packages:\n  - "consumers/*"\noverrides:\n  "@unschema-graph/core": "${coreDependency}"\n`
  );

  const workspaceOverrides = {
    '@unschema-graph/core': coreDependency,
  };

  const coreFixture = await materializeFixture(
    'core',
    {
      dependencies: {
        '@unschema-graph/core': coreDependency,
        zod: '^4.6.0',
      },
    },
    '',
    workspaceOverrides
  );
  await installAndBuild(coreFixture);

  for (const major of requestedAstroMajors()) {
    const astroFixture = await materializeFixture(
      'astro',
      {
        dependencies: {
          '@unschema-graph/astro': pathToFileURL(astroTarball).href,
          '@unschema-graph/core': coreDependency,
          astro: `^${major}.0.0`,
          zod: '^4.6.0',
        },
      },
      `-${major}`,
      workspaceOverrides
    );
    await installAndBuild(astroFixture);
  }

  const svelteFixture = await materializeFixture(
    'sveltekit',
    {
      dependencies: {
        '@sveltejs/adapter-auto': '^6.0.0',
        '@sveltejs/kit': '^2.0.0',
        '@unschema-graph/core': coreDependency,
        '@unschema-graph/svelte': pathToFileURL(svelteTarball).href,
        svelte: '^5.0.0',
        vite: '^7.0.0',
        zod: '^4.6.0',
      },
    },
    '',
    workspaceOverrides
  );
  await installAndBuild(svelteFixture);

  console.log(
    `Published package fixtures passed for Astro ${requestedAstroMajors().join(', ')}, Svelte 5/SvelteKit, and Node ${process.versions.node}.`
  );
} finally {
  await rm(workspace, { recursive: true, force: true });
}
