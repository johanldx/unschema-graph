---
title: FAQPage builder
description: Référence du builder FAQPage pour créer une entité Schema.org FAQPage validée.
---

Le builder `FAQPage` crée une entité `FAQPage`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { FAQPage } from '@unschema-graph/astro';

// Svelte 5
import { FAQPage } from '@unschema-graph/svelte';

// Core / Node.js
import { FAQPage } from '@unschema-graph/core';
import { FAQPageSchema } from '@unschema-graph/core';
```

Le schéma Zod `FAQPageSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  FAQPageSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type FAQPageInput = SchemaInput<typeof FAQPageSchema>;
type FAQPageOutput = SchemaOutput<typeof FAQPageSchema, 'FAQPage'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `mainEntity` | Array<object> | Conditionnel | — |
| `questions` | Array<object> | Conditionnel | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `FAQPage`.

## Exemple minimal

```ts
import { FAQPage } from '@unschema-graph/core';

const entity = FAQPage({
  "questions": [
    {
      "question": "What is Astro?",
      "answer": "A web framework for content-driven sites."
    }
  ]
});
```

## Sortie

```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Astro?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A web framework for content-driven sites."
      }
    }
  ]
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org FAQPage](https://schema.org/FAQPage) · [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/faqpage)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `FAQPage.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
