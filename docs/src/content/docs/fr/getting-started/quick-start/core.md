---
title: Votre premier schéma avec Core
description: Construire, valider et sérialiser un Article avec du TypeScript indépendant du framework.
---

Core produit la charge JSON-LD. Votre application reste responsable de son insertion
dans le document HTML final.

## Avant de commencer

Vous avez besoin de Node.js 22.12 ou plus récent et d'un projet TypeScript.

## 1. Installer

```bash
pnpm add @unschema-graph/core zod
```

Vous utilisez npm, yarn ou bun ? Consultez [toutes les commandes
d'installation](/fr/getting-started/installation/).

## 2. Construire et sérialiser un Article

```ts title="src/schema.ts"
import { Article, buildJsonLdGraph, serializeJsonLd } from '@unschema-graph/core';

const article = Article({
  headline: 'Mon premier JSON-LD sans framework imposé',
  image: 'https://example.com/cover.jpg',
  datePublished: '2026-09-29',
  author: 'Ada Lovelace',
});

const payload = buildJsonLdGraph([article], { graph: false });
const jsonLd = serializeJsonLd(payload, { pretty: true });
```

`Article()` valide l'entrée. `buildJsonLdGraph()` ajoute le contexte Schema.org et
`serializeJsonLd()` échappe les caractères capables de fermer une balise script HTML.

## 3. Vérifier la sortie

`jsonLd` contient :

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Mon premier JSON-LD sans framework imposé"
}
```

La charge réelle contient aussi l'image, la date de publication et l'auteur. Insérez la
chaîne sérialisée comme contenu textuel d'une balise
`<script type="application/ld+json">` avec l'API de rendu serveur de votre framework.

## 4. Évoluer vers un graphe de page

Construisez `Organization`, `WebSite` et `WebPage` avec l'article, attribuez des valeurs
`@id` stables aux nœuds partagés, puis appelez
`buildJsonLdGraph(items, { baseUrl })` avec le tableau complet.

[Construire ce graphe relié](/fr/guides/mental-model/).

## Étape suivante

Découvrez [le rôle des builders, entités, identités et graphes](/fr/guides/mental-model/),
ou ouvrez la [référence complète du Core](/fr/integrations/core/).
