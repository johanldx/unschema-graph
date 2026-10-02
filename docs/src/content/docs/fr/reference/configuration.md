---
title: Configuration
description: Référence complète de la configuration de l’intégration, des builders et du rendu.
---

## Options de l’intégration

```ts
interface SchemaGraphOptions {
  onError?: 'throw' | 'warn' | 'silent';
  baseUrl?: string;
  inLanguage?: string;
}
```

| Option | Défaut | Description |
| --- | --- | --- |
| `onError` | `throw` au build, `warn` sinon | Comportement global de validation. |
| `baseUrl` | Paramètre Astro `site` | Origine canonique des identifiants et URL relatifs. |
| `inLanguage` | `undefined` | Langue BCP-47 par défaut, utilisée après l’éventuelle locale de route Astro. |

```js
schemaGraph({
  onError: 'throw',
  baseUrl: 'https://example.com',
})
```

## Options par builder

Chaque builder accepte un second argument optionnel :

```ts
interface ValidationOptions {
  entityType?: string;
  onError?: 'throw' | 'warn' | 'silent';
}
```

`onError` surcharge l’intégration. `entityType` sert surtout à la validation bas niveau ou aux
builders personnalisés, car les builders intégrés le définissent déjà.

## Options du graphe

```ts
interface GraphOptions {
  graph?: boolean;   // défaut : true
  context?: string;  // défaut : https://schema.org
  baseUrl?: string;
  duplicateStrategy?: 'merge' | 'error' | 'first' | 'last'; // défaut : merge
  onDiagnostic?: (diagnostic: GraphDiagnostic) => void;
}
```

Ces options sont acceptées par `buildJsonLdGraph()`. La stratégie `merge` par défaut conserve les
propriétés complémentaires et la dernière valeur gagne en cas de conflit. Les diagnostics sont
structurés et opt-in via `onDiagnostic` ; le collecteur n’écrit pas dans la console.

## Options de sérialisation

```ts
interface SerializeOptions {
  pretty?: boolean; // défaut : false
  indent?: number;  // défaut : 2
}
```

## Helpers de configuration globale

`getGlobalConfig()`, `setGlobalConfig()` et `resetGlobalConfig()` sont exportés pour l’outillage et
les tests. Il s’agit d’un état mutable au niveau du module, fourni par commodité, et non d’une
configuration isolée par requête. Le code applicatif devrait normalement le configurer une fois via
`schemaGraph()` plutôt que le modifier directement. Les builders y lisent le mode de validation et
les composants de framework les valeurs par défaut d’URL et de langue. `buildJsonLdGraph()` ne le
lit pas implicitement : transmettez explicitement les options du graphe lorsque le résultat doit
rester indépendant de l’état de l’adaptateur.

## Ordres de priorité

| Paramètre | Priorité décroissante |
| --- | --- |
| Niveau de validation | appel du builder → intégration → `throw` |
| URL de base dans Astro | prop du composant → défaut intégration/global → repli `Astro.site` |
| Langue de l’entité dans Astro | valeur existante → prop du composant → `Astro.currentLocale` → défaut intégration/global |
| URL de base dans Svelte | prop du composant → défaut global |
| Langue de l’entité dans Svelte | valeur existante → prop du composant → défaut global |
| Options du graphe Core | uniquement les options explicites de `buildJsonLdGraph()` |
