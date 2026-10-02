---
title: Dataset builder
description: Référence du builder Dataset pour créer une entité Schema.org Dataset validée.
---

Le builder `Dataset` crée une entité `Dataset`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { Dataset } from '@unschema-graph/astro';

// Svelte 5
import { Dataset } from '@unschema-graph/svelte';

// Core / Node.js
import { Dataset } from '@unschema-graph/core';
import { DatasetSchema } from '@unschema-graph/core';
```

Le schéma Zod `DatasetSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  DatasetSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type DatasetInput = SchemaInput<typeof DatasetSchema>;
type DatasetOutput = SchemaOutput<typeof DatasetSchema, 'Dataset'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `name` | string | Oui | non-empty |
| `description` | string | Oui | non-empty |
| `url` | string | Non | non-empty |
| `creator` | [Person](/fr/reference/builders/person/) \| [Organization](/fr/reference/builders/organization/) \| EntityReference \| Array<[Person](/fr/reference/builders/person/) \| [Organization](/fr/reference/builders/organization/) \| EntityReference> | Non | — |
| `distribution` | [DataDownload](/fr/reference/builders/data-download/) \| Array<[DataDownload](/fr/reference/builders/data-download/)> | Non | — |
| `license` | string | Non | non-empty |
| `keywords` | string \| Array<string> | Non | — |
| `temporalCoverage` | string | Non | — |
| `spatialCoverage` | string | Non | — |
| `version` | string | Non | — |
| `isAccessibleForFree` | boolean | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `Dataset`.

## Exemple minimal

```ts
import { Dataset } from '@unschema-graph/core';

const entity = Dataset({
  "name": "Astro adoption data",
  "description": "Annual anonymized adoption metrics."
});
```

## Sortie

```json
{
  "@type": "Dataset",
  "name": "Astro adoption data",
  "description": "Annual anonymized adoption metrics."
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org Dataset](https://schema.org/Dataset)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `Dataset.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
