---
title: Product builder
description: Référence du builder Product pour créer une entité Schema.org Product validée.
---

Le builder `Product` crée une entité `Product`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { Product } from '@unschema-graph/astro';

// Svelte 5
import { Product } from '@unschema-graph/svelte';

// Core / Node.js
import { Product } from '@unschema-graph/core';
import { ProductSchema } from '@unschema-graph/core';
```

Le schéma Zod `ProductSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  ProductSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ProductInput = SchemaInput<typeof ProductSchema>;
type ProductOutput = SchemaOutput<typeof ProductSchema, 'Product'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `name` | string | Oui | non-empty |
| `image` | string \| [ImageObject](/fr/reference/builders/image-object/) \| Array<string \| [ImageObject](/fr/reference/builders/image-object/)> | Non | non-empty |
| `description` | string | Non | — |
| `brand` | unknown | Non | — |
| `offers` | [Offer](/fr/reference/builders/offer/) \| Aggregate[Offer](/fr/reference/builders/offer/) \| Array<[Offer](/fr/reference/builders/offer/) \| Aggregate[Offer](/fr/reference/builders/offer/)> | Non | — |
| `aggregateRating` | Aggregate[Rating](/fr/reference/builders/rating/) | Non | — |
| `review` | [Review](/fr/reference/builders/review/) \| Array<[Review](/fr/reference/builders/review/)> | Non | — |
| `sku` | string | Non | — |
| `gtin` | string | Non | — |
| `gtin8` | string | Non | — |
| `gtin13` | string | Non | — |
| `gtin14` | string | Non | — |
| `mpn` | string | Non | — |
| `category` | string | Non | — |
| `color` | string | Non | — |
| `material` | string | Non | — |
| `releaseDate` | string \| number | Non | non-empty |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `Product`.

## Exemple minimal

```ts
import { Product } from '@unschema-graph/core';

const entity = Product({
  "name": "Mechanical keyboard",
  "sku": "KB-001",
  "brand": "Acme"
});
```

## Sortie

```json
{
  "@type": "Product",
  "name": "Mechanical keyboard",
  "brand": {
    "@type": "Brand",
    "name": "Acme"
  },
  "sku": "KB-001"
}
```

## Relations et recettes

- Builders liés : [`Offer`](/fr/reference/builders/offer/), [`AggregateOffer`](/fr/reference/builders/aggregate-offer/), [`Service`](/fr/reference/builders/service/), [`JobPosting`](/fr/reference/builders/job-posting/)
- Utilisé par : [E-commerce](/fr/recipes/ecommerce/)
- Sources externes : [Schema.org Product](https://schema.org/Product) · [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/product)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `Product.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
