---
title: ListItem builder
description: Référence du builder ListItem pour créer une entité Schema.org ListItem validée.
---

Le builder `ListItem` crée une entité `ListItem`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { ListItem } from '@unschema-graph/astro';

// Svelte 5
import { ListItem } from '@unschema-graph/svelte';

// Core / Node.js
import { ListItem } from '@unschema-graph/core';
import { ListItemSchema } from '@unschema-graph/core';
```

Le schéma Zod `ListItemSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  ListItemSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ListItemInput = SchemaInput<typeof ListItemSchema>;
type ListItemOutput = SchemaOutput<typeof ListItemSchema, 'ListItem'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `position` | number | Non | integer; greater than 0; maximum: 9007199254740991 |
| `name` | string | Oui | non-empty |
| `item` | string | Non | non-empty |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `ListItem`.

## Exemple minimal

```ts
import { ListItem } from '@unschema-graph/core';

const entity = ListItem({
  "name": "First result",
  "position": 1,
  "item": "/results/first"
});
```

## Sortie

```json
{
  "@type": "ListItem",
  "position": 1,
  "name": "First result",
  "item": "/results/first"
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org ListItem](https://schema.org/ListItem)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `ListItem.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
