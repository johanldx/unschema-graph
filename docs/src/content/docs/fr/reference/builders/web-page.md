---
title: WebPage builder
description: Référence du builder WebPage pour créer une entité Schema.org WebPage validée.
---

Le builder `WebPage` crée une entité `WebPage`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { WebPage } from '@unschema-graph/astro';

// Svelte 5
import { WebPage } from '@unschema-graph/svelte';

// Core / Node.js
import { WebPage } from '@unschema-graph/core';
import { WebPageSchema } from '@unschema-graph/core';
```

Le schéma Zod `WebPageSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  WebPageSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type WebPageInput = SchemaInput<typeof WebPageSchema>;
type WebPageOutput = SchemaOutput<typeof WebPageSchema, 'WebPage'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `name` | string | Non | — |
| `url` | string | Non | non-empty |
| `headline` | string | Non | — |
| `description` | string | Non | — |
| `inLanguage` | string | Non | — |
| `speakable` | string \| Array<string> \| object | Non | — |
| `isPartOf` | unknown | Non | — |
| `breadcrumb` | unknown | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `WebPage`.

## Exemple minimal

```ts
import { WebPage } from '@unschema-graph/core';

const entity = WebPage({
  "name": "About Acme",
  "url": "https://example.com/about"
});
```

## Sortie

```json
{
  "@type": "WebPage",
  "name": "About Acme",
  "url": "https://example.com/about"
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : [Blog et média](/fr/recipes/blog-media/), [Site d’entreprise](/fr/recipes/company-site/)
- Sources externes : [Schema.org WebPage](https://schema.org/WebPage)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `WebPage.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
