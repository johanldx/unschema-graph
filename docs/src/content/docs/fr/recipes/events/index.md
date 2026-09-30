---
title: Événements
description: Publier une occurrence avec dates, lieu, offre et statut de cycle de vie explicites.
---

## Objectif

Publier une occurrence avec dates, lieu, offre et statut de cycle de vie explicites.

> **Validation locale** — Les builders rejettent les propriétés inconnues et exposent `safeParse()` pour les données externes.
>
> **Schema.org** — Le vocabulaire décrit le sens des propriétés ; il ne garantit aucun affichage dans un moteur.
>
> **Éligibilité Google** — Les exigences Google sont supplémentaires et peuvent évoluer. Un balisage valide ne garantit jamais un résultat enrichi.

## Prérequis

- Une URL canonique et un `baseUrl` fiables.
- Des données visibles, actuelles et issues de votre source métier.
- Les builders liés: [`Event`](/fr/reference/builders/event/), [`Offer`](/fr/reference/builders/offer/), [`PostalAddress`](/fr/reference/builders/postal-address/).

## Graphe recommandé

1. `Event` — nœud principal
2. `Offer`
3. `PostalAddress`

## Exemple minimal

```ts
import { Event } from '@unschema-graph/core';

const entity = Event({
  "name": "Astro meetup",
  "startDate": "2026-10-15T18:00:00+02:00",
  "location": "Paris, France"
});
```

## Exemple de production

Utilisez un décalage ISO 8601 lorsque le fuseau importe. En cas d’annulation, conservez l’URL et changez eventStatus.

```ts
const result = Event.safeParse(cmsData);
if (!result.success) {
  throw new Error(result.error.issues.map((issue) => issue.message).join('\n'));
}

const graph = buildJsonLdGraph([result.data], { baseUrl: 'https://example.com' });
```

## Variantes par environnement

| Astro | Svelte 5 / SvelteKit | Core |
| --- | --- | --- |
| `<Schema items={items} />` | `<Schema items={items} />` | `serializeJsonLd(buildJsonLdGraph(items))` |

## Erreurs fréquentes et diagnostic

1. **Oublier le décalage de fuseau pour un horaire précis.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.
2. **Mettre le nom de l’événement dans location.name.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.
3. **Supprimer un événement annulé au lieu de mettre son statut à jour.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.

## Validation

1. Exécutez `safeParse()` à la frontière des données.
2. Inspectez le script du HTML construit.
3. Lancez `unschema-graph audit` sur le dossier de sortie.
4. [Schema.org / official documentation](https://schema.org/Event).

## Checklist finale

- [ ] Le contenu balisé est visible et actuel.
- [ ] Chaque identité réutilisable possède un `@id` stable.
- [ ] La validation locale et l’audit du build passent.
- [ ] Les limites de garantie sont comprises.

Approfondir: [graphes et références](/fr/guides/graphs-and-references/), [validation](/fr/guides/validation/), [audit CLI](/fr/audit-and-quality/audit-cli/).
