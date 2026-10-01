---
title: Event builder
description: Référence du builder Event pour créer une entité Schema.org Event validée.
---

Le builder `Event` crée une entité `Event`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { Event } from '@unschema-graph/astro';

// Svelte 5
import { Event } from '@unschema-graph/svelte';

// Core / Node.js
import { Event } from '@unschema-graph/core';
import { EventSchema } from '@unschema-graph/core';
```

Le schéma Zod `EventSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  EventSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type EventInput = SchemaInput<typeof EventSchema>;
type EventOutput = SchemaOutput<typeof EventSchema, 'Event'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `name` | string | Oui | non-empty |
| `startDate` | string \| number \| Date | Oui | non-empty |
| `location` | string \| Place \| VirtualLocation \| [PostalAddress](/fr/reference/builders/postal-address/) \| EntityReference | Oui | non-empty |
| `endDate` | string \| number \| Date | Non | non-empty |
| `duration` | string \| number \| DurationObject | Non | non-empty; greater than 0 |
| `description` | string | Non | — |
| `image` | string \| [ImageObject](/fr/reference/builders/image-object/) \| Array<string \| [ImageObject](/fr/reference/builders/image-object/)> | Non | non-empty |
| `eventStatus` | string | Non | — |
| `eventAttendanceMode` | string | Non | — |
| `organizer` | [Person](/fr/reference/builders/person/) \| [Organization](/fr/reference/builders/organization/) \| EntityReference \| Array<[Person](/fr/reference/builders/person/) \| [Organization](/fr/reference/builders/organization/) \| EntityReference> | Non | — |
| `performer` | [Person](/fr/reference/builders/person/) \| [Organization](/fr/reference/builders/organization/) \| EntityReference \| Array<[Person](/fr/reference/builders/person/) \| [Organization](/fr/reference/builders/organization/) \| EntityReference> | Non | — |
| `offers` | [Offer](/fr/reference/builders/offer/) \| Aggregate[Offer](/fr/reference/builders/offer/) \| Array<[Offer](/fr/reference/builders/offer/) \| Aggregate[Offer](/fr/reference/builders/offer/)> | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `Event`.

## Exemple minimal

```ts
import { Event } from '@unschema-graph/core';

const entity = Event({
  "name": "Astro meetup",
  "startDate": "2026-10-15T18:00:00+02:00",
  "location": "Paris, France"
});
```

## Sortie

```json
{
  "@type": "Event",
  "name": "Astro meetup",
  "startDate": "2026-10-15T18:00:00+02:00",
  "location": "Paris, France"
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : [Événements](/fr/recipes/events/)
- Sources externes : [Schema.org Event](https://schema.org/Event) · [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/event)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `Event.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
