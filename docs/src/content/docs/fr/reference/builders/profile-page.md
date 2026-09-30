---
title: ProfilePage builder
description: Référence du builder ProfilePage pour créer une entité Schema.org ProfilePage validée.
---

Le builder `ProfilePage` crée une entité `ProfilePage`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { ProfilePage } from '@unschema-graph/astro';

// Svelte 5
import { ProfilePage } from '@unschema-graph/svelte';

// Core / Node.js
import { ProfilePage } from '@unschema-graph/core';
import { ProfilePageSchema } from '@unschema-graph/core';
```

Le schéma Zod `ProfilePageSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  ProfilePageSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ProfilePageInput = SchemaInput<typeof ProfilePageSchema>;
type ProfilePageOutput = SchemaOutput<typeof ProfilePageSchema, 'ProfilePage'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `mainEntity` | object | Oui | — |
| `name` | string | Non | — |
| `url` | string | Non | — |
| `description` | string | Non | — |
| `dateCreated` | string \| number \| Date | Non | non-empty |
| `dateModified` | string \| number \| Date | Non | non-empty |
| `inLanguage` | string | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `ProfilePage`.

## Exemple minimal

```ts
import { ProfilePage } from '@unschema-graph/core';

const entity = ProfilePage({
  "mainEntity": {
    "name": "Ada Lovelace"
  }
});
```

## Sortie

```json
{
  "@type": "ProfilePage",
  "mainEntity": {
    "name": "Ada Lovelace"
  }
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org ProfilePage](https://schema.org/ProfilePage)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `ProfilePage.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
