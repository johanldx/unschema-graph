---
title: ContactPoint builder
description: Référence du builder ContactPoint pour créer une entité Schema.org ContactPoint validée.
---

Le builder `ContactPoint` crée une entité `ContactPoint`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { ContactPoint } from '@unschema-graph/astro';

// Svelte 5
import { ContactPoint } from '@unschema-graph/svelte';

// Core / Node.js
import { ContactPoint } from '@unschema-graph/core';
import { ContactPointSchema } from '@unschema-graph/core';
```

Le schéma Zod `ContactPointSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  ContactPointSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ContactPointInput = SchemaInput<typeof ContactPointSchema>;
type ContactPointOutput = SchemaOutput<typeof ContactPointSchema, 'ContactPoint'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | — |
| `telephone` | string | Non | — |
| `contactType` | string | Non | — |
| `email` | string | Non | format: email |
| `areaServed` | string \| Array<string> | Non | — |
| `availableLanguage` | string \| Array<string> | Non | — |
| `url` | string | Non | non-empty |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `ContactPoint`.

## Exemple minimal

```ts
import { ContactPoint } from '@unschema-graph/core';

const entity = ContactPoint({
  "contactType": "customer support",
  "email": "support@example.com"
});
```

## Sortie

```json
{
  "@type": "ContactPoint",
  "contactType": "customer support",
  "email": "support@example.com"
}
```

## Relations et recettes

- Builders liés : [`ImageObject`](/fr/reference/builders/image-object/), [`PostalAddress`](/fr/reference/builders/postal-address/), [`GeoCoordinates`](/fr/reference/builders/geo-coordinates/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org ContactPoint](https://schema.org/ContactPoint)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `ContactPoint.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
