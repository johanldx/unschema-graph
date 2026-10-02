---
title: Limites connues
description: Frontières explicites de la couverture Schema.org, de l’audit, de l’éligibilité et de la stabilité 1.x.
---

- Les 51 builders modélisent volontairement un sous-ensemble strict de Schema.org.
- `withAdditionalProperties()` autorise une extension contrôlée après validation sans prouver sa pertinence ou son éligibilité.
- L’audit vérifie syntaxe JSON et structure du graphe dans le HTML ; il ne crawle pas les URL et ne garantit aucun résultat enrichi.
- Les identités relatives exigent un `baseUrl` correct ; Core et Svelte ne déduisent pas l’origine d’une configuration de framework.
- Les helpers de contenu reconnaissent les champs conventionnels documentés ; un CMS personnalisé exige un mapping explicite.
- Les dates relatives des builders et schémas de transformation dépendent de l’horloge réelle ; seuls les appels directs à `parseDate()` acceptent une date de référence.
- Le point d’entrée Node de l’audit n’est pas compatible navigateur.
- En 1.x, les APIs publiques sont régies par Semantic Versioning strict ; les ruptures sont réservées aux versions majeures.

Ces contraintes sont des frontières du produit. Consultez le
[dépannage](/fr/operations/troubleshooting/) et les
[migrations](/fr/operations/migrations/) avant une mise à jour.
