---
title: JobPosting builder
description: Référence du builder JobPosting pour créer une entité Schema.org JobPosting validée.
---

Le builder `JobPosting` crée une entité `JobPosting`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { JobPosting } from '@unschema-graph/astro';

// Svelte 5
import { JobPosting } from '@unschema-graph/svelte';

// Core / Node.js
import { JobPosting } from '@unschema-graph/core';
import { JobPostingSchema } from '@unschema-graph/core';
```

Le schéma Zod `JobPostingSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  JobPostingSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type JobPostingInput = SchemaInput<typeof JobPostingSchema>;
type JobPostingOutput = SchemaOutput<typeof JobPostingSchema, 'JobPosting'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `title` | string | Oui | non-empty |
| `description` | string | Oui | non-empty |
| `datePosted` | string \| number \| Date | Oui | non-empty |
| `hiringOrganization` | [Organization](/fr/reference/builders/organization/) \| EntityReference | Oui | — |
| `jobLocation` | Place \| [PostalAddress](/fr/reference/builders/postal-address/) \| EntityReference \| string \| string \| Place \| [PostalAddress](/fr/reference/builders/postal-address/) \| EntityReference | Non | non-empty |
| `validThrough` | string \| number \| Date | Non | non-empty |
| `employmentType` | string \| Array<string> | Non | — |
| `jobLocationType` | string | Non | — |
| `applicantLocationRequirements` | string \| string \| object | Non | non-empty |
| `baseSalary` | object \| string \| object | Non | non-empty |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `JobPosting`.

## Exemple minimal

```ts
import { JobPosting } from '@unschema-graph/core';

const entity = JobPosting({
  "title": "Astro developer",
  "description": "Build accessible content sites.",
  "datePosted": "2026-09-29",
  "hiringOrganization": "Acme"
});
```

## Sortie

```json
{
  "@type": "JobPosting",
  "title": "Astro developer",
  "description": "Build accessible content sites.",
  "datePosted": "2026-09-29",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Acme"
  }
}
```

## Relations et recettes

- Builders liés : [`Product`](/fr/reference/builders/product/), [`Offer`](/fr/reference/builders/offer/), [`AggregateOffer`](/fr/reference/builders/aggregate-offer/), [`Service`](/fr/reference/builders/service/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org JobPosting](https://schema.org/JobPosting)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `JobPosting.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
