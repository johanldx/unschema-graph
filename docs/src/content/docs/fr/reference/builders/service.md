---
title: Service builder
description: Référence du builder Service pour créer une entité Schema.org Service validée.
---

Le builder `Service` crée une entité `Service`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { Service } from '@unschema-graph/astro';

// Svelte 5
import { Service } from '@unschema-graph/svelte';

// Core / Node.js
import { Service } from '@unschema-graph/core';
import { ServiceSchema } from '@unschema-graph/core';
```

Le schéma Zod `ServiceSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  ServiceSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ServiceInput = SchemaInput<typeof ServiceSchema>;
type ServiceOutput = SchemaOutput<typeof ServiceSchema, 'Service'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `name` | string | Oui | non-empty |
| `provider` | string \| [Person](/fr/reference/builders/person/) \| [Organization](/fr/reference/builders/organization/) \| [LocalBusiness](/fr/reference/builders/local-business/) \| EntityReference | Non | non-empty |
| `serviceType` | string | Non | — |
| `description` | string | Non | — |
| `areaServed` | string \| Array<string> \| object | Non | — |
| `offers` | [Offer](/fr/reference/builders/offer/) \| Aggregate[Offer](/fr/reference/builders/offer/) \| Array<[Offer](/fr/reference/builders/offer/) \| Aggregate[Offer](/fr/reference/builders/offer/)> | Non | — |
| `aggregateRating` | Aggregate[Rating](/fr/reference/builders/rating/) | Non | — |
| `review` | [Review](/fr/reference/builders/review/) \| Array<[Review](/fr/reference/builders/review/)> | Non | — |
| `termsOfService` | string | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `Service`.

## Exemple minimal

```ts
import { Service } from '@unschema-graph/core';

const entity = Service({
  "name": "Astro consulting",
  "provider": "Acme"
});
```

## Sortie

```json
{
  "@type": "Service",
  "name": "Astro consulting",
  "provider": {
    "@type": "Organization",
    "name": "Acme"
  }
}
```

## Relations et recettes

- Builders liés : [`Product`](/fr/reference/builders/product/), [`Offer`](/fr/reference/builders/offer/), [`AggregateOffer`](/fr/reference/builders/aggregate-offer/), [`JobPosting`](/fr/reference/builders/job-posting/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org Service](https://schema.org/Service)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `Service.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
