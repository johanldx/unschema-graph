---
title: Content Collections & Content Layer
description: Automatically transform Astro content collection entries into validated Article, BlogPosting, or NewsArticle schemas.
---

When building content-heavy sites with Astro 5+, `@unschema-graph/astro/content` bridges your Markdown, MDX, or CMS content entries directly to validated Schema.org entities.

---

## 1. Quick Example

In an Astro dynamic route (e.g. `src/pages/blog/[slug].astro`):

```astro title="src/pages/blog/[slug].astro"
---
import { getEntry, render } from 'astro:content';
import { toBlogPosting } from '@unschema-graph/astro/content';
import { Schema } from '@unschema-graph/astro';

const post = await getEntry('blog', Astro.params.slug!);
if (!post) return Astro.redirect('/404');

const { Content } = await render(post);

// Automatically maps frontmatter properties to BlogPosting
const schema = toBlogPosting(post, {
  url: Astro.url.href,
  publisher: '#organization',
});
---

<!doctype html>
<html lang="en">
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

## 2. Automatic Field Mapping

The content helpers inspect your entry's `data` object and automatically map common frontmatter keys to Schema.org standards:

| Schema.org Property | Recognized Frontmatter Keys | Transformation Details |
| --- | --- | --- |
| `headline` | `headline`, `title`, `name` | Uses first available non-empty string |
| `image` | `image`, `cover`, `heroImage` | Strings or Astro Image objects (maps `.src`) |
| `datePublished` | `datePublished`, `pubDate`, `date`, `publishDate` | ISO 8601 string, Date object, or timestamp |
| `dateModified` | `dateModified`, `updatedDate`, `modDate`, `lastModified` | ISO 8601 string, Date object, or timestamp |
| `author` | `author`, `authors` | Name string or Person object |
| `description` | `description`, `summary`, `excerpt` | Extracted text summary |
| `keywords` | `keywords`, `tags`, `categories` | String array |
| `wordCount` | `wordCount` | Explicit number, or calculated from markdown `body` |
| `mainEntityOfPage` | Option `url` → frontmatter `url` | Canonical URL of the post |

### Available Helper Functions

- `toArticle(entry, overrides?)`: Builds a generic Schema.org `Article`.
- `toBlogPosting(entry, overrides?)`: Builds an editorial `BlogPosting`.
- `toNewsArticle(entry, overrides?)`: Builds a journalistic `NewsArticle`.

---

## 3. Customizing & Overriding Fields

You can supply explicit overrides as the second parameter. Overrides take precedence over frontmatter values:

```ts title="src/pages/blog/[slug].astro"
import { Person } from '@unschema-graph/astro';
import { toBlogPosting } from '@unschema-graph/astro/content';

const schema = toBlogPosting(post, {
  url: Astro.url.href,
  headline: 'Custom SEO Headline (Overrides Frontmatter)',
  author: Person({
    name: 'Editorial Board',
    url: 'https://example.com/editorial-team',
  }),
  publisher: '#organization',
  inLanguage: 'en',
});
```

:::note
If required fields (such as `headline`, `image`, `datePublished`, or `author`) cannot be resolved from the frontmatter or overrides, a standard `SchemaValidationError` is raised. The helpers do not invent fake placeholders.
:::
