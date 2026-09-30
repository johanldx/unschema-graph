---
title: Clip builder
description: Référence du builder Clip pour créer une entité Schema.org Clip validée.
---

Le builder `Clip` crée une entité `Clip`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { Clip } from '@unschema-graph/astro';

// Svelte 5
import { Clip } from '@unschema-graph/svelte';

// Core / Node.js
import { Clip } from '@unschema-graph/core';
import { ClipSchema } from '@unschema-graph/core';
```

Le schéma Zod `ClipSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  ClipSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ClipInput = SchemaInput<typeof ClipSchema>;
type ClipOutput = SchemaOutput<typeof ClipSchema, 'Clip'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | — |
| `name` | string | Oui | non-empty |
| `startOffset` | number | Oui | minimum: 0 |
| `endOffset` | number | Oui | greater than 0 |
| `url` | string | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `Clip`.

## Exemple minimal

```ts
import { Clip } from '@unschema-graph/core';

const entity = Clip({
  "name": "Installation",
  "startOffset": 0,
  "endOffset": 42
});
```

## Sortie

```json
{
  "@type": "Clip",
  "name": "Installation",
  "startOffset": 0,
  "endOffset": 42
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org Clip](https://schema.org/Clip)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `Clip.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
