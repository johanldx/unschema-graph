---
title: Identités avec @id
description: Donner des identités stables aux entités, résoudre les identifiants relatifs et référencer les nœuds partagés.
---

`@id` représente l'identité d'une entité, pas seulement l'étiquette d'un objet en
mémoire. Une identité stable permet à plusieurs nœuds du graphe de désigner la même
chose réelle.

## Quand ajouter une identité

Ajoutez `@id` lorsqu'une entité est référencée ailleurs, apparaît sur plusieurs pages ou
doit fusionner avec une autre déclaration partielle. Une organisation, un site, un
auteur, un produit ou la page actuelle sont des entités partagées fréquentes.

```ts
const organization = Organization({
  '@id': '#organization',
  name: 'Acme Publishing',
});
```

Une valeur imbriquée et isolée n'a pas toujours besoin d'identité.

## Identifiants relatifs et absolus

Les identités relatives rendent le code portable entre les environnements local, de
préproduction et de production :

| Entrée | Signification avec `baseUrl: 'https://example.com'` |
| --- | --- |
| `#organization` | `https://example.com/#organization` |
| `/a-propos#organization` | `https://example.com/a-propos#organization` |
| `/articles/graphe#article` | `https://example.com/articles/graphe#article` |
| `https://profiles.example/ada` | identité absolue inchangée |
| `urn:isbn:9780000000000` | identité URN inchangée |

Astro utilise la prop du composant, puis le défaut intégration/global, puis `Astro.site`.
Svelte utilise sa prop puis le défaut global. Core utilise uniquement la `baseUrl` explicite
transmise à `buildJsonLdGraph()`.

## Référencer une entité existante

Les chaînes ayant la forme d'un identifiant deviennent des références légères sur les
propriétés acceptant des références d'entités :

```ts
const website = WebSite({
  '@id': '#website',
  name: 'Acme Journal',
  url: 'https://example.com',
  publisher: '#organization',
});
```

Après résolution du graphe, l'éditeur devient `{ "@id": "…/#organization" }`. Les
propriétés de l'organisation restent sur le nœud de l'organisation.

## Choisir des identités durables

- Utilisez l'origine canonique, pas l'URL d'un déploiement de prévisualisation.
- Réutilisez le même fragment pour la même entité partagée sur toutes les pages.
- Placez un chemin avant le fragment pour les nœuds propres à une page.
- Ne réutilisez pas une identité pour deux choses réelles différentes.
- Préférez un fragment descriptif et stable comme `#organization` à un identifiant de
  base de données susceptible de changer.

## Erreurs fréquentes

- Référencer `#person` alors que l'identité déclarée est `/authors/ada#person`.
- Omettre `baseUrl` avec Svelte ou Core et attendre la conversion des identités
  relatives en identités absolues.
- Imbriquer une organisation complète dans chaque article au lieu de référencer un
  nœud partagé.
- Attribuer une nouvelle identité à chaque construction de la même organisation.

Étape suivante : [composer et dédupliquer un graphe complet](/fr/guides/graphs-and-references/).
