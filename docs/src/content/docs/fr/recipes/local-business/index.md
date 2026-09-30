---
title: Commerce local
description: Décrire un établissement réel avec coordonnées, horaires et géolocalisation vérifiée facultative.
---

## Objectif

Décrire un établissement réel avec coordonnées, horaires et géolocalisation vérifiée facultative.

> **Validation locale** — Les builders rejettent les propriétés inconnues et exposent `safeParse()` pour les données externes.
>
> **Schema.org** — Le vocabulaire décrit le sens des propriétés ; il ne garantit aucun affichage dans un moteur.
>
> **Éligibilité Google** — Les exigences Google sont supplémentaires et peuvent évoluer. Un balisage valide ne garantit jamais un résultat enrichi.

## Prérequis

- Une URL canonique et un `baseUrl` fiables.
- Des données visibles, actuelles et issues de votre source métier.
- Les builders liés: [`LocalBusiness`](/fr/reference/builders/local-business/), [`PostalAddress`](/fr/reference/builders/postal-address/), [`GeoCoordinates`](/fr/reference/builders/geo-coordinates/).

## Graphe recommandé

1. `LocalBusiness` — nœud principal
2. `PostalAddress`
3. `GeoCoordinates`

## Exemple minimal

```ts
import { LocalBusiness } from '@unschema-graph/core';

const entity = LocalBusiness({
  "name": "Acme Paris",
  "address": {
    "streetAddress": "1 Rue de Rivoli",
    "addressLocality": "Paris",
    "postalCode": "75001",
    "addressCountry": "FR"
  }
});
```

## Exemple de production

Utilisez un nœud par établissement physique. Ajoutez geo uniquement depuis une source fiable et synchronisez les horaires affichés.

```ts
const result = LocalBusiness.safeParse(cmsData);
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

1. **Fusionner plusieurs établissements dans un LocalBusiness.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.
2. **Deviner latitude ou longitude.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.
3. **Publier des horaires périmés ou mal formés.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.

## Validation

1. Exécutez `safeParse()` à la frontière des données.
2. Inspectez le script du HTML construit.
3. Lancez `unschema-graph audit` sur le dossier de sortie.
4. [Schema.org / official documentation](https://schema.org/LocalBusiness).

## Checklist finale

- [ ] Le contenu balisé est visible et actuel.
- [ ] Chaque identité réutilisable possède un `@id` stable.
- [ ] La validation locale et l’audit du build passent.
- [ ] Les limites de garantie sont comprises.

Approfondir: [graphes et références](/fr/guides/graphs-and-references/), [validation](/fr/guides/validation/), [audit CLI](/fr/audit-and-quality/audit-cli/).
