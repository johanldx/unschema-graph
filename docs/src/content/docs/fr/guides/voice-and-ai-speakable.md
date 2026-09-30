---
title: Speakable et SearchAction
description: Générer les structures Schema.org SpeakableSpecification et SearchAction et comprendre leur prise en charge actuelle.
---

`unschema-graph` fournit des helpers pour les types Schema.org `SpeakableSpecification` et `SearchAction`. Ces helpers valident et normalisent le balisage ; ils ne garantissent pas son utilisation par un moteur de recherche, un assistant ou un système d'IA.

---

## 1. Propriété Speakable

La propriété `speakable` indique les sections d'une page adaptées à la synthèse vocale. La fonctionnalité correspondante de Google reste une bêta limitée, avec ses propres critères d'éligibilité et de disponibilité, sans garantie d'affichage. Consultez la [documentation Google Search à jour](https://developers.google.com/search/docs/appearance/structured-data/speakable?hl=fr) avant d'en dépendre.

`unschema-graph` accepte des sélecteurs CSS directs qui sont automatiquement convertis en structures `SpeakableSpecification` valides.

### Sélecteur CSS unique

```ts
import { Article } from '@unschema-graph/core';

const article = Article({
  headline: 'Tendances Web en 2026',
  image: 'https://mon-site.fr/cover.jpg',
  datePublished: 'today',
  author: 'Ada Lovelace',
  // Chaîne unique de sélecteur CSS
  speakable: '.resume-intro',
});
```

Sortie JSON-LD générée :
```json
{
  "@type": "Article",
  "headline": "Tendances Web en 2026",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".resume-intro"]
  }
}
```

### Plusieurs sélecteurs CSS

Passez un tableau de sélecteurs ciblant les paragraphes audios essentiels :

```ts
const article = Article({
  headline: 'Tendances Web en 2026',
  image: 'https://mon-site.fr/cover.jpg',
  datePublished: 'today',
  author: 'Ada Lovelace',
  speakable: ['h1.titre', '.chapo-lead', '#points-cles'],
});
```

### Sélecteurs XPath avancés

Vous pouvez également passer un objet complet avec des expressions `xpath` :

```ts
const article = Article({
  headline: 'Tendances Web en 2026',
  image: 'https://mon-site.fr/cover.jpg',
  datePublished: 'today',
  author: 'Ada Lovelace',
  speakable: {
    '@type': 'SpeakableSpecification',
    xpath: ['/html/head/title', '/html/body/main/article/p[1]'],
  },
});
```

---

## 2. `SearchAction` dans Schema.org

`SearchAction` décrit une opération de recherche dans Schema.org. Google a supprimé le champ de recherche Sitelinks de ses résultats en novembre 2024 : ce balisage ne doit donc pas être présenté comme un moyen d'activer cette fonctionnalité. Consultez [l'annonce de dépréciation de Google](https://developers.google.com/search/blog/2024/10/sitelinks-search-box?hl=fr).

`unschema-graph` simplifie cela grâce à la propriété raccourcie `searchUrl` ou au helper `createSearchAction` :

### Configuration automatique via `WebSite`

```ts
import { WebSite } from '@unschema-graph/core';

const site = WebSite({
  '@id': '#website',
  name: 'Rootage Media',
  url: 'https://mon-site.fr',
  // Raccourci avec variable de template :
  searchUrl: 'https://mon-site.fr/recherche?q={search_term_string}',
});
```

Sortie JSON-LD générée :
```json
{
  "@type": "WebSite",
  "@id": "https://mon-site.fr/#website",
  "name": "Rootage Media",
  "url": "https://mon-site.fr",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://mon-site.fr/recherche?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### Helper programmatique `createSearchAction`

Vous pouvez aussi instancier une action de recherche personnalisée indépendamment :

```ts
import { createSearchAction } from '@unschema-graph/core';

const action = createSearchAction({
  urlTemplate: 'https://mon-site.fr/recherche?terme={q}',
  queryInput: 'required name=q',
});
```
