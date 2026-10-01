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
  type AuditResult,
  type AuditError,
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

const result = auditHtmlDirectory('./dist');

console.log(`${result.scannedFiles} fichiers HTML scannés.`);
console.log(`${result.totalBlocks} blocs JSON-LD trouvés.`);
console.log(`${result.totalEntities} entités validées.`);

if (!result.passed) {
  console.error('Échec de l’audit avec les erreurs suivantes :');
  for (const error of result.errors) {
    console.error(`- [${error.file}] ${error.message}`);
  }
  process.exit(1);
}
```

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
    expect(result.passed).toBe(true);
    expect(result.totalEntities).toBe(1);
    expect(result.errors).toHaveLength(0);
  });
});
```

---

## Interfaces TypeScript

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
