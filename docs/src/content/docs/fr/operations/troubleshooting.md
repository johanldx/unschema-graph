---
title: Dépannage par symptôme
description: Diagnostiquer échecs de build, scripts absents, identités non résolues, données CMS invalides et erreurs d’audit.
---

Partez du symptôme observé, puis confirmez la cause probable avant de modifier les données.

| Symptôme | Cause probable | Solution |
| --- | --- | --- |
| `SchemaValidationError` au build | Champ obligatoire absent ou propriété inconnue | Lisez `error.details`, mappez uniquement les champs documentés et consultez le builder. |
| Le builder retourne `null` | `onError` vaut `warn` ou `silent` | Utilisez `safeParse()` à la frontière ou `throw` en CI. |
| Aucun script JSON-LD | Liste vide/nulle ou composant hors de la route rendue | Inspectez le HTML construit et placez `<Schema />` dans le head actif. |
| `@id` relatif non résolu | Aucun `baseUrl`/`site` Astro | Configurez l’origine canonique ou passez `baseUrl`. |
| Nœuds dupliqués | L’identité réutilisée change ou n’a pas d’`@id` | Attribuez un identifiant stable et référencez-le partout. |
| JSON invalide à l’audit | Sérialisation manuelle ou script tronqué | Utilisez `<Schema />` ou `serializeJsonLd()` ; ne concaténez jamais du JSON. |
| Aucun bloc à l’audit | Mauvais dossier de sortie ou aucun schéma | Compilez, confirmez le dossier de l’adaptateur puis auditez-le. |
| Aucun résultat enrichi | Balisage valide mais non éligible, non indexé ou non retenu | Comparez contenu visible et exigences du moteur ; l’éligibilité ne garantit rien. |

## Ordre de diagnostic

1. Lancez `builder.safeParse(source)` et inspectez les chemins normalisés.
2. Inspectez le HTML rendu ou construit, pas le template source.
3. Lancez `unschema-graph audit <dossier-de-sortie>`.
4. Validez l’URL publique avec l’outil externe pertinent.
5. Vérifiez séparément crawl, indexation, contenu visible et éligibilité.

Si un champ CMS facultatif dans votre modèle est obligatoire pour le builder, bloquez
le rendu avec une erreur éditoriale claire. N’inventez pas de valeur de remplacement.

Suite : [validation](/fr/guides/validation/), [sécurité](/fr/audit-and-quality/security/) et
[audit CLI](/fr/audit-and-quality/audit-cli/).
