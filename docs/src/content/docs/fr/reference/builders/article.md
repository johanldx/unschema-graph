---
title: Article builder
description: Référence du builder Article pour créer une entité Schema.org Article validée.
---

Le builder `Article` crée une entité `Article`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { Article } from '@unschema-graph/astro';

// Svelte 5
import { Article } from '@unschema-graph/svelte';

// Core / Node.js
import { Article } from '@unschema-graph/core';
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

type ArticleInput = SchemaInput<typeof ArticleSchema>;
type ArticleOutput = SchemaOutput<typeof ArticleSchema, 'Article'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `headline` | string | Non | non-empty |
| `image` | string \| [ImageObject](/fr/reference/builders/image-object/) \| Array<string \| [ImageObject](/fr/reference/builders/image-object/)> | Non | non-empty |
| `datePublished` | string \| number \| Date | Non | non-empty |
| `dateModified` | string \| number \| Date | Non | non-empty |
| `author` | Array<unknown> | Non | — |
| `publisher` | unknown | Non | — |
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
`@type` vaut toujours `Article`.

## Exemple minimal

```ts
import { Article } from '@unschema-graph/core';

const entity = Article({
  "headline": "Structured data with Astro",
  "image": "/images/structured-data.jpg",
  "datePublished": "2026-09-29",
  "author": "Ada Lovelace"
});
```

## Sortie

```json
{
  "@type": "Article",
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

- Builders liés : [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/), [`HowTo`](/fr/reference/builders/how-to/)
- Utilisé par : [Blog et média](/fr/recipes/blog-media/), [CMS et Content Collections](/fr/recipes/cms-content-collections/), [SvelteKit et SSR](/fr/recipes/sveltekit-ssr/), [Audit en CI](/fr/recipes/audit-ci/), [Core dans tout framework](/fr/recipes/core-frameworks/)
- Sources externes : [Schema.org Article](https://schema.org/Article) · [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/article)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `Article.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
