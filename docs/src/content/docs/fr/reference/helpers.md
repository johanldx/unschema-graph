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
| `GraphOptions` | Options d’encapsulation, résolution d’ID, doublons et diagnostics. |
| `GraphDiagnostic` | Diagnostic structuré de conflit ou référence cassée. |
| `DuplicateStrategy` | Politique de doublon : `merge`, `error`, `first` ou `last`. |
| `DuplicateEntityError` | Erreur levée par la stratégie de doublons `error`. |

## Validation

| Export | Rôle |
| --- | --- |
| `validateSchema(schema, data, options?)` | Analyse avec les modes `throw`, `warn` ou `silent`. |
| `safeValidateSchema(schema, data, options?)` | Retourne une union discriminée succès/erreur. |
| `SchemaValidationError` | Erreur avec `code`, `entityType`, `issues`, `details` et message formaté. |
| `GoogleArticle`, `GoogleRecipe` | Builders opt-in des profils consommateurs Google implémentés. |
| `GoogleArticleSchema`, `GoogleRecipeSchema` | Schémas de profils composables, sans garantie d’éligibilité aux résultats enrichis. |

## Dates et durées

| Export | Rôle |
| --- | --- |
| `formatIsoDuration(input)` | Convertit une durée simplifiée en ISO 8601. |
| `parseDurationToMs(input)` | Convertit une durée prise en charge en millisecondes. |
| `parseDate(input, referenceDate?)` | Retourne une `Date` ou `null`, expressions relatives comprises. |
| `formatIsoDate(input)` | Retourne une date ISO normalisée ou lève une erreur. |
| `addDuration(date, duration)` | Ajoute une durée et retourne une chaîne ISO. |
| `diffDuration(start, end)` | Retourne la différence comme durée ISO. |
| `DurationInput`, `DurationObject` | Types publics d’entrée des durées. |

`referenceDate` ne contrôle qu’un appel direct à `parseDate()`. Les valeurs relatives
transmises aux builders ou à `formatIsoDate()` utilisent l’horloge réelle au moment
de l’exécution ; préférez une entrée ISO explicite pour une sortie reproductible.

## Sérialisation

| Export | Rôle |
| --- | --- |
| `serializeJsonLd(data, options?)` | Voie recommandée pour injecter du JSON-LD dans `<script>` ; neutralise `<`, `>`, `&`, `\u2028` et `\u2029`. |
| `escapeJsonLd(json)` | Échappe les caractères HTML sensibles et séparateurs Unicode dans une chaîne JSON existante. |
| `SerializeOptions` | Paramètres `pretty` et `indent`. |

## Références et raccourcis

| Export | Rôle |
| --- | --- |
| `EntityReference<T>` | Entrée relationnelle typée : entité compatible, chaîne d’identifiant ou objet `{ '@id' }` explicite. |
| `EntityIdReference` | Forme d’un pointeur relationnel explicite `{ '@id': string }`. |
| `entityRef({ schemas, types?, fallbackType? })` | Crée le schéma Zod relationnel partagé par les builders intégrés. |
| `createSearchAction(options)` | Crée une SearchAction et son EntryPoint. |

Utilisez un schéma spécialisé pour chaque propriété plutôt que d’accepter toute entité
Schema.org :

```ts
const PublisherSchema = entityRef({
  schemas: [OrganizationSchema, PersonSchema],
  types: ['Organization', 'Person'],
  fallbackType: 'Organization',
});
```

La même primitive conserve les entités issues des builders, normalise les chaînes
d’identifiant en `{ '@id' }` et développe les chaînes simples avec `fallbackType`. Sans
type de fallback, les chaînes simples sont rejetées : fournissez une entité directe, une
chaîne ressemblant explicitement à un identifiant ou un objet `{ '@id' }`. Les value
objects comme les adresses gardent des schémas distincts afin qu’une chaîne libre ne soit
pas confondue avec une référence d’entité.

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
