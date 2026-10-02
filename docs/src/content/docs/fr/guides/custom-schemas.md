---
title: Schémas personnalisés
description: Créer des builders Schema.org stricts et typés avec Zod et defineSchema.
---

Lorsque votre projet nécessite des types Schema.org non couverts par le catalogue intégré (tels que `PodcastEpisode`, `MedicalWebPage` ou `TechArticle`), utilisez `defineSchema()` pour créer vos propres builders avec le même niveau de validation et d'intégration au `@graph`.

---

## 1. Créer un builder personnalisé

Appelez `defineSchema()` en transmettant le nom du type `@type` Schema.org et un schéma Zod :

```ts title="src/lib/schemas/podcast.ts"
import { defineSchema } from '@unschema-graph/core';
import { z } from 'zod';

export const PodcastEpisode = defineSchema(
  'PodcastEpisode',
  z.object({
    name: z.string().min(1),
    url: z.string().url(),
    duration: z.string().optional(),
    partOfSeries: z.string().optional(),
  })
);
```

Votre builder personnalisé s'utilise désormais exactement comme les builders de base :

```ts title="src/pages/podcast/[slug].astro"
import { PodcastEpisode } from '../../lib/schemas/podcast';

const episode = PodcastEpisode({
  '@id': '#episode-42',
  name: 'Créer avec Astro & unschema-graph',
  url: 'https://mon-site.fr/podcast/episode-42',
  duration: 'PT45M',
  partOfSeries: '#podcast-series',
});
```

Chaque builder personnalisé :
- Injecte automatiquement le type Schema.org (`"PodcastEpisode"`).
- Accepte un identifiant optionnel `@id`.
- Rejette les clés inconnues pour bloquer les fautes de frappe.
- Respecte le mode de sévérité `onError` (`throw`, `warn`, `silent`).
- Expose `.schema`, `.entityType` et `.safeParse()`.

`defineSchema()` impose `.strict()` sur l’objet Zod racine même si le schéma fourni
l’omet. Les objets imbriqués doivent toujours déclarer `.strict()` explicitement. Les
schémas intégrés suivent la même politique ; seul `TypedEntitySchema` emploie
intentionnellement `.passthrough()` comme point d’extension des entités typées dans les
relations.

---

## 2. Composer avec les schémas existants

Tous les schémas Zod du catalogue sont exportés avec le suffixe `*Schema` (`PersonSchema`, `OrganizationSchema`, `ImageObjectSchema`, `IsoDateSchema`). Vous pouvez les imbriquer directement dans vos schémas :

```ts title="src/lib/schemas/podcast-series.ts"
import {
  defineSchema,
  PersonSchema,
  ImageObjectSchema,
} from '@unschema-graph/core';
import { z } from 'zod';

export const PodcastSeries = defineSchema(
  'PodcastSeries',
  z.object({
    name: z.string(),
    description: z.string(),
    author: PersonSchema,
    image: ImageObjectSchema.optional(),
  })
);
```

:::tip
Conservez les schémas imbriqués stricts. Pour des ajouts ponctuels, préférez
`withAdditionalProperties()` plutôt que d’assouplir la définition avec `z.any()` ou
`.passthrough()`. Cet escape hatch ne peut remplacer ni `@type` ni `@id`.
:::
