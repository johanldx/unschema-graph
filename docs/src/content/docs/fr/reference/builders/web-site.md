---
title: WebSite builder
description: Référence du builder WebSite pour créer une entité Schema.org WebSite validée.
---

Le builder `WebSite` crée une entité `WebSite`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { WebSite } from '@unschema-graph/astro';

// Svelte 5
import { WebSite } from '@unschema-graph/svelte';

// Core / Node.js
import { WebSite } from '@unschema-graph/core';
import { WebSiteSchema } from '@unschema-graph/core';
```

Le schéma Zod `WebSiteSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  WebSiteSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type WebSiteInput = SchemaInput<typeof WebSiteSchema>;
type WebSiteOutput = SchemaOutput<typeof WebSiteSchema, 'WebSite'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `name` | string | Oui | non-empty |
| `url` | string | Oui | non-empty |
| `alternateName` | string \| Array<string> | Non | — |
| `description` | string | Non | — |
| `inLanguage` | string | Non | — |
| `searchUrl` | string | Non | non-empty |
| `publisher` | unknown | Non | — |
| `potentialAction` | string \| object \| Array<string \| object> | Non | non-empty |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `WebSite`.

## Exemple minimal

```ts
import { WebSite } from '@unschema-graph/core';

const entity = WebSite({
  "name": "Acme Docs",
  "url": "https://example.com",
  "searchUrl": "https://example.com/search?q={search_term_string}"
});
```

## Sortie

```json
{
  "@type": "WebSite",
  "name": "Acme Docs",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://example.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : [Site d’entreprise](/fr/recipes/company-site/)
- Sources externes : [Schema.org WebSite](https://schema.org/WebSite)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `WebSite.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
