---
title: Guide d'implémentation IA
description: Choix d'environnement, workflow et contraintes faisant autorité pour les agents utilisant unschema-graph.
---

Donnez cette page à un agent de code avant de lui demander d'implémenter des données structurées.
Si le code et la documentation divergent, les types exportés et la validation à l'exécution du
package installé restent l'autorité finale.

## Objectif

Décrire le contenu visible avec le plus petit graphe Schema.org fidèle, le rendre côté serveur ou
au build, puis auditer le HTML produit. Ne jamais inventer de faits pour viser une fonctionnalité
de moteur de recherche.

## Choisir d'abord l'environnement

| Projet | Package | Chemin de rendu |
| --- | --- | --- |
| Astro | `@unschema-graph/astro` | Builders et composant Astro `<Schema />` |
| Svelte 5 / SvelteKit | `@unschema-graph/svelte` | Builders et composant Svelte `<Schema />` |
| Autre framework ou serveur | `@unschema-graph/core` | Builders, `createGraph()` et `serializeJsonLd()` |

Astro convient aux sites de documentation qui utilisent ses intégrations, tandis que Core et
Svelte sont des points d'entrée de premier rang. N'installez jamais un adaptateur de framework dans
un projet sans rapport.

## Workflow obligatoire

1. Inspecter le contenu visible et ne retenir que les entités Schema.org correspondantes.
2. Choisir Core, Astro ou Svelte dans le tableau ci-dessus.
3. Créer les entités avec les builders officiels et donner un `@id` stable aux entités réutilisées.
4. Relier les entités avec une entité ou une chaîne de référence acceptée.
5. Rendre un seul graphe unifié par page avec l'environnement choisi.
6. Compiler le projet, inspecter le script LD+JSON émis, puis exécuter
   `npx @unschema-graph/core audit <dossier-de-sortie>`.
7. Résoudre toutes les erreurs de type, d'exécution, de build et d'audit.

Le pipeline public est : **entrée du builder → entité validée → résolution du graphe →
sérialisation sûre → adaptateur de framework ou intégration HTML**. Consultez le
[pipeline d'architecture](/fr/architecture/pipeline/) si la tâche traverse ces frontières.

## Pattern Astro canonique

```astro
---
import { Article, Organization, Schema } from '@unschema-graph/astro';

const organization = Organization({
  '@id': '#organization',
  name: 'Acme',
  url: 'https://exemple.fr',
});

const article = Article({
  '@id': '#article',
  headline: 'Titre visible de la page',
  image: '/images/article.jpg',
  datePublished: '2026-09-29',
  author: 'Ada Lovelace',
  publisher: '#organization',
});
---

<Schema data={[organization, article]} />
```

Définissez l'option Astro `site` avec l'origine canonique. Les valeurs relatives `@id`, `url` et
`item` sont alors résolues sans modifier les entités sources. Pour un autre environnement, ouvrez
son [démarrage rapide](/fr/getting-started/choose-your-environment/) au lieu d'adapter ce composant
par supposition.

## Contraintes non négociables

- Ne pas écrire le JSON-LD à la main lorsqu'un builder officiel existe.
- Ne pas inventer de propriétés ni masquer une entrée invalide avec `any`.
- Ne pas déclarer d'avis, prix, disponibilité ou relation absents de la page.
- Ne pas dupliquer les entités réutilisées : les identifier et les référencer.
- Ne pas ajouter de directive Astro `client:*` ni déplacer la génération dans le navigateur.
- Ne pas importer `@unschema-graph/core/audit`, réservé à Node, dans du code navigateur.
- Ne jamais promettre qu'un JSON-LD valide garantit classement, éligibilité ou résultat enrichi.

## Validation, CMS et extension contrôlée

Utilisez `Builder.safeParse()` aux frontières de confiance comme les payloads CMS et API. Gardez
les erreurs visibles en production et en CI. Si une propriété Schema.org n'est pas modélisée,
validez d'abord l'entité puis utilisez `withAdditionalProperties()`. Cette fonction ne remplace ni
`@type` ni `@id`. Utilisez `withAdditionalTypes()` pour des types secondaires.

Lisez [sécurité et entrées CMS](/fr/audit-and-quality/security/) avant de traiter des données non
fiables et les [limites connues](/fr/operations/known-limitations/) avant une forme non prise en
charge.

## Règles de graphe et de référence

- Utiliser un fragment comme `#organization` pour une entité propre à la page.
- Utiliser un chemin stable ou une URL absolue pour une entité réutilisée sur le site.
- Une chaîne commençant par `#`, `/`, `http://`, `https://` ou `urn:` devient une référence `@id`
  lorsque la propriété l'accepte.
- Les entités ayant le même `@id` résolu sont fusionnées ; les valeurs les plus tardives gagnent.
- Placer la représentation la plus complète en dernier lors d'un enrichissement volontaire.

## Charger seulement la documentation utile

1. Commencer par le démarrage rapide de l'environnement.
2. Ouvrir la page du builder concerné pour les champs requis et types liés.
3. Ajouter [graphes et références](/fr/guides/graphs-and-references/) pour une page multi-entités.
4. Ajouter [validation](/fr/guides/validation/) pour une source externe.
5. Utiliser la [référence API](/fr/reference/helpers/) pour les helpers avancés.
6. N'utiliser les [schémas personnalisés](/fr/guides/custom-schemas/) que sans builder adapté.

Chaque page possède une route `.md` ciblée. `/llms.txt` est l'index anglais concis et
`/llms-full.txt` le bundle anglais complet. Les pages françaises ont aussi des routes Markdown
ciblées ; consultez [utiliser le Markdown avec un agent](/fr/ai/using-markdown/).

## Checklist de validation

- Le package correspond à l'environnement du projet.
- Les entités reflètent le contenu visible et chaque builder reçoit ses champs requis.
- Les entités réutilisées ont un `@id` stable et la page rend un seul graphe.
- L'URL de base canonique est intentionnelle.
- Le build de production et l'audit réussissent.
- Aucun mode de validation ne masque les erreurs en CI.
- Le comportement d'un moteur est décrit comme une éligibilité, jamais comme une garantie.
