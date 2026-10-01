---
title: Person builder
description: Référence du builder Person pour créer une entité Schema.org Person validée.
---

Le builder `Person` crée une entité `Person`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { Person } from '@unschema-graph/astro';

// Svelte 5
import { Person } from '@unschema-graph/svelte';

// Core / Node.js
import { Person } from '@unschema-graph/core';
import { PersonSchema } from '@unschema-graph/core';
```

Le schéma Zod `PersonSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  PersonSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type PersonInput = SchemaInput<typeof PersonSchema>;
type PersonOutput = SchemaOutput<typeof PersonSchema, 'Person'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `name` | string | Oui | non-empty |
| `givenName` | string | Non | — |
| `familyName` | string | Non | — |
| `additionalName` | string | Non | — |
| `url` | string | Non | non-empty |
| `image` | string \| [ImageObject](/fr/reference/builders/image-object/) | Non | non-empty |
| `jobTitle` | string | Non | — |
| `worksFor` | unknown | Non | — |
| `sameAs` | string \| Array<string> | Non | non-empty |
| `email` | string | Non | format: email |
| `telephone` | string | Non | — |
| `description` | string | Non | — |
| `address` | string \| [PostalAddress](/fr/reference/builders/postal-address/) \| EntityReference \| string \| [PostalAddress](/fr/reference/builders/postal-address/) \| EntityReference | Non | non-empty |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `Person`.

## Exemple minimal

```ts
import { Person } from '@unschema-graph/core';

const entity = Person({
  "name": "Ada Lovelace",
  "jobTitle": "Engineer"
});
```

## Sortie

```json
{
  "@type": "Person",
  "name": "Ada Lovelace",
  "jobTitle": "Engineer"
}
```

## Relations et recettes

- Builders liés : [`Organization`](/fr/reference/builders/organization/), [`LocalBusiness`](/fr/reference/builders/local-business/), [`Restaurant`](/fr/reference/builders/restaurant/), [`Store`](/fr/reference/builders/store/)
- Utilisé par : [Blog et média](/fr/recipes/blog-media/)
- Sources externes : [Schema.org Person](https://schema.org/Person)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `Person.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
