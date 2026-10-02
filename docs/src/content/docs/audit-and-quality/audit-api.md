---
title: Programmatic Audit API
description: Integrate JSON-LD validation and static HTML auditing directly into your TypeScript scripts, custom test runners, or Vitest.
---

In addition to the CLI, `@unschema-graph/core/audit` exposes a Node.js-based programmatic API for auditing HTML strings and directories.

## Installation & Import

```ts
import {
  auditHtmlContent,
  auditHtmlDirectory,
  getHtmlFiles,
  type AuditContentResult,
  type AuditDiagnostic,
  type AuditDiagnosticCode,
  type AuditError,
  type AuditResult,
} from '@unschema-graph/core/audit';
```

:::note
This module uses Node.js filesystem modules (`node:fs`, `node:path`) and should only be called in Node/Vite build scripts, test suites, or server-side tools.
:::

---

## Auditing a Directory

Use `auditHtmlDirectory` to scan an entire build directory:

```ts
import { auditHtmlDirectory } from '@unschema-graph/core/audit';

const report = auditHtmlDirectory('./dist');

console.log(`Scanned ${report.scannedFiles} HTML files.`);
console.log(`Found ${report.totalBlocks} JSON-LD blocks.`);
console.log(`Resolved ${report.resolvedLocalReferences} local graph references.`);
console.log(`Found ${report.totalEntities} entities.`);

for (const warning of report.warnings) {
  console.warn(warning.code, warning.message);
}

for (const error of report.errors) {
  console.error(error.code, error.message);
}

if (!report.passed) {
  process.exit(1);
}
```

### Result Semantics (`passed` vs `--strict`)

- In the programmatic API, `report.passed` is `true` when there are zero errors (`errors.length === 0`). Warnings do not cause `report.passed` to be `false`.
- In the CLI, the `--strict` flag additionally treats warnings as failures (exiting with code `1`).

When a page contains a canonical link element, the audit uses its `href` URL to validate
fragment and absolute same-document `@id` references. An absolute reference to another path on
the same origin is treated as external to the current graph.

Without a canonical URL, only a fragment-only reference such as `#organization` can be proven to
target the current document. Path references such as `/about#organization`, `./page#thing`, and
`../page#thing` are therefore not reported as locally broken.

---

## Auditing Raw HTML Strings

Use `auditHtmlContent` to validate an HTML string directly in unit tests or Vitest:

```ts
import { auditHtmlContent } from '@unschema-graph/core/audit';
import { describe, expect, it } from 'vitest';

describe('Server-rendered HTML', () => {
  it('contains valid Schema.org JSON-LD', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Test article"
            }
          </script>
        </head>
        <body></body>
      </html>
    `;

    const result = auditHtmlContent(html, 'virtual-test.html');
    expect(result.entities).toBe(1);
    expect(result.blocks).toBe(1);
    expect(result.resolvedLocalReferences).toBe(0);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });
});
```

---

## TypeScript Interfaces

The following types and interfaces are exported by `@unschema-graph/core/audit`:

```ts
export type AuditDiagnosticCode =
  | 'empty-script'
  | 'invalid-json'
  | 'invalid-root'
  | 'missing-context'
  | 'invalid-graph'
  | 'missing-type'
  | 'broken-reference'
  | 'duplicate-id'
  | 'duplicate-conflict'
  | 'no-html'
  | 'no-jsonld';

export interface AuditDiagnostic {
  code: AuditDiagnosticCode;
  severity: 'warning' | 'error';
  file: string;
  message: string;
  path?: string;
  id?: string;
}

export type AuditError = AuditDiagnostic;

export interface AuditResult {
  scannedFiles: number;
  totalBlocks: number;
  totalEntities: number;
  resolvedLocalReferences: number;
  errors: AuditError[];
  warnings: AuditDiagnostic[];
  passed: boolean;
}

export interface AuditContentResult {
  blocks: number;
  entities: number;
  resolvedLocalReferences: number;
  errors: AuditError[];
  warnings: AuditDiagnostic[];
}
```
