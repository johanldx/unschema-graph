---
title: Dépannage par symptôme
description: Diagnostiquer échecs de build, scripts absents, identités non résolues, données CMS invalides et erreurs d’audit.
---

Partez du symptôme observé, puis confirmez la cause probable avant de modifier les données.

| Symptôme | Cause probable | Solution |
| --- | --- | --- |
| `SchemaValidationError` au build | Champ obligatoire absent ou propriété inconnue | Lisez `error.details`, mappez uniquement les champs documentés et consultez le builder. |
| Diagnostic `duplicate-conflict` | Deux nœuds partagent un `@id` avec des propriétés divergentes | Unifiez les déclarations ou configurez `duplicateStrategy`. |
| Diagnostic `broken-reference` | Un `@id` pointe vers un fragment/nœud introuvable dans le graphe | Vérifiez l'identifiant cible ou passez l'entité manquante à `buildJsonLdGraph`. |
| `NonSerializableValueError` | Données contenant `BigInt`, `Symbol`, `Function`, `NaN` ou `Infinity` | Convertissez vos valeurs en types JSON standards. |
| Boucle infinie / dépassement de pile | Relation cyclique entre entités sans `@id` | Donnez un `@id` à chaque entité du cycle pour les résoudre comme pointeurs de graphe. |
| Le builder retourne `null` | `onError` vaut `warn` ou `silent` | Utilisez `safeParse()` à la frontière ou `throw` en CI. |
| Aucun script JSON-LD | Liste vide/nulle ou composant hors de la route rendue | Inspectez le HTML construit et placez `<Schema />` dans le head actif. |
| `@id` relatif non résolu | Aucun `baseUrl`/`site` Astro | Configurez l’origine canonique ou passez `baseUrl`. |
| JSON invalide à l’audit | Sérialisation manuelle ou script tronqué | Utilisez `<Schema />` ou `serializeJsonLd()` ; ne concaténez jamais du JSON. |
| Aucun résultat enrichi | Balisage valide mais non éligible, non indexé ou non retenu | Comparez contenu visible et exigences du moteur ; l’éligibilité ne garantit rien. |

---

## Diagnostics et résolution des problèmes fréquents

### 1. Références orphelines (`broken-reference`)

Une référence orpheline survient lorsqu'une entité pointe vers un `@id` (par exemple `publisher: '#acme'`) qui ne correspond à aucun nœud présent dans le graphe résolu.

```ts
// ❌ Référence orpheline : '#acme' est référencé mais jamais déclaré
const article = Article({
  headline: 'Bien démarrer',
  publisher: '#acme', // Aucune Organization avec @id: '#acme' n'existe !
});
```

**Comment la détecter :**
- Interceptez les diagnostics avec le callback `onDiagnostic` :
  ```ts
  const graph = buildJsonLdGraph(article, {
    baseUrl: 'https://mon-site.fr',
    onDiagnostic(diagnostic) {
      if (diagnostic.code === 'broken-reference') {
        console.warn(`Référence cassée détectée : ${diagnostic.message}`);
      }
    },
  });
  ```
- Exécutez le CLI d'audit en CI : `unschema-graph audit dist --strict`. Les références locales orphelines provoquent une erreur avec code de sortie `1`.

**Résolution :**
Passez l'entité référencée au graphe ou utilisez une référence d'entité objet :
```ts
const acme = Organization({ '@id': '#acme', name: 'Acme Inc' });
const article = Article({ headline: 'Bien démarrer', publisher: acme });
const graph = buildJsonLdGraph(article, { baseUrl: 'https://mon-site.fr' });
```

---

### 2. Conflits de doublons (`duplicate-conflict`)

Lorsque deux entités déclarent le même `@id` résolu mais affectent des valeurs contradictoires à la même propriété, un conflit est détecté.

```ts
const org1 = Organization({ '@id': '#org', name: 'Acme Corporation' });
const org2 = Organization({ '@id': '#org', name: 'Acme Corp.' }); // Nom différent !
```

Avec la stratégie par défaut `duplicateStrategy: 'merge'`, les propriétés sont fusionnées et la dernière valeur scalaire écrase la précédente. Un diagnostic `duplicate-conflict` est émis.

**Résolution :**
- Déclarez les entités partagées une seule fois (par exemple dans un layout ou une configuration partagée) et référencez-les.
- Si ce conflit révèle une incohérence CMS critique, passez `duplicateStrategy: 'error'` pour lever immédiatement une `DuplicateEntityError`.

---

### 3. Références circulaires

Dans un graphe réel, les entités se référencent souvent mutuellement. Par exemple, un `Author` a écrit un `Book`, et le `Book` liste son `Author`.

- **Sûr lorsque les entités ont un `@id` :** unschema-graph gère les cycles de manière déterministe en hissant les entités au premier niveau de `@graph` et en remplaçant les références imbriquées par des pointeurs `{ "@id": "..." }`.
- **Problématique sans `@id` :** Les value objects ou entités sans identifiant ne peuvent pas être pointés. Une relation JavaScript cyclique non identifiée ne peut pas être déroulée.

**Résolution :**
Attribuez toujours un `@id` à toute entité impliquée dans une relation bidirectionnelle ou cyclique.

---

### 4. Propriétés non reconnues et extensions de schéma

Les builders valident strictement selon le standard Schema.org. Toute clé inconnue est écartée ou provoque une `SchemaValidationError`.

**Pour déclarer des propriétés personnalisées :**
- Utilisez `withAdditionalProperties` pour autoriser des clés spécifiques :
  ```ts
  import { Article, withAdditionalProperties } from '@unschema-graph/core';

  const CustomArticle = withAdditionalProperties(Article, ['customScore', 'internalId']);
  ```
- Ou définissez un nouveau type avec `defineSchema` :
  ```ts
  import { defineSchema, z } from '@unschema-graph/core';

  const CustomBadge = defineSchema('CustomBadge', {
    badgeLevel: z.string(),
  });
  ```

---

### 5. Valeurs non sérialisables

Le JSON-LD doit pouvoir être encodé en JSON valide. Les types comme `BigInt`, `Symbol`, `Function`, `NaN` ou `Infinity` sont rejetés avec une `NonSerializableValueError`.

**Résolution :**
Convertissez les `BigInt` ou horodatages en chaînes ou nombres conventionnels (`toISOString()` ou `Number()`) avant de les passer aux builders.

---

## Ordre de diagnostic

1. Lancez `builder.safeParse(source)` et inspectez les chemins normalisés.
2. Inspectez le HTML rendu ou construit, pas le template source.
3. Lancez `unschema-graph audit <dossier-de-sortie> --strict`.
4. Validez l’URL publique avec l’outil externe pertinent (ex. Google Rich Results Test ou Validateur Schema.org).
5. Vérifiez séparément crawl, indexation, contenu visible et éligibilité.

Si un champ CMS facultatif dans votre modèle est obligatoire pour le builder, bloquez
le rendu avec une erreur éditoriale claire. N’inventez pas de valeur de remplacement.

Suite : [validation](/fr/guides/validation/), [sécurité](/fr/audit-and-quality/security/) et
[audit CLI](/fr/audit-and-quality/audit-cli/).
