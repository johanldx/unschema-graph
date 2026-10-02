---
title: DataDownload builder
description: Référence du builder DataDownload pour créer une entité Schema.org DataDownload validée.
---

Le builder `DataDownload` crée une entité `DataDownload`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { DataDownload } from '@unschema-graph/astro';

// Svelte 5
import { DataDownload } from '@unschema-graph/svelte';

// Core / Node.js
import { DataDownload } from '@unschema-graph/core';
import { DataDownloadSchema } from '@unschema-graph/core';
```

Le schéma Zod `DataDownloadSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  DataDownloadSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type DataDownloadInput = SchemaInput<typeof DataDownloadSchema>;
type DataDownloadOutput = SchemaOutput<typeof DataDownloadSchema, 'DataDownload'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `contentUrl` | string | Oui | non-empty |
| `encodingFormat` | string | Non | — |
| `name` | string | Non | — |
| `description` | string | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `DataDownload`.

## Exemple minimal

```ts
import { DataDownload } from '@unschema-graph/core';

const entity = DataDownload({
  "contentUrl": "https://example.com/data.csv",
  "encodingFormat": "text/csv"
});
```

## Sortie

```json
{
  "@type": "DataDownload",
  "contentUrl": "https://example.com/data.csv",
  "encodingFormat": "text/csv"
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org DataDownload](https://schema.org/DataDownload)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `DataDownload.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
