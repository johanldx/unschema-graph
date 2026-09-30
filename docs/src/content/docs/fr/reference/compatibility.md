---
title: Matrice de compatibilité
description: Support des runtimes et peer dependencies dérivé des manifests des packages.
---

Cette matrice reflète les manifests publiés, pas une feuille de route souhaitée.

| Surface | Plage supportée | Modèle de rendu | Notes |
| --- | --- | --- | --- |
| Core | Node `>=22.12.0`, Zod `^4.6.0` | Indépendant du framework | Export racine compatible navigateur ; `core/audit` requiert Node. |
| Astro | Astro `^5.0.0 || ^6.0.0 || ^7.0.0`, Node `>=22.12.0` | Statique et SSR | Aucun JavaScript client pour le composant. L’intégration fournit les défauts build/dev. |
| Svelte | Svelte `^5.0.0`, Node `>=22.12.0` pour l’outillage | SSR et navigation réactive | Composant runes natif via `svelte:head`. |
| SvelteKit | Versions compatibles Svelte 5 | SSR, prérendu et navigation cliente | Aucun adaptateur séparé ; utilisez le package Svelte. |
| Zod | `^4.6.0` | Validation à l’exécution | Peer dependency de Core. |

Le dépôt teste actuellement Astro 7.3, Svelte 5, TypeScript 6 et Zod 4.6. Cela décrit
l’environnement de développement ; les peer ranges ci-dessus définissent l’acceptation.

Voir [Astro](/fr/integrations/astro/), [Svelte](/fr/integrations/svelte/) et
[Core](/fr/integrations/core/).
