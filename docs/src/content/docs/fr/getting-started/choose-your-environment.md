---
title: Choisir son environnement
description: Choisir le package unschema-graph adapté à Astro, Svelte 5 ou à un projet TypeScript sans framework imposé.
---

Les trois packages utilisent les mêmes builders et produisent le même JSON-LD.
Choisissez le package responsable du rendu HTML ; vous pourrez ensuite déplacer la
construction des entités dans le Core sans la réécrire.

## Choisir Astro

Utilisez `@unschema-graph/astro` pour un site Astro. Il contient :

- le composant `<Schema />` ;
- l'intégration `schemaGraph()` et la barre d'outils de développement ;
- les helpers pour Content Collections ;
- tous les builders et utilitaires du Core.

Choisissez Astro lorsque l'intégration doit récupérer la langue et
l'URL canonique depuis Astro lui-même.

[Construire votre premier schéma avec Astro](/fr/getting-started/quick-start/astro/)

## Choisir Svelte

Utilisez `@unschema-graph/svelte` pour Svelte 5 ou SvelteKit. Il contient un composant
`<Schema />` réactif qui utilise `<svelte:head>` et réexporte toute l'API du Core.

[Construire votre premier schéma avec Svelte](/fr/getting-started/quick-start/svelte/)

## Choisir Core

Utilisez `@unschema-graph/core` pour Node.js, les scripts, les moteurs de rendu
personnalisés ou les frameworks sans adaptateur dédié. Core construit, valide, relie et
sérialise les entités ; votre application choisit où insérer le script produit.

[Construire votre premier schéma avec Core](/fr/getting-started/quick-start/core/)

## En cas de doute

Choisissez l'adaptateur de votre framework lorsqu'il existe. Choisissez Core lorsque
vous voulez contrôler entièrement le rendu ou partager la construction des schémas dans
du code indépendant du framework.

Étape suivante : [installer le package choisi](/fr/getting-started/installation/).
