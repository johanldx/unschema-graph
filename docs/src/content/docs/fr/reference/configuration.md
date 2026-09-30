---
title: Configuration
description: Référence complète de la configuration de l’intégration, des builders et du rendu.
---

## Options de l’intégration

```ts
interface SchemaGraphOptions {
  onError?: 'throw' | 'warn' | 'silent';
  baseUrl?: string;
}
```

| Option | Défaut | Description |
| --- | --- | --- |
| `onError` | `throw` au build, `warn` sinon | Comportement global de validation. |
| `baseUrl` | Paramètre Astro `site` | Origine canonique des identifiants et URL relatifs. |

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
}
```

Ces options sont acceptées par `buildJsonLdGraph()` et correspondent aux props de `<Schema />`.

## Options de sérialisation

```ts
interface SerializeOptions {
  pretty?: boolean; // défaut : false
  indent?: number;  // défaut : 2
}
```

## Helpers de configuration globale

`getGlobalConfig()`, `setGlobalConfig()` et `resetGlobalConfig()` sont exportés pour l’outillage et
les tests. Le code applicatif devrait normalement utiliser `schemaGraph()` plutôt que modifier cet
état de module directement.

## Ordres de priorité

| Paramètre | Priorité décroissante |
| --- | --- |
| Niveau de validation | appel du builder → intégration → `throw` |
| URL de base au rendu | prop du composant → `Astro.site` → intégration |
| Langue de l’entité | valeur existante → prop du composant → `Astro.currentLocale` |
