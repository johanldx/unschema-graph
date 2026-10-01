---
title: HowToSection builder
description: Référence du builder HowToSection pour créer une entité Schema.org HowToSection validée.
---

Le builder `HowToSection` crée une entité `HowToSection`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { HowToSection } from '@unschema-graph/astro';

// Svelte 5
import { HowToSection } from '@unschema-graph/svelte';

// Core / Node.js
import { HowToSection } from '@unschema-graph/core';
import { HowToSectionSchema } from '@unschema-graph/core';
```

Le schéma Zod `HowToSectionSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  HowToSectionSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type HowToSectionInput = SchemaInput<typeof HowToSectionSchema>;
type HowToSectionOutput = SchemaOutput<typeof HowToSectionSchema, 'HowToSection'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `name` | string | Oui | non-empty |
| `itemListElement` | Array<object> | Oui | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `HowToSection`.

## Exemple minimal

```ts
import { HowToSection } from '@unschema-graph/core';

const entity = HowToSection({
  "name": "Deployment",
  "itemListElement": [
    {
      "text": "Build the Astro project."
    }
  ]
});
```

## Sortie

```json
{
  "@type": "HowToSection",
  "name": "Deployment",
  "itemListElement": [
    {
      "@type": "HowToStep",
      "text": "Build the Astro project."
    }
  ]
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org HowToSection](https://schema.org/HowToSection)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `HowToSection.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
