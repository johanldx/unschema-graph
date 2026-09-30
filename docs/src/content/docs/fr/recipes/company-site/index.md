---
title: Site d’entreprise
description: Décrire une organisation une fois puis la référencer depuis le site et ses pages.
---

## Objectif

Décrire une organisation une fois puis la référencer depuis le site et ses pages.

> **Validation locale** — Les builders rejettent les propriétés inconnues et exposent `safeParse()` pour les données externes.
>
> **Schema.org** — Le vocabulaire décrit le sens des propriétés ; il ne garantit aucun affichage dans un moteur.
>
> **Éligibilité Google** — Les exigences Google sont supplémentaires et peuvent évoluer. Un balisage valide ne garantit jamais un résultat enrichi.

## Prérequis

- Une URL canonique et un `baseUrl` fiables.
- Des données visibles, actuelles et issues de votre source métier.
- Les builders liés: [`Organization`](/fr/reference/builders/organization/), [`WebSite`](/fr/reference/builders/web-site/), [`WebPage`](/fr/reference/builders/web-page/).

## Graphe recommandé

1. `Organization` — nœud principal
2. `WebSite`
3. `WebPage`

## Exemple minimal

```ts
import { Organization } from '@unschema-graph/core';

const entity = Organization({
  "name": "Acme",
  "url": "https://example.com"
});
```

## Exemple de production

Placez les nœuds Organization et WebSite canoniques dans le layout global ; ajoutez un WebPage distinct pour chaque URL canonique.

```ts
const result = Organization.safeParse(cmsData);
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

1. **Changer l’@id de l’organisation selon la page.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.
2. **Utiliser des identifiants relatifs sans baseUrl.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.
3. **Recréer un nœud Organization complet sur chaque page.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.

## Validation

1. Exécutez `safeParse()` à la frontière des données.
2. Inspectez le script du HTML construit.
3. Lancez `unschema-graph audit` sur le dossier de sortie.
4. [Schema.org / official documentation](https://schema.org/Organization).

## Checklist finale

- [ ] Le contenu balisé est visible et actuel.
- [ ] Chaque identité réutilisable possède un `@id` stable.
- [ ] La validation locale et l’audit du build passent.
- [ ] Les limites de garantie sont comprises.

Approfondir: [graphes et références](/fr/guides/graphs-and-references/), [validation](/fr/guides/validation/), [audit CLI](/fr/audit-and-quality/audit-cli/).
