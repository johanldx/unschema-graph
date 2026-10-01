---
title: Course builder
description: Référence du builder Course pour créer une entité Schema.org Course validée.
---

Le builder `Course` crée une entité `Course`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { Course } from '@unschema-graph/astro';

// Svelte 5
import { Course } from '@unschema-graph/svelte';

// Core / Node.js
import { Course } from '@unschema-graph/core';
import { CourseSchema } from '@unschema-graph/core';
```

Le schéma Zod `CourseSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  CourseSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type CourseInput = SchemaInput<typeof CourseSchema>;
type CourseOutput = SchemaOutput<typeof CourseSchema, 'Course'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `name` | string | Oui | non-empty |
| `description` | string | Oui | non-empty |
| `provider` | [Person](/fr/reference/builders/person/) \| [Organization](/fr/reference/builders/organization/) \| [LocalBusiness](/fr/reference/builders/local-business/) \| EntityReference | Oui | — |
| `courseCode` | string | Non | — |
| `educationalCredentialAwarded` | string | Non | — |
| `inLanguage` | string | Non | — |
| `offers` | [Offer](/fr/reference/builders/offer/) \| Aggregate[Offer](/fr/reference/builders/offer/) \| Array<[Offer](/fr/reference/builders/offer/) \| Aggregate[Offer](/fr/reference/builders/offer/)> | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `Course`.

## Exemple minimal

```ts
import { Course } from '@unschema-graph/core';

const entity = Course({
  "name": "Astro fundamentals",
  "description": "Build content-driven sites with Astro.",
  "provider": "Acme Academy"
});
```

## Sortie

```json
{
  "@type": "Course",
  "name": "Astro fundamentals",
  "description": "Build content-driven sites with Astro.",
  "provider": {
    "@type": "Organization",
    "name": "Acme Academy"
  }
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org Course](https://schema.org/Course)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `Course.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
