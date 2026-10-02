---
title: Migration vers la v1
description: Guide de mise à niveau, évolutions architecturales et patterns de migration pour unschema-graph 1.0.
---

`unschema-graph` 1.0 stabilise l'API publique, introduit les références relationnelles d'entités objets, applique une validation stricte Schema.org avec Zod et apporte une découverte déterministe du graphe.

> **Version 0.10.0 — Gel de l'API publique**
> La version **0.10.0** fige le contrat d'API publique pour Core, Astro et Svelte avant `1.0.0-rc.1`. Si vous effectuez une mise à niveau depuis `0.9.x` ou des versions antérieures, ce guide détaille ce nettoyage et les évolutions architecturales.

---

## 0.9.x → 0.10.0 — Nettoyage de l'API publique

La version `0.10.0` retire intentionnellement les exports racine accidentels et les primitives internes avant `1.0.0-rc.1`.

### 1. `createEntityRef` supprimé au profit de `entityRef`

L'alias déprécié `createEntityRef` a été supprimé. Utilisez `entityRef` à la place :

```ts
// Avant (déprécié) :
import { createEntityRef } from '@unschema-graph/core';

// En 0.10.0+ :
import { entityRef } from '@unschema-graph/core';
```

### 2. Helpers internes retirés des exports racine

Les primitives d'implémentation de bas niveau ont été retirées des barils racine pour protéger les évolutions internes :

- `resolveId` et `resolveEntityIds` : passez `baseUrl` à `buildJsonLdGraph(entities, { baseUrl })` au lieu de résoudre manuellement les identifiants.
- `EntityIdSchema`, `isIdReference`, `IdObjectSchema`, `TypedEntitySchema` et `EntityReferenceSchema` : utilisez la validation des builders, `entityRef()` ou `withAdditionalProperties()` plutôt que de valider directement des chaînes d'ID ou des formats de référence.
- `normalizeZodIssues` et `formatZodError` : les erreurs de validation sont automatiquement formatées par `SchemaValidationError` levée par les builders et `validateSchema()`.
- Schémas internes communs (`WebUrlSchema`, `RelativeOrAbsoluteUrlSchema`, `SearchActionSchema`, `SpeakableSchema`, `ImageUrlOrObject`, `IsoDateSchema`, `IsoDurationSchema`) : utilisez les builders de haut niveau (`SearchAction()`, `ImageObject()`) ou les helpers temporels (`formatIsoDate()`, `formatIsoDuration()`).

---

## Nouveautés et évolutions majeures en v1

### 1. Références relationnelles d'entités objets

Dans les versions pré-1.0 ou lors d'écritures manuelles, relier des entités imposait de synchroniser manuellement des identifiants textuels (ex. `publisher: '#organization'`).
En v1, vous pouvez passer directement les objets entités retournés par les builders :

```ts
// Avant : uniquement des chaînes d'identification
const article = Article({
  headline: 'Bonjour le monde',
  publisher: '#organization',
});

// En v1 : référence d'entité objet strictement typée
const organization = Organization({
  '@id': '#organization',
  name: 'Acme',
  url: 'https://mon-site.fr',
});

const article = Article({
  headline: 'Bonjour le monde',
  publisher: organization, // Typé et vérifié par TypeScript
});
```

#### Références textuelles explicites

Une chaîne devient une référence `@id` uniquement lorsqu’elle ressemble explicitement à un
identifiant : fragment (`#person`), chemin (`/personnes/ada#person`, `./page`, `../page`) ou URI
absolue. Les noms simples sont développés uniquement par les relations qui définissent un type
de fallback, comme `Article.author`. Les relations génériques sans fallback rejettent les noms
simples :

```ts
ProfilePage({ mainEntity: '#person' }); // Référence explicite valide
ProfilePage({ mainEntity: Person({ name: 'Ada Lovelace' }) }); // Entité directe valide
ProfilePage({ mainEntity: 'Ada Lovelace' }); // Erreur de validation
```

### 2. Découverte automatique du graphe

Vous n'avez plus besoin d'assembler manuellement toutes les entités reliées dans un tableau. Passer une entité racine explore récursivement toutes les entités référencées dotées d'un `@id` :

```ts
// En v1 : passer l'entité racine découvre automatiquement le site et l'organisation
const graph = buildJsonLdGraph(webpage, {
  baseUrl: 'https://mon-site.fr',
});
```

### 3. Typage strict Schema.org et propriétés additionnelles

Les schémas intégrés constituent un sous-ensemble sélectionné, modélisé sur la baseline du vocabulaire Schema.org 30.1. Ils rejettent les propriétés absentes du schéma de bibliothèque concerné, sans prétendre couvrir tout Schema.org.

Si votre CMS ou API requiert des propriétés personnalisées :
- Utilisez `withAdditionalProperties` :
  ```ts
  import { Article, withAdditionalProperties } from '@unschema-graph/core';

  const article = Article({ headline: 'Bonjour le monde' });
  const articlePersonnalise = withAdditionalProperties(article, { customField: 'value' });
  ```
- Ou définissez un nouveau type avec `defineSchema`.

### 3.1. Corrections de vocabulaire Schema.org 30.1

Le contrat 0.9 remplace la propriété supplantée `Restaurant.menu` par `hasMenu` :

```ts
const restaurant = Restaurant({
  name: 'Chez Pierre',
  address: '15 Boulevard Saint-Germain, Paris',
  hasMenu: '/menu',
});
```

`servesCuisine` et `hasMenu` sont acceptés par `Restaurant`, mais pas par les builders
génériques `LocalBusiness`, `Store` ou d’hébergement. `FAQPage.questions` et
`WebSite.searchUrl` restent des facilités d’entrée documentées : elles produisent
respectivement le vocabulaire courant `mainEntity` et `potentialAction`.

### 4. Diagnostics de graphe structurés (`onDiagnostic`)

Au lieu d'erreurs silencieuses ou de fusions inattendues, la construction du graphe accepte un callback optionnel `onDiagnostic` pour inspecter les événements `broken-reference` et `duplicate-conflict` :

```ts
const graph = buildJsonLdGraph(webpage, {
  baseUrl: 'https://mon-site.fr',
  onDiagnostic(diagnostic) {
    console.warn(`[${diagnostic.code}] ${diagnostic.message}`);
  },
});
```

### 5. CLI d'audit en intégration continue (CI)

Le CLI d'audit est stabilisé pour une utilisation en CI avec le mode strict :
```bash
npx @unschema-graph/core audit dist --strict
```
Il renvoie le code de sortie `0` en cas de succès et `1` si des références orphelines ou des blocs JSON-LD malformés sont détectés.

---

## Checklist de migration pas-à-pas

1. **Mettez à jour les paquets ensemble :** Passez `@unschema-graph/core`, `@unschema-graph/astro` et `@unschema-graph/svelte` en `^1.0.0`.
2. **Vérifiez les appels aux builders :** Assurez-vous que les champs obligatoires sont bien renseignés d'après la documentation des builders Schema.org.
3. **Adoptez les références d'objets :** Remplacez les chaînes d'identification par des références d'entités objets directes lorsque c'est pertinent.
4. **Configurez `baseUrl` :** Assurez-vous que `baseUrl` (ou `site` dans `astro.config.mjs`) est configuré pour résoudre les fragments en URLs canoniques absolues.
5. **Lancez le typecheck et l'audit :** Exécutez `pnpm run typecheck` et `npx @unschema-graph/core audit dist --strict` pour vérifier la résolution propre du graphe.
