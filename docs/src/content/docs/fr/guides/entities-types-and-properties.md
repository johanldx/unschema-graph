---
title: Entités, types et propriétés
description: Distinguer les types TypeScript, les valeurs @type Schema.org, les schémas Zod et les propriétés des builders.
---

Le mot « type » apparaît à plusieurs niveaux. Les séparer rend les erreurs plus faciles
à comprendre.

## Types TypeScript

TypeScript vérifie le code visible par le compilateur. Il détecte les noms de propriétés
inconnus et les valeurs incompatibles pendant l'édition ou le build.

```ts
Article({
  headline: 'Un article typé',
  datePublised: '2026-09-29', // TypeScript signale la faute
});
```

TypeScript disparaît après la compilation. Il ne peut pas prouver que les données reçues
d'un CMS respectent le type déclaré.

## `@type` dans Schema.org

`@type` indique la nature de l'entité représentée en JSON-LD, par exemple `Article`,
`Person` ou `Organization`. Le builder contrôle cette valeur :

```ts
const article = Article({
  headline: 'Un article typé',
  image: 'https://example.com/cover.jpg',
  datePublished: '2026-09-29',
  author: 'Ada Lovelace',
});

article['@type']; // 'Article'
```

Ne passez pas `@type` à un builder. Choisissez un autre builder ou utilisez
`withAdditionalTypes()` lorsqu'une entité possède légitimement plusieurs types.

## Schémas Zod

Chaque builder enveloppe un schéma Zod strict. Zod s'exécute à l'appel du builder et
peut donc rejeter des données incorrectes issues d'un CMS, d'une API ou du frontmatter.

```ts
const result = Article.safeParse(cmsPayload);

if (!result.success) {
  console.error(result.error.details);
}
```

« Valide » signifie ici valide pour les propriétés modélisées par ce builder. Cela ne
promet pas qu'une plateforme externe affichera l'entité.

## Propriétés requises et facultatives

Chaque référence de builder liste ses entrées requises et facultatives. Par exemple,
`Article` exige `headline`, `image`, `datePublished` et `author` ; `publisher` et
`description` sont facultatifs dans le builder.

Utilisez le [catalogue des builders](/fr/reference/builders/) comme source de vérité au
lieu de deviner les propriétés à partir d'un autre type d'entité.

## Valeurs imbriquées et références

Une propriété peut accepter un raccourci texte, une entité imbriquée, une référence
`@id` ou un tableau. Sa page de référence précise les formes acceptées. Préférez une
référence lorsque plusieurs nœuds partagent la même entité ; imbriquez la valeur
lorsqu'elle appartient uniquement à son parent.

Étape suivante : comprendre [le fonctionnement des identités stables](/fr/guides/identities/).
