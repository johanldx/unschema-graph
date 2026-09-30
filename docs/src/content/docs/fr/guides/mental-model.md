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

La valeur renvoyée par un builder est une entité. Ajoutez `@id` lorsqu'une autre entité
doit la référencer ou qu'elle doit être réutilisée sur plusieurs pages.

```ts
const organization = Organization({
  '@id': '#organization',
  name: 'Acme Publishing',
  url: 'https://example.com',
});

const article = Article({
  headline: 'Des données structurées reliées',
  image: 'https://example.com/cover.jpg',
  datePublished: '2026-09-29',
  author: 'Ada Lovelace',
  publisher: '#organization',
});
```

`publisher: '#organization'` devient une référence `@id` plutôt qu'une deuxième copie
imbriquée de l'organisation.

## Un graphe de page réaliste

Une page peut décrire ensemble le site, l'éditeur, la page et l'article :

```ts
import {
  Article,
  Organization,
  WebPage,
  WebSite,
  buildJsonLdGraph,
} from '@unschema-graph/core';

const organization = Organization({
  '@id': '#organization',
  name: 'Acme Publishing',
  url: 'https://example.com',
});

const website = WebSite({
  '@id': '#website',
  name: 'Acme Journal',
  url: 'https://example.com',
  publisher: '#organization',
});

const page = WebPage({
  '@id': '/articles/graphe#webpage',
  name: 'Des données structurées reliées',
  url: '/articles/graphe',
  isPartOf: '#website',
});

const article = Article({
  '@id': '/articles/graphe#article',
  headline: 'Des données structurées reliées',
  image: 'https://example.com/cover.jpg',
  datePublished: '2026-09-29',
  author: 'Ada Lovelace',
  publisher: '#organization',
  mainEntityOfPage: '/articles/graphe#webpage',
});

const graph = buildJsonLdGraph([organization, website, page, article], {
  baseUrl: 'https://example.com',
});
```

Le graphe contient quatre nœuds. Leurs identités relatives deviennent absolues et les
références pointent vers les nœuds correspondants sans dupliquer leurs propriétés.

## Ce que garantit la bibliothèque

unschema-graph valide les propriétés modélisées par chaque builder, compose le graphe
et sérialise le JSON-LD de façon sûre pour le HTML. Il ne garantit pas qu'un moteur de
recherche affiche un résultat enrichi ni qu'une plateforme utilise une propriété.

Étape suivante : comprendre [la validation des types et propriétés](/fr/guides/entities-types-and-properties/).
