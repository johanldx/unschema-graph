---
title: DiscussionForumPosting builder
description: Référence du builder DiscussionForumPosting pour créer une entité Schema.org DiscussionForumPosting validée.
---

Le builder `DiscussionForumPosting` crée une entité `DiscussionForumPosting`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { DiscussionForumPosting } from '@unschema-graph/astro';

// Svelte 5
import { DiscussionForumPosting } from '@unschema-graph/svelte';

// Core / Node.js
import { DiscussionForumPosting } from '@unschema-graph/core';
import { DiscussionForumPostingSchema } from '@unschema-graph/core';
```

Le schéma Zod `DiscussionForumPostingSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  DiscussionForumPostingSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type DiscussionForumPostingInput = SchemaInput<typeof DiscussionForumPostingSchema>;
type DiscussionForumPostingOutput = SchemaOutput<typeof DiscussionForumPostingSchema, 'DiscussionForumPosting'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `headline` | string | Oui | non-empty |
| `author` | [Person](/fr/reference/builders/person/) \| [Organization](/fr/reference/builders/organization/) \| EntityReference | Oui | — |
| `datePublished` | string \| number \| Date | Oui | non-empty |
| `text` | string | Non | — |
| `comment` | object \| Array<object> | Non | — |
| `url` | string | Non | non-empty |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `DiscussionForumPosting`.

## Exemple minimal

```ts
import { DiscussionForumPosting } from '@unschema-graph/core';

const entity = DiscussionForumPosting({
  "headline": "Structured data patterns",
  "author": "Ada Lovelace",
  "datePublished": "2026-09-29"
});
```

## Sortie

```json
{
  "@type": "DiscussionForumPosting",
  "headline": "Structured data patterns",
  "author": {
    "@type": "Person",
    "name": "Ada Lovelace"
  },
  "datePublished": "2026-09-29"
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org DiscussionForumPosting](https://schema.org/DiscussionForumPosting)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `DiscussionForumPosting.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
