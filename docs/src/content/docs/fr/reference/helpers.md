---
title: Helpers et types
description: Référence des helpers de graphe, validation, temps, sérialisation, contenu et extension.
---

## Création et extension des builders

| Export | Rôle |
| --- | --- |
| `defineSchema(type, schema, defaults?)` | Crée un builder strict et appelable depuis un schéma Zod. |
| `withAdditionalProperties(entity, properties)` | Ajoute des propriétés choisies après validation, sans remplacer `@type` ou `@id`. |
| `withAdditionalTypes(entity, types)` | Ajoute des types Schema.org secondaires en conservant le type principal. |
| `SchemaBuilder` | Interface appelable avec `.schema`, `.entityType` et `.safeParse()`. |
| `SchemaInput`, `SchemaOutput` | Infère les entrées et sorties depuis un schéma Zod. |

## Composition du graphe

| Export | Rôle |
| --- | --- |
| `buildJsonLdGraph(items, options?)` | Aplatit, résout, déduplique et encapsule les entités. |
| `resolveId(id, baseUrl?)` | Résout un identifiant relatif depuis une URL canonique. |
| `resolveEntityIds(value, baseUrl?)` | Résout récursivement `@id`, `item` et `url` dans une copie. |
| `GraphOptions` | Options `graph`, `context` et `baseUrl`. |

## Validation

| Export | Rôle |
| --- | --- |
| `validateSchema(schema, data, options?)` | Analyse avec les modes `throw`, `warn` ou `silent`. |
| `safeValidateSchema(schema, data, options?)` | Retourne une union discriminée succès/erreur. |
| `formatZodError(error, entityType?, data?)` | Produit le diagnostic lisible dans le terminal. |
| `normalizeZodIssues(error, entityType?, data?)` | Produit des détails d’erreur structurés et stables. |
| `SchemaValidationError` | Erreur avec `code`, `entityType`, `issues`, `details` et message formaté. |

## Dates et durées

| Export | Rôle |
| --- | --- |
| `formatIsoDuration(input)` | Convertit une durée simplifiée en ISO 8601. |
| `parseDurationToMs(input)` | Convertit une durée prise en charge en millisecondes. |
| `parseDate(input, referenceDate?)` | Retourne une `Date` ou `null`, expressions relatives comprises. |
| `formatIsoDate(input)` | Retourne une date ISO normalisée ou lève une erreur. |
| `addDuration(date, duration)` | Ajoute une durée et retourne une chaîne ISO. |
| `diffDuration(start, end)` | Retourne la différence comme durée ISO. |
| `IsoDateSchema`, `IsoDurationSchema` | Schémas Zod de transformation réutilisables. |
| `DurationInput`, `DurationObject` | Types publics d’entrée des durées. |

## Sérialisation

| Export | Rôle |
| --- | --- |
| `serializeJsonLd(data, options?)` | Sérialise le JSON et échappe les caractères HTML dangereux. |
| `escapeJsonLd(json)` | Échappe `<`, `>` et `&` dans une chaîne JSON existante. |
| `SerializeOptions` | Paramètres `pretty` et `indent`. |

## Références et raccourcis

| Export | Rôle |
| --- | --- |
| `isIdReference(value)` | Détecte les fragments, chemins, URL HTTP(S) et URN. |
| `createEntityRef(schema, fallbackType?)` | Crée une union Zod pour entités imbriquées et références. |
| `createSearchAction(options)` | Crée une SearchAction et son EntryPoint. |
| `SpeakableSchema` | Valide et convertit des sélecteurs CSS ou XPath en SpeakableSpecification. |

## Helpers de contenu

Importez-les depuis la racine ou `@unschema-graph/astro/content` :

| Export | Rôle |
| --- | --- |
| `toArticle`, `toBlogPosting`, `toNewsArticle` | Convertissent une entrée Astro en article validé. |
| `extractImage` | Convertit une chaîne ou les métadonnées d’image Astro. |
| `extractKeywords` | Convertit un tableau ou une chaîne séparée par des virgules. |
| `extractWordCount` | Calcule un nombre de mots simple depuis le contenu source. |
| `ContentEntryLike`, `ArticleMappingOptions` | Types publics de correspondance. |

## Audit programmatique

Importez `getHtmlFiles`, `auditHtmlContent`, `auditHtmlDirectory`, `AuditError` et `AuditResult`
depuis `@unschema-graph/core/audit`. Ce point d’entrée utilise le système de fichiers Node.js et doit
rester dans l’outillage de build ou le code serveur.
