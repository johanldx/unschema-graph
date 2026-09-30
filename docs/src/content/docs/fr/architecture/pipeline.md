---
title: Architecture et pipeline de données
description: Contrats publics et modèle d’implémentation des données source au script JSON-LD sûr pour le HTML.
---

Cette page décrit les modules et seams d’unschema-graph. Les éléments marqués **contrat
public** sont utilisables dans la ligne pré-1.0 actuelle. Les notes d’implémentation
expliquent le fonctionnement présent sans constituer une API stable.

## Vue d’ensemble du pipeline

```text
données source
    │ mapping explicite
    ▼
SchemaBuilder ── analyse Zod ──► entité typée
    │                                │
    └──── erreur structurée          ▼
                           buildJsonLdGraph
                             │ résolution des identités
                             │ aplatissement et fusion
                             ▼
                         charge du graphe
                             │ serializeJsonLd
                             ▼
                    chaîne JSON sûre en HTML
                             │ adaptateur Astro/Svelte
                             ▼
               <script type="application/ld+json">
```

Équivalent textuel : les données sont mappées vers un builder, validées en entité
typée, composées en graphe, sérialisées avec échappement HTML puis placées dans le
script par l’adaptateur de rendu.

## Interface du builder

`defineSchema(type, schema, defaults?)` retourne un `SchemaBuilder` callable. Ce module
est profond : une petite interface masque parsing strict, injection des métadonnées et
normalisation des erreurs.

| Membre | Contrat public |
| --- | --- |
| `builder(input, options?)` | Valide, possède `@type`, accepte `@id` et retourne une entité ou `null` selon `onError`. |
| `builder.safeParse(unknown)` | Retourne `{ success: true, data }` ou `{ success: false, error }` sans lever d’exception. |
| `builder.schema` | Expose le schéma Zod pour composition et introspection. |
| `builder.entityType` | Expose le type Schema.org principal. |

`SchemaInput<typeof schema>` retire `@type` des entrées et ajoute `@id` facultatif.
`SchemaOutput<typeof schema, 'Type'>` décrit la sortie analysée et son type garanti.

```ts
import { defineSchema, type SchemaInput, type SchemaOutput } from '@unschema-graph/core';
import { z } from 'zod';

const BookSchema = z.object({ name: z.string().min(1), isbn: z.string().optional() });
const Book = defineSchema('Book', BookSchema);

type BookInput = SchemaInput<typeof BookSchema>;
type BookOutput = SchemaOutput<typeof BookSchema, 'Book'>;
```

Utilisez `withAdditionalProperties()` après validation pour une vraie propriété
Schema.org non modélisée ; cette extension ne peut remplacer `@id` ou `@type`.
`withAdditionalTypes()` conserve le type principal et ajoute des types secondaires.

## Validation et erreurs

`throw` lève `SchemaValidationError`, `warn` journalise puis retourne `null`, `silent`
retourne `null`. L’erreur expose le `code` stable `SCHEMA_VALIDATION_ERROR`,
`entityType`, les `issues` Zod, les `details` normalisés et `formattedMessage`.

## Composition du graphe et identité

`buildJsonLdGraph(items, options?)` accepte entité, tableaux imbriqués et valeurs
nulles. Son contrat est de retourner une nouvelle charge, résoudre les identifiants via
`baseUrl`, fusionner les nœuds ayant le même `@id` résolu et produire `@graph` par
défaut. Les entrées ne sont jamais mutées.

```text
[stub #org] ─┐
             ├─ même @id résolu ─► fusion ─► un seul nœud #org
[#org riche] ─┘
```

L’ordre de parcours et les helpers internes sont des détails d’implémentation. Ne
dépendez que des garanties d’identité, de résultat et de non-mutation.

## Dates et durées

`parseDate()` accepte `Date`, timestamps, ISO et formes relatives documentées.
`formatIsoDate()` normalise en ISO. `formatIsoDuration()` traite ISO, texte humain et
objets durée ; `parseDurationToMs()`, `addDuration()` et `diffDuration()` calculent les
durées. Fournissez une date de référence pour tester `today` de façon déterministe.

## Sérialisation et modèle de menace

`serializeJsonLd()` sérialise puis échappe `<`, `>` et `&` en Unicode, empêchant une
valeur `</script>` de fermer le script JSON-LD. Ce n’est ni un assainisseur HTML ni une
garantie sémantique. Validez à l’entrée, ne concaténez pas de fragments et placez la
chaîne uniquement dans un script `application/ld+json`.

## Contrat stable et explication

Exports publics, entrées documentées, retours, formes d’erreurs et non-mutation forment
l’interface. Arborescence, helpers, passes de parcours, stratégie de fusion et détails
des adaptateurs peuvent évoluer. Les tests doivent franchir le même seam public que le
code applicatif.

Suite : [référence Core](/fr/integrations/core/), [helpers et types](/fr/reference/helpers/),
[validation](/fr/guides/validation/) et [sécurité](/fr/audit-and-quality/security/).
