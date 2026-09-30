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
  type AuditResult,
  type AuditError,
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

const result = auditHtmlDirectory('./dist');

console.log(`Scanned ${result.scannedFiles} HTML files.`);
console.log(`Found ${result.totalBlocks} JSON-LD blocks.`);
console.log(`Validated ${result.totalEntities} entities.`);

if (!result.passed) {
  console.error('Audit failed with errors:');
  for (const error of result.errors) {
    console.error(`- [${error.file}] ${error.message}`);
  }
  process.exit(1);
}
```

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
    expect(result.passed).toBe(true);
    expect(result.totalEntities).toBe(1);
    expect(result.errors).toHaveLength(0);
  });
});
```

---

## TypeScript Interfaces

```ts
export interface AuditError {
  file: string;
  message: string;
}

export interface AuditResult {
  scannedFiles: number;
  totalBlocks: number;
  totalEntities: number;
  errors: AuditError[];
  passed: boolean;
}
```
