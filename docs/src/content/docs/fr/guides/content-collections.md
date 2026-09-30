---
title: Collections de contenu & Content Layer
description: Transformer automatiquement des entrées de contenu Astro en entités validées Article, BlogPosting ou NewsArticle.
---

Lors de la création de sites éditoriaux avec Astro 5+, `@unschema-graph/astro/content` convertit directement vos entrées Markdown, MDX ou CMS en entités Schema.org conformes et validées.

---

## 1. Exemple express

Dans une route dynamique Astro (ex. `src/pages/blog/[slug].astro`) :

```astro title="src/pages/blog/[slug].astro"
---
import { getEntry, render } from 'astro:content';
import { toBlogPosting } from '@unschema-graph/astro/content';
import { Schema } from '@unschema-graph/astro';

const post = await getEntry('blog', Astro.params.slug!);
if (!post) return Astro.redirect('/404');

const { Content } = await render(post);

// Mappe automatiquement les propriétés du frontmatter vers BlogPosting
const schema = toBlogPosting(post, {
  url: Astro.url.href,
  publisher: '#organization',
});
---

<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>{post.data.title}</title>
    <Schema item={schema} />
  </head>
  <body>
    <article>
      <h1>{post.data.title}</h1>
      <Content />
    </article>
  </body>
</html>
```

---

## 2. Correspondance automatique des champs

Les helpers analysent l'objet `data` de votre entrée de collection et font correspondre les champs courants aux spécifications Schema.org :

| Propriété Schema.org | Clés du frontmatter reconnues | Détails de la transformation |
| --- | --- | --- |
| `headline` | `headline`, `title`, `name` | Première chaîne non vide trouvée |
| `image` | `image`, `cover`, `heroImage` | Chaîne URL ou objet image Astro (mappe `.src`) |
| `datePublished` | `datePublished`, `pubDate`, `date`, `publishDate` | Chaîne ISO, objet Date ou timestamp |
| `dateModified` | `dateModified`, `updatedDate`, `modDate`, `lastModified` | Chaîne ISO, objet Date ou timestamp |
| `author` | `author`, `authors` | Chaîne de nom ou objet Person |
| `description` | `description`, `summary`, `excerpt` | Résumé textuel |
| `keywords` | `keywords`, `tags`, `categories` | Tableau de chaînes |
| `wordCount` | `wordCount` | Nombre explicite, ou calculé d'après le `body` markdown |
| `mainEntityOfPage` | Option `url` → frontmatter `url` | URL canonique de la page |

### Fonctions disponibles

- `toArticle(entry, overrides?)` : Génère un `Article` Schema.org général.
- `toBlogPosting(entry, overrides?)` : Génère un `BlogPosting` pour blog.
- `toNewsArticle(entry, overrides?)` : Génère un `NewsArticle` journalistique.

---

## 3. Personnalisation & Surcharges

Vous pouvez transmettre des valeurs explicites dans le deuxième argument. Celles-ci ont priorité sur le frontmatter :

```ts title="src/pages/blog/[slug].astro"
import { Person } from '@unschema-graph/astro';
import { toBlogPosting } from '@unschema-graph/astro/content';

const schema = toBlogPosting(post, {
  url: Astro.url.href,
  headline: 'Titre SEO optimisé (remplace le frontmatter)',
  author: Person({
    name: 'Rédaction technique',
    url: 'https://mon-site.fr/equipe',
  }),
  publisher: '#organization',
  inLanguage: 'fr',
});
```

:::note
Si des champs obligatoires (comme `headline`, `image`, `datePublished` ou `author`) ne peuvent pas être résolus, une exception `SchemaValidationError` est levée. Les helpers n'inventent jamais de fausses données d'attente.
:::
