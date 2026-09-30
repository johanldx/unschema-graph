---
title: Dates et durées
description: Formats de dates flexibles, raccourcis de durées et calculs temporels ISO 8601.
---

Les builders temporels normalisent les dates et durées prises en charge au format ISO
8601, par exemple `2026-09-29T10:00:00.000Z` et `PT1H30M`. Les raccourcis lisibles sont
une facilité d'entrée de la bibliothèque ; le JSON-LD reçoit la valeur normalisée.

---

## 1. Formats de dates acceptés

Les champs adossés à `IsoDateSchema` (`datePublished`, `dateModified`, `startDate`, `validThrough`, etc.) acceptent :

- Les instances JavaScript `Date` (`new Date()`) ;
- Les timestamps Unix en secondes ou millisecondes (`1727600000`) ;
- Les chaînes ISO 8601 standard (`'2026-09-29'`) ;
- Les mots-clés naturels : `'now'`, `'today'`, `'tomorrow'` et `'yesterday'` ;
- Les expressions relatives : `'+30d'`, `'-2w'`, `'+6m'`, `'+1y'`, `'+4h'`.

```ts
import { JobPosting } from '@unschema-graph/core';

const job = JobPosting({
  title: 'Ingénieur Full Stack',
  description: 'Conception d’applications web modernes.',
  datePosted: 'today',
  validThrough: '+30d',
  hiringOrganization: '#organization',
});
```

:::tip
Les expressions relatives (`'today'`, `'+30d'`) sont évaluées au moment du build ou du rendu SSR.
:::

---

## 2. Raccourcis de durées

Les propriétés basées sur `IsoDurationSchema` (`cookTime`, `prepTime`, `duration`, `totalTime`) acceptent :

1. **Des chaînes humaines :** `'45m'`, `'1h30'`, `'1h30m'`, `'2h'`, `'15s'`, `'2d'`.
2. **Des nombres (représentant des minutes) :** `45` devient `PT45M`, `120` devient `PT120M`.
3. **Des objets structurés :** `{ hours: 1, minutes: 15 }`, `{ days: 1, hours: 2 }`.
4. **Des chaînes ISO 8601 existantes :** `'PT1H30M'`, `'P2D'`.

```ts
import { Recipe } from '@unschema-graph/core';

const recipe = Recipe({
  name: 'Tarte aux Pommes Maison',
  image: 'https://cuisine.fr/tarte.jpg',
  recipeIngredient: ['4 pommes', '200g de pâte brisée', '50g de sucre'],
  recipeInstructions: ['Éplucher les pommes', 'Disposer les lamelles', 'Cuire à 180°C'],
  prepTime: '15m',        // Devient 'PT15M'
  cookTime: '30m',        // Devient 'PT30M'
  totalTime: '45m',       // Devient 'PT45M'
});
```

---

## 3. Helpers de calculs temporels

`@unschema-graph/core` exporte des fonctions utilitaires pures pour vos manipulations temporelles :

```ts
import {
  addDuration,
  diffDuration,
  formatIsoDate,
  formatIsoDuration,
  parseDurationToMs,
} from '@unschema-graph/core';

// Formatage de durée
formatIsoDuration('1h30'); // 'PT1H30M'
formatIsoDuration({ hours: 2, minutes: 15 }); // 'PT2H15M'

// Conversion en millisecondes
parseDurationToMs('45m'); // 2700000

// Ajout d'une durée à une date
const debut = '2026-11-20T19:00:00Z';
const fin = addDuration(debut, '2h30');
// Résultat : '2026-11-20T21:30:00.000Z'

// Calcul de la différence entre deux dates au format ISO duration
const duree = diffDuration('2026-11-20T19:00:00Z', '2026-11-20T21:00:00Z');
// Résultat : 'PT2H'
```

### Calcul automatique de `endDate` pour `Event`

Lorsqu'un `Event` est instancié avec `startDate` et `duration`, unschema-graph calcule automatiquement la date de fin `endDate` si elle n'est pas précisée :

```ts
import { Event } from '@unschema-graph/core';

const meetup = Event({
  name: 'Svelte Paris Meetup',
  startDate: '2026-11-20T19:00:00+01:00',
  duration: '2h00',
  // endDate est calculé automatiquement à '2026-11-20T20:00:00.000Z'.
});
```

Les dates relatives dépendent de l'horloge et du fuseau du processus de build ou du
serveur. Préférez des valeurs ISO explicites pour les builds reproductibles et les
contenus qui doivent conserver un instant de publication exact.

Étape suivante : comprendre [la sérialisation sûre du JSON-LD dans le
HTML](/fr/audit-and-quality/security/).
