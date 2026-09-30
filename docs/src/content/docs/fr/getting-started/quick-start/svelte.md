---
title: Votre premier schéma avec Svelte
description: Générer un Article JSON-LD réactif et validé avec Svelte 5 ou SvelteKit.
---

Ce guide utilise les runes de Svelte 5 pour synchroniser un `Article` avec l'état de la
page.

## Avant de commencer

Vous avez besoin de Node.js 22.12 ou plus récent et d'un projet Svelte 5 ou SvelteKit 2.

## 1. Installer

```bash
pnpm add @unschema-graph/svelte zod
```

Vous utilisez npm, yarn ou bun ? Consultez [toutes les commandes
d'installation](/fr/getting-started/installation/).

## 2. Ajouter un Article réactif

```svelte title="src/routes/bonjour/+page.svelte"
<script lang="ts">
  import { Article, Schema } from '@unschema-graph/svelte';

  let headline = $state('Mon premier JSON-LD réactif');
  const article = $derived(
    Article({
      headline,
      image: 'https://example.com/cover.jpg',
      datePublished: '2026-09-29',
      author: 'Ada Lovelace',
    })
  );
</script>

<Schema item={article} graph={false} baseUrl="https://example.com" inLanguage="fr" />
<h1>{headline}</h1>
```

`<Schema />` écrit dans `<svelte:head>`. Quand `headline` change, l'entité dérivée et le
JSON-LD généré évoluent avec lui.

## 3. Vérifier la sortie

Inspectez le code source généré côté serveur et recherchez :

```html
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Mon premier JSON-LD réactif"}
</script>
```

Le script réel contient toutes les propriétés transmises au builder.

## 4. Évoluer vers un graphe de page

Ajoutez des entités `Organization`, `WebSite` et `WebPage` avec des valeurs `@id`
stables. Passez ensuite l'ensemble avec
`items={[organization, website, page, article]}` et gardez `baseUrl` explicite pour que
Svelte puisse résoudre les identités relatives.

[Construire ce graphe relié](/fr/guides/mental-model/).

## Étape suivante

Découvrez [le rôle des builders, entités, identités et graphes](/fr/guides/mental-model/),
ou ouvrez la [référence complète de l'intégration Svelte](/fr/integrations/svelte/).
