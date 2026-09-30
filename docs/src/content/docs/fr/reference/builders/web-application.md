---
title: WebApplication builder
description: Référence du builder WebApplication pour créer une entité Schema.org WebApplication validée.
---

Le builder `WebApplication` crée une entité `WebApplication`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { WebApplication } from '@unschema-graph/astro';

// Svelte 5
import { WebApplication } from '@unschema-graph/svelte';

// Core / Node.js
import { WebApplication } from '@unschema-graph/core';
import { SoftwareApplicationSchema } from '@unschema-graph/core';
```

Le schéma Zod `SoftwareApplicationSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  SoftwareApplicationSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type WebApplicationInput = SchemaInput<typeof SoftwareApplicationSchema>;
type WebApplicationOutput = SchemaOutput<typeof SoftwareApplicationSchema, 'WebApplication'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `name` | string | Oui | non-empty |
| `operatingSystem` | string | Non | — |
| `applicationCategory` | string | Non | — |
| `offers` | [Offer](/fr/reference/builders/offer/) \| Aggregate[Offer](/fr/reference/builders/offer/) \| Array<[Offer](/fr/reference/builders/offer/) \| Aggregate[Offer](/fr/reference/builders/offer/)> | Non | — |
| `aggregateRating` | Aggregate[Rating](/fr/reference/builders/rating/) | Non | — |
| `review` | [Review](/fr/reference/builders/review/) \| Array<[Review](/fr/reference/builders/review/)> | Non | — |
| `screenshot` | string \| [ImageObject](/fr/reference/builders/image-object/) \| Array<string \| [ImageObject](/fr/reference/builders/image-object/)> | Non | non-empty |
| `softwareVersion` | string | Non | — |
| `downloadUrl` | string | Non | — |
| `fileSize` | string | Non | — |
| `description` | string | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `WebApplication`.

## Exemple minimal

```ts
import { WebApplication } from '@unschema-graph/core';

const entity = WebApplication({
  "name": "Acme Editor",
  "operatingSystem": "Web",
  "applicationCategory": "DeveloperApplication"
});
```

## Sortie

```json
{
  "@type": "WebApplication",
  "name": "Acme Editor",
  "operatingSystem": "Web",
  "applicationCategory": "DeveloperApplication"
}
```

## Relations et recettes

- Builders liés : [`Product`](/fr/reference/builders/product/), [`Offer`](/fr/reference/builders/offer/), [`AggregateOffer`](/fr/reference/builders/aggregate-offer/), [`Service`](/fr/reference/builders/service/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org WebApplication](https://schema.org/WebApplication)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `WebApplication.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
