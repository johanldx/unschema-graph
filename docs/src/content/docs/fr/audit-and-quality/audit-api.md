---
title: API programmatique d'Audit
description: Intégrer la validation JSON-LD et l'audit de code HTML directement dans vos scripts TypeScript, Vitest ou outils internes.
---

En complément de la commande CLI, le point d'entrée `@unschema-graph/core/audit` exporte une API programmatique Node.js permettant d'auditer des chaînes de caractères HTML ou des dossiers de fichiers.

## Importation

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
Ce sous-module s'appuie sur les modules natifs Node.js (`node:fs`, `node:path`) et est destiné à être exécuté dans des scripts de build, des tests ou sur un serveur.
:::

---

## Auditer un dossier de build

La méthode `auditHtmlDirectory` permet d'inspecter l'intégralité d'un dossier de sortie :

```ts
import { auditHtmlDirectory } from '@unschema-graph/core/audit';

const report = auditHtmlDirectory('./dist');

console.log(`${report.scannedFiles} fichiers HTML scannés.`);
console.log(`${report.totalBlocks} blocs JSON-LD trouvés.`);
console.log(`${report.resolvedLocalReferences} références locales résolues.`);
console.log(`${report.totalEntities} entités trouvées.`);

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

### Sémantique du résultat (`passed` vs `--strict`)

- Dans l'API programmatique, `report.passed` vaut `true` dès lors qu'il n'y a aucune erreur (`errors.length === 0`). Les avertissements n'entraînent pas le passage de `report.passed` à `false`.
- Dans la CLI, l'option `--strict` traite en supplément les avertissements comme des échecs bloquants (code de sortie `1`).

Lorsqu’une page contient un élément de lien canonique, l’audit utilise son URL `href` pour
valider les références `@id` absolues ou sous forme de fragment qui ciblent le même document. Une
URL absolue vers un autre chemin de la même origine est considérée comme externe au graphe courant.

Sans URL canonique, seule une référence composée uniquement d’un fragment comme `#organization`
peut être identifiée avec certitude comme appartenant au document courant. Les chemins comme
`/a-propos#organization`, `./page#thing` et `../page#thing` ne sont donc pas signalés comme des
références locales cassées.

---

## Auditer des chaînes HTML brutes

La méthode `auditHtmlContent` est idéale pour valider le code HTML produit par vos composants dans des tests unitaires ou des suites Vitest :

```ts
import { auditHtmlContent } from '@unschema-graph/core/audit';
import { describe, expect, it } from 'vitest';

describe('Rendu HTML serveur', () => {
  it('contient un JSON-LD Schema.org conforme', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Mon article de test"
            }
          </script>
        </head>
        <body></body>
      </html>
    `;

    const result = auditHtmlContent(html, 'test-virtuel.html');
    expect(result.entities).toBe(1);
    expect(result.blocks).toBe(1);
    expect(result.resolvedLocalReferences).toBe(0);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });
});
```

---

## Interfaces TypeScript

Les types et interfaces suivants sont exportés par `@unschema-graph/core/audit` :

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
