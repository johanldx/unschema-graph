---
title: BlogPosting builder
description: Référence du builder BlogPosting pour créer une entité Schema.org BlogPosting validée.
---

Le builder `BlogPosting` crée une entité `BlogPosting`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { BlogPosting } from '@unschema-graph/astro';

// Svelte 5
import { BlogPosting } from '@unschema-graph/svelte';

// Core / Node.js
import { BlogPosting } from '@unschema-graph/core';
import { ArticleSchema } from '@unschema-graph/core';
```

Le schéma Zod `ArticleSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  ArticleSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type BlogPostingInput = SchemaInput<typeof ArticleSchema>;
type BlogPostingOutput = SchemaOutput<typeof ArticleSchema, 'BlogPosting'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `headline` | string | Non | non-empty |
| `image` | string \| [ImageObject](/fr/reference/builders/image-object/) \| Array<string \| [ImageObject](/fr/reference/builders/image-object/)> | Non | non-empty |
| `datePublished` | string \| number \| Date | Non | non-empty |
| `dateModified` | string \| number \| Date | Non | non-empty |
| `author` | [Person](/fr/reference/builders/person/) \| [Organization](/fr/reference/builders/organization/) \| EntityReference \| Array<[Person](/fr/reference/builders/person/) \| [Organization](/fr/reference/builders/organization/) \| EntityReference> | Non | — |
| `publisher` | [Person](/fr/reference/builders/person/) \| [Organization](/fr/reference/builders/organization/) \| EntityReference | Non | — |
| `description` | string | Non | — |
| `articleBody` | string | Non | — |
| `articleSection` | string \| Array<string> | Non | — |
| `keywords` | string \| Array<string> | Non | — |
| `inLanguage` | string | Non | — |
| `mainEntityOfPage` | string \| object | Non | non-empty |
| `wordCount` | number | Non | integer; greater than 0; maximum: 9007199254740991 |
| `speakable` | string \| Array<string> \| object | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `BlogPosting`.

## Exemple minimal

```ts
import { BlogPosting } from '@unschema-graph/core';

const entity = BlogPosting({
  "headline": "Structured data with Astro",
  "image": "/images/structured-data.jpg",
  "datePublished": "2026-09-29",
  "author": "Ada Lovelace"
});
```

## Sortie

```json
{
  "@type": "BlogPosting",
  "headline": "Structured data with Astro",
  "image": "/images/structured-data.jpg",
  "datePublished": "2026-09-29",
  "author": {
    "@type": "Person",
    "name": "Ada Lovelace"
  }
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/), [`HowTo`](/fr/reference/builders/how-to/)
- Utilisé par : [Blog et média](/fr/recipes/blog-media/)
- Sources externes : [Schema.org BlogPosting](https://schema.org/BlogPosting) · [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/article)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `BlogPosting.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
