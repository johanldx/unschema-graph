---
title: Organization builder
description: Référence du builder Organization pour créer une entité Schema.org Organization validée.
---

Le builder `Organization` crée une entité `Organization`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { Organization } from '@unschema-graph/astro';

// Svelte 5
import { Organization } from '@unschema-graph/svelte';

// Core / Node.js
import { Organization } from '@unschema-graph/core';
import { OrganizationSchema } from '@unschema-graph/core';
```

Le schéma Zod `OrganizationSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  OrganizationSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type OrganizationInput = SchemaInput<typeof OrganizationSchema>;
type OrganizationOutput = SchemaOutput<typeof OrganizationSchema, 'Organization'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | — |
| `name` | string | Oui | non-empty |
| `legalName` | string | Non | — |
| `url` | string | Non | non-empty |
| `logo` | string \| [ImageObject](/fr/reference/builders/image-object/) | Non | non-empty |
| `image` | string \| [ImageObject](/fr/reference/builders/image-object/) | Non | non-empty |
| `description` | string | Non | — |
| `sameAs` | string \| Array<string> | Non | non-empty |
| `address` | string \| [PostalAddress](/fr/reference/builders/postal-address/) \| EntityReference \| string \| [PostalAddress](/fr/reference/builders/postal-address/) \| EntityReference | Non | non-empty |
| `contactPoint` | [ContactPoint](/fr/reference/builders/contact-point/) \| Array<[ContactPoint](/fr/reference/builders/contact-point/)> | Non | — |
| `email` | string | Non | format: email |
| `telephone` | string | Non | — |
| `foundingDate` | string \| number \| Date | Non | non-empty |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `Organization`.

## Exemple minimal

```ts
import { Organization } from '@unschema-graph/core';

const entity = Organization({
  "name": "Acme",
  "url": "https://example.com"
});
```

## Sortie

```json
{
  "@type": "Organization",
  "name": "Acme",
  "url": "https://example.com"
}
```

## Relations et recettes

- Builders liés : [`Person`](/fr/reference/builders/person/), [`LocalBusiness`](/fr/reference/builders/local-business/), [`Restaurant`](/fr/reference/builders/restaurant/), [`Store`](/fr/reference/builders/store/)
- Utilisé par : [Blog et média](/fr/recipes/blog-media/), [Site d’entreprise](/fr/recipes/company-site/), [SvelteKit et SSR](/fr/recipes/sveltekit-ssr/), [Core dans tout framework](/fr/recipes/core-frameworks/)
- Sources externes : [Schema.org Organization](https://schema.org/Organization)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `Organization.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
