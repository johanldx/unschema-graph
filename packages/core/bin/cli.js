#!/usr/bin/env node

import path from 'node:path';
import { auditHtmlDirectory } from '../dist/core/audit.js';

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage:
  unschema-graph audit [directory]
  npx @unschema-graph/core audit [directory]

Description:
  Scans built HTML output for Schema.org JSON-LD scripts, validates JSON syntax
  and root structure, and reports entity counts and errors.

Options:
  -h, --help    Show this help message

Arguments:
  [directory]   Directory containing built HTML files (default: "dist")

Examples:
  npx @unschema-graph/core audit
  npx @unschema-graph/core audit dist
  npx @unschema-graph/core audit ./dist/fr

Documentation:
  Audit CLI:       https://unschema-graph.jhdx.dev/audit-and-quality/audit-cli/
  Troubleshooting: https://unschema-graph.jhdx.dev/operations/troubleshooting/
`);
  process.exit(0);
}

const command = args[0] && !args[0].startsWith('-') ? args[0] : 'audit';
let targetDir = 'dist';

if (command === 'audit') {
  if (args[1] && !args[1].startsWith('-')) {
    targetDir = args[1];
  }
} else if (!args[0].startsWith('-')) {
  targetDir = args[0];
}

const resolvedDir = path.resolve(process.cwd(), targetDir);

console.log(`\n[@unschema-graph/core] Auditing Schema.org JSON-LD in "${targetDir}"...\n`);

const result = auditHtmlDirectory(resolvedDir);

console.log(`  Scanned HTML files:  ${result.scannedFiles}`);
console.log(`  JSON-LD script tags: ${result.totalBlocks}`);
console.log(`  Schema.org entities: ${result.totalEntities}\n`);

if (result.errors.length > 0) {
  console.error(`Audit failed with ${result.errors.length} error(s):\n`);
  for (const err of result.errors) {
    console.error(`  - [${err.file}] ${err.message}`);
  }
  console.error('\nPlease fix the Schema.org errors above and rebuild.');
  console.error(
    'Troubleshooting guide: https://unschema-graph.jhdx.dev/operations/troubleshooting/\n'
  );
  process.exit(1);
}

if (result.totalBlocks === 0) {
  console.warn(`Warning: No JSON-LD <script> tags found in "${targetDir}".`);
  console.warn(
    'Troubleshooting guide: https://unschema-graph.jhdx.dev/operations/troubleshooting/\n'
  );
  process.exit(0);
}

console.log(`Schema audit passed successfully. All JSON-LD structures are valid.\n`);
process.exit(0);
