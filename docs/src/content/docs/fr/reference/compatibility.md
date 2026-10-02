---
title: Matrice de compatibilité
description: Support des runtimes et peer dependencies dérivé des manifests des packages.
---

Cette matrice reflète les manifests publiés, pas une feuille de route souhaitée.

## Le contrat de compatibilité `1.0`

La version `1.0` établit un contrat de compatibilité strict. Elle garantit :

- une API publique régie par le versionnage sémantique ;
- des contrats cohérents pour le typage TypeScript et la validation à l’exécution ;
- une composition de graphe et une résolution des références déterministes ;
- des packages npm utilisables via leurs exports publics documentés ;
- une documentation suffisante pour utiliser la bibliothèque sans lire son code source.

Le contrat produit couvre toute la chaîne des données structurées :

```text
entités typées
→ validation à l’exécution
→ composition du graphe
→ résolution des références
→ sérialisation sûre
→ intégration aux frameworks
→ audit statique / CI
```

En résumé, unschema-graph construit du JSON-LD Schema.org typé, validé et sérialisé de
façon sûre, avec composition de graphe, intégrations aux frameworks et audit en CI. Son
périmètre reste les données structurées : `1.0` n’en fera pas un framework SEO généraliste.

## Compatibilité actuelle

| Surface | Plage supportée | Modèle de rendu | Notes |
| --- | --- | --- | --- |
| Core | Node `>=22.12.0`, Zod `^4.6.0` | Indépendant du framework | Export racine compatible navigateur ; `core/audit` requiert Node. |
| Astro | Astro `^5.0.0 || ^6.0.0 || ^7.0.0`, Node `>=22.12.0` | Statique et SSR | Aucun JavaScript client pour le composant. L’intégration fournit les défauts build/dev. |
| Svelte | Svelte `^5.15.0`, Node `>=22.12.0` pour l’outillage | SSR et navigation réactive | Composant runes natif via `svelte:head` ; la borne basse est testée depuis le paquet généré. |
| SvelteKit | Fixture représentative d’un consommateur `2.x` courant | SSR, prérendu et navigation cliente | Aucun peer range indépendant ni adaptateur n’est promis ; utilisez le package Svelte. |
| Schema.org | Baseline `30.1` (`SCHEMA_ORG_BASELINE`) | Définition du vocabulaire | Les schémas intégrés modélisent un sous-ensemble sélectionné, pas tout le vocabulaire. |
| Zod | `^4.6.0` | Validation à l’exécution | Peer dependency de Core. |

La CI utilise Node `22.12.0`. Les fixtures des paquets générés installent exactement Astro
`5.0.0`, `6.0.0` et `7.3.5`, Svelte `5.15.0` et `5.57.1`, ainsi que Zod `4.6.0` et
`4.6.5`. Des consommateurs npm vérifient en plus Core avec le Zod courant et Astro
`7.3.5`. Les peer ranges ci-dessus restent le contrat d’acceptation des paquets.

### Politique temporelle, dates et fuseaux horaires

- **Dates pures (`YYYY-MM-DD`)** : préservées sous forme de chaînes de dates pures sans conversion d'heure ni décalage de fuseau horaire.
- **Horodatages explicites (`YYYY-MM-DDTHH:mm:ssZ` ou avec décalage `+02:00`)** : strictement préservés avec leur offset explicite pour respecter l'intention de l'auteur.
- **Expressions relatives (`today`, `tomorrow`, `+30d`)** : les builders, `IsoDateSchema` et `formatIsoDate()` les évaluent avec l’horloge réelle au moment de l’exécution. Seul un appel direct à `parseDate(input, referenceDate)` accepte une référence fixe. Utilisez des valeurs ISO explicites dans les builders pour des builds reproductibles.

Le minimum Node `>=22.12.0` est volontaire. Au gel de compatibilité de la v1, Node 22 est
la plus ancienne ligne LTS encore maintenue et elle est testée par la CI ainsi que par les
fixtures des packages publiés. L’export racine du Core reste compatible avec les navigateurs,
mais les versions Node plus anciennes ou en fin de vie ne font pas partie du contrat maintenu.

Voir [Astro](/fr/integrations/astro/), [Svelte](/fr/integrations/svelte/) et
[Core](/fr/integrations/core/).

## API publique candidate pour `1.0`

Les points d’entrée suivants forment la surface publique prévue pour la v1. Importer un
fichier situé sous `dist/` ou un chemin source n’est jamais pris en charge.

| Package | Points d’entrée publics | Contrat v1 |
| --- | --- | --- |
| `@unschema-graph/core` | `.`, `./audit` | Builders, construction du graphe, validation, sérialisation, configuration, helpers temporels et audit HTML. |
| `@unschema-graph/astro` | `.`, `./integration`, `./content`, `./Schema.astro` | Réexport complet du Core, intégration Astro, composant et mappers Content Collections. |
| `@unschema-graph/svelte` | `.`, `./Schema.svelte` | Réexport complet du Core et composant Svelte 5 natif. |

Les fonctions Core garanties sont :

```text
defineSchema                 buildJsonLdGraph
serializeJsonLd              escapeJsonLd
validateSchema               safeValidateSchema
withAdditionalProperties     withAdditionalTypes
setGlobalConfig              getGlobalConfig
resetGlobalConfig            createSearchAction
entityRef
formatIsoDuration            parseDurationToMs
parseDate                    formatIsoDate
addDuration                  diffDuration
```

Le contrat comprend aussi la constante `SCHEMA_ORG_BASELINE`, `DuplicateEntityError`,
chaque builder et son schéma correspondant dans le [catalogue des builders](/fr/reference/builders/),
la classe `SchemaValidationError` et les types utilitaires publics suivants :

```text
SchemaInput                  SchemaOutput
SchemaBuilder                SchemaOrgEntity
SchemaProps                  SchemaGraphOptions
ValidationOptions            GraphOptions
GraphDiagnostic              DuplicateStrategy
SerializeOptions             Severity
SchemaValidationErrorCode    SchemaValidationIssue
SchemaValidationResult       DurationInput
DurationObject               SearchActionOptions
EntityRefOptions             EntityReference
EntityIdReference
```

Le contrat de `@unschema-graph/core/audit` comprend `auditHtmlContent()`,
`auditHtmlDirectory()`, `getHtmlFiles()` ainsi que les types d’audit suivants :

```text
AuditDiagnostic              AuditDiagnosticCode
AuditError                   AuditResult
AuditContentResult
```

Le contrat propre à Astro comprend `Schema`, `schemaGraph()`, `toArticle()`,
`toBlogPosting()`, `toNewsArticle()`, `ContentEntryLike` et `ArticleMappingOptions`.
Le composant Astro `<Schema />` accepte toutes les props partagées ainsi que `debug` :

```text
data    item        items       pretty      indent
context graph       baseUrl     inLanguage  debug
```

`data`, `item` et `items` sont des alias pris en charge. Si plusieurs sont fournis, leurs
entités sont combinées dans cet ordre. Dans Astro, un `baseUrl` explicite est prioritaire
sur le défaut intégration/global, avec `Astro.site` comme dernier repli.

Le contrat propre à Svelte comprend `Schema` et le réexport complet du Core. Son composant
`<Schema />` accepte les props partagées (`data`, `item`, `items`, `pretty`, `indent`,
`context`, `graph`, `baseUrl`, `inLanguage`), utilise `svelte:head`, prend en charge le SSR
et SvelteKit et ne requiert aucun JavaScript client pour une entrée statique.

Chaque symbole documenté comme exporté depuis un point d'entrée supporté d'un package est régi par le versionnage sémantique dès le gel d'API v1.

Les fichiers source, chemins `dist/*`, imports profonds non documentés et helpers d'implémentation internes ne constituent pas des APIs publiques.

## Politique de versionnage sémantique sous `1.x`

> **Version 0.10.0 — Gel de l'API publique**
> La version `0.10.0` fige le contrat d'API publique pour Core, Astro et Svelte avant `1.0.0-rc.1`. Les barils racine ont été restreints strictement à l'API publique documentée, les primitives internes ont été retirées de la surface publique et les imports profonds sont bloqués.

- **PATCH** corrige un défaut sans supprimer d’API ni rendre invalide une entrée valide documentée.
- **MINOR** ajoute de façon rétrocompatible des builders, propriétés optionnelles, surcharges ou points d’entrée.
- **MAJOR** supprime ou renomme un symbole public, rejette une entrée valide documentée, ou modifie un comportement documenté du JSON-LD, des références, du merge, de la déduplication ou des erreurs.

Les règles de validation et la sortie documentée appartiennent au contrat de compatibilité,
ce ne sont pas des détails d’implémentation. Durcir une règle ou modifier une sortie
normalisée exige donc une version majeure, sauf si l’ancien comportement contredisait la
documentation et que la modification est publiée comme correction de bug clairement
identifiée.

## Politique de dépréciation

Lorsqu’une API publique doit disparaître, elle reçoit l’annotation TypeScript `@deprecated`,
est annoncée dans les notes de version et documentée avec sa remplaçante. Elle reste
disponible pendant le reste de la version majeure lorsque c’est possible et n’est supprimée
que dans une future version majeure. Les avertissements à l’exécution, lorsqu’ils sont
inévitables, sont réservés au développement, émis une seule fois et indiquent une solution
actionnable ; la production reste silencieuse.
