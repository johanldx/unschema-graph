---
title: Modèle mental
description: Comprendre comment les données deviennent des entités Schema.org validées, un graphe relié et du JSON-LD sûr.
---

unschema-graph repose sur quatre concepts : un **builder** valide une entrée, une
**entité** décrit une chose, une **identité** permet aux autres entités de pointer vers
elle et un **graphe** réunit les entités reliées dans un même document JSON-LD.

## Des données au HTML

```text
données de page ou de CMS
      ↓
Article({ ... })          le builder valide l'entrée
      ↓
{ "@type": "Article" }   l'entité possède un type Schema.org
      ↓
buildJsonLdGraph(items)   les identités sont résolues et les doublons fusionnés
      ↓
serializeJsonLd(payload)  les caractères HTML sensibles sont échappés
      ↓
<script type="application/ld+json">
```

Astro et Svelte exécutent les deux dernières étapes dans `<Schema />`. Core expose ces
mêmes étapes directement.

## Builder

Un builder est un validateur typé et appelable, comme `Article`, `Organization` ou
`Product`. Il contrôle le `@type` final ; vous fournissez les propriétés de ce type.

```ts
import { Article } from '@unschema-graph/core';

const article = Article({
  headline: 'Des données structurées reliées',
  image: 'https://example.com/cover.jpg',
  datePublished: '2026-09-29',
  author: 'Ada Lovelace',
});
```

TypeScript vérifie le code écrit. Zod valide les données lorsque le builder s'exécute,
y compris celles chargées depuis un CMS ou une API.

## Entité et identité

La valeur renvoyée par un builder est une entité. Une entité s'utilise de trois façons :

1. **Nœud racine du graphe :** Ajoutez un `@id` lorsque l'entité représente une identité autonome (comme une `Organization`, `WebSite`, `WebPage`, `Article` ou `Person`).
2. **Référence d'entité objet :** Passez directement une entité issue d'un builder à une propriété relationnelle (comme `publisher: organization` ou `isPartOf: website`). TypeScript garantit la validité des propriétés et le collecteur extrait automatiquement l'entité dans le `@graph` tout en remplaçant la référence imbriquée par un pointeur `{ "@id": "..." }`.
3. **Value object inline :** Les entités sans `@id` (telles que `PostalAddress`, `GeoCoordinates`, `ContactPoint` ou `AggregateRating`) restent imbriquées en ligne dans leur entité parente, car elles ne possèdent pas d'identité indépendante.

Vous pouvez également employer des raccourcis textuels comme `publisher: '#organization'` ou `{ "@id": "#organization" }`, mais passer des objets typés offre la sûreté du typage TypeScript et la découverte automatique du graphe.

## Le pattern recommandé : Découverte automatique du graphe

Plutôt que d'assembler manuellement un tableau de toutes les entités de la page, reliez vos entités avec des références d'objets et passez uniquement l'entité racine à `buildJsonLdGraph` :

```ts
import {
  Organization,
  WebPage,
  WebSite,
  buildJsonLdGraph,
} from '@unschema-graph/core';

const organization = Organization({
  '@id': '#organization',
  name: 'Acme',
  url: 'https://example.com',
});

const website = WebSite({
  '@id': '#website',
  name: 'Acme',
  url: 'https://example.com',
  publisher: organization,
});

const webpage = WebPage({
  '@id': '#webpage',
  name: 'Home',
  isPartOf: website,
});

const graph = buildJsonLdGraph(webpage, {
  baseUrl: 'https://example.com',
});
```

En recevant seulement `webpage`, le moteur parcourt récursivement `isPartOf` et `publisher`, découvrant ainsi `website` et `organization`. La sortie produite est un tableau `@graph` plat, unifié, avec des identifiants canoniques :

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      "name": "Acme",
      "url": "https://example.com"
    },
    {
      "@type": "WebSite",
      "@id": "https://example.com/#website",
      "name": "Acme",
      "url": "https://example.com",
      "publisher": {
        "@id": "https://example.com/#organization"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://example.com/#webpage",
      "name": "Home",
      "isPartOf": {
        "@id": "https://example.com/#website"
      }
    }
  ]
}
```

## Intégrations aux frameworks

Lors de la compilation statique (SSG) ou du rendu serveur (SSR), le composant `<Schema />` exécute ce pipeline, injectant la balise sécurisée `<script type="application/ld+json">` directement dans le `<head>` (avec **0 kB** de JavaScript côté client sous Astro) :

```astro title="src/pages/index.astro"
---
import { Schema } from '@unschema-graph/astro';
import { webpage } from '../lib/schema';
---
<head>
  <Schema items={webpage} />
</head>
```

## Ce que garantit la bibliothèque

unschema-graph valide les propriétés modélisées par chaque builder, compose le graphe
et sérialise le JSON-LD de façon sûre pour le HTML. Il ne garantit pas qu'un moteur de
recherche affiche un résultat enrichi ni qu'une plateforme utilise une propriété.

Étape suivante : comprendre [la validation des types et propriétés](/fr/guides/entities-types-and-properties/) et le fonctionnement des [graphes et références](/fr/guides/graphs-and-references/).
