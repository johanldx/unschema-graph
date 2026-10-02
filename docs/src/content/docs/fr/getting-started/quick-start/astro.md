---
title: Votre premier schéma avec Astro
description: Générer un Article JSON-LD validé dans une page Astro en moins de cinq minutes.
---

Ce guide commence avec un seul `Article`. Vous verrez le JSON-LD généré avant
d'apprendre à relier le graphe complet d'une page.

## Avant de commencer

Vous avez besoin de Node.js 22.12 ou plus récent et d'un projet Astro 5, 6 ou 7.

## 1. Installer

Pour une installation et configuration automatiques :

```bash
npx astro add @unschema-graph/astro
```

Ou installez le package manuellement :

```bash
pnpm add @unschema-graph/astro zod
```

Vous utilisez npm, yarn ou bun ? Consultez [toutes les commandes
d'installation](/fr/getting-started/installation/).

Pour une configuration manuelle de l'intégration, enregistrez la racine du package dans `astro.config.mjs` :

```js title="astro.config.mjs"
import { defineConfig } from 'astro/config';
import schemaGraph from '@unschema-graph/astro';

export default defineConfig({
  integrations: [schemaGraph()],
});
```

## 2. Ajouter un Article

Créez ou ouvrez une page Astro, puis placez `<Schema />` dans son `<head>` :

```astro title="src/pages/bonjour.astro"
---
import { Article, Schema } from '@unschema-graph/astro';

const article = Article({
  headline: 'Mon premier JSON-LD typé',
  image: 'https://example.com/cover.jpg',
  datePublished: '2026-09-29',
  author: 'Ada Lovelace',
});
---

<html lang="fr">
  <head>
    <title>{article.headline}</title>
    <Schema item={article} graph={false} />
  </head>
  <body><h1>{article.headline}</h1></body>
</html>
```

Le builder vérifie les champs requis avec Zod. Astro génère le composant côté serveur :
cet exemple n'ajoute donc aucun JavaScript côté client.

## 3. Vérifier la sortie

Ouvrez le code source de la page et recherchez :

```html
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Mon premier JSON-LD typé"}
</script>
```

Le script réel contient aussi l'image, la date de publication et l'auteur. La sortie
raccourcie ci-dessus montre la structure à retrouver.

## 4. Évoluer vers un graphe de page

Un article en production appartient généralement à une `WebPage` et un `WebSite`,
possède une `Organization` éditrice et référence ces entités avec des valeurs `@id`
stables. Passez-les ensemble avec
`items={[organization, website, page, article]}` plutôt que de générer plusieurs scripts.

Si votre composant `<Schema />` se trouve dans un layout partagé, transmettez explicitement
les entités de la page au layout via une prop comme `schemaItems`. Les entités liées depuis
ces entités racines restent découvertes automatiquement. Consultez comment [transmettre les entités d’une page à un layout](/fr/integrations/astro/#transmettre-les-entités-dune-page-à-un-layout).

[Construire ce graphe relié](/fr/guides/mental-model/).

## Étape suivante

Découvrez [le rôle des builders, entités, identités et graphes](/fr/guides/mental-model/),
ou ouvrez la [référence complète de l'intégration Astro](/fr/integrations/astro/).
