---
title: Sécurité & Protection anti-XSS
description: Échappement Unicode du JSON-LD, limites de confiance et utilisation sécurisée avec des CMS headless.
---

Le JSON-LD contient des données, mais sa balise `<script>` reste interprétée par le
parseur HTML. Une fermeture de balise non échappée provenant d'un CMS ou d'un utilisateur
peut terminer le bloc de données et ouvrir une voie vers une faille XSS.

`unschema-graph` neutralise cette voie de rupture de script par défaut dans tous ses
packages.

## Règle sûre par défaut

Effectuez le rendu avec `<Schema />` ou sérialisez avec `serializeJsonLd()`. N'insérez
pas le résultat d'un simple `JSON.stringify()` dans une balise script HTML. Continuez à
valider et échapper séparément le même contenu non fiable lorsqu'il est affiché comme
HTML visible.

---

## 1. La faille de rupture de balise script

La fonction standard `JSON.stringify()` n'échappe **pas** les caractères `<`, `>` ou `&`.

Considérez cette charge utile malveillante issue d'un CMS :

```json
{
  "headline": "Super article</script><script>alert('XSS')</script>"
}
```

Si elle est injectée telle quelle dans un gabarit HTML avec `JSON.stringify()` :

```html
<!-- ❌ DANGEREUX : Le parseur HTML s'arrête à la première balise </script> -->
<script type="application/ld+json">
{"headline":"Super article</script><script>alert('XSS')</script>"}
</script>
```

Le parseur HTML du navigateur ferme la balise LD+JSON dès la rencontre de `</script>` et exécute immédiatement le code JavaScript injecté.

---

## 2. Échappement Unicode anti-XSS

La fonction `serializeJsonLd()`—utilisée automatiquement par `<Schema />` dans Astro et Svelte—remplace les caractères sensibles par leurs équivalents Unicode JSON sécurisés :

| Caractère sensible | Forme Unicode échappée | Protection apportée |
| --- | --- | --- |
| `<` | `\u003c` | Empêche l'ouverture d'une balise `</script>` ou `<script>` |
| `>` | `\u003e` | Empêche la fermeture de balises HTML |
| `&` | `\u0026` | Évite toute confusion avec les entités HTML |
| `\u2028` (Séparateur de ligne) | `\u2028` | Prévient les erreurs de parsing JS historiques |
| `\u2029` (Séparateur de paragraphe) | `\u2029` | Prévient les erreurs de parsing JS historiques |

### Sortie HTML assainie

Sérialisé avec `unschema-graph` :

```html
<!-- ✅ SÉCURISÉ : Le parseur HTML ne voit que du texte pur sans balise fermante -->
<script type="application/ld+json">
{"headline":"Super article\u003c/script\u003e\u003cscript\u003ealert('XSS')\u003c/script\u003e"}
</script>
```

Les parseurs JSON redécodent `\u003c` en `<`, tandis que le parseur HTML ne rencontre jamais de délimiteur de balise littéral.

---

## 3. Frontières de confiance et données CMS

Les types TypeScript n'existent qu'au moment de la compilation. Les réponses d'APIs externes peuvent comporter des données incomplètes ou corrompues.

Pour sécuriser votre application :

1. **Utilisez `builder.safeParse()` pour les sources non fiables :**
   ```ts
   const result = Article.safeParse(donneesCms);
   if (!result.success) {
     console.error('Schéma rejeté :', result.error.message);
   }
   ```
2. **Définissez `onError: 'throw'` en production :**
   Interceptez les schémas non conformes dès la phase d'intégration continue (CI) avant tout impact sur votre SEO.

---

## 4. Extension contrôlée avec `withAdditionalProperties()`

Si vous devez ajouter des propriétés Schema.org spécifiques absentes des builders de base :

```ts
import { Article, withAdditionalProperties } from '@unschema-graph/core';

const article = withAdditionalProperties(
  Article({
    headline: 'Données structurées sécurisées',
    image: 'https://mon-site.fr/cover.jpg',
    datePublished: 'today',
    author: 'Ada Lovelace',
  }),
  {
    customTrackingId: 'xyz-123',
  }
);
```

`withAdditionalProperties()` empêche strictement d'écraser les propriétés fondamentales `@type` et `@id`.

## Checklist de mise en production

- Considérez comme non fiables les valeurs issues d'un CMS, d'une API, d'une base de
  données ou d'un utilisateur.
- Analysez les payloads incertains avec `safeParse()` avant leur arrivée dans un composant.
- Conservez `onError: 'throw'` pour les builds de production et la CI.
- Étendez une entité validée uniquement avec `withAdditionalProperties()` ou
  `withAdditionalTypes()` ; ne propagez jamais un payload non contrôlé dans le JSON-LD.
- Compilez le site final et lancez la CLI d'audit sur le HTML produit.
- Revoyez les données structurées rendues à chaque évolution du modèle ou du mapping CMS.

Étape suivante : utilisez la [CLI d'audit](/fr/audit-and-quality/audit-cli/) pour
inspecter le HTML compilé, consultez le [dépannage](/fr/operations/troubleshooting/) ou
les [limites connues](/fr/operations/known-limitations/).
