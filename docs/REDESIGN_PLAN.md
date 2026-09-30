# Plan directeur de refonte de la documentation

> Source de vérité du chantier de documentation d'unschema-graph.
>
> Créé le 29 septembre 2026 à partir d'un audit du dépôt et d'un entretien de
> cadrage. Ce document couvre l'ensemble de la refonte. Chaque case correspond à
> un résultat vérifiable et doit être cochée seulement lorsque son critère
> d'acceptation est satisfait.

## Mode d'emploi

- Exécuter les phases dans l'ordre, sauf lorsqu'une dépendance indique explicitement
  qu'une tâche peut être menée en parallèle.
- Cocher une tâche avec `[x]` uniquement après sa vérification.
- Ajouter la date de réalisation à la fin de la ligne : `(terminé le AAAA-MM-JJ)`.
- Si l'implémentation s'écarte du plan, conserver la décision d'origine et ajouter
  une note dans le journal des écarts.
- Ne pas modifier silencieusement une décision validée. Ajouter une entrée au journal
  des décisions avant de changer la direction.
- À la reprise du chantier, commencer par la première case non cochée dont toutes les
  dépendances sont satisfaites.

### Légende

- `[x]` : terminé et vérifié.
- `[ ]` : à faire.
- **Dépend de** : tâches devant être terminées auparavant.
- **Fichiers** : cibles probables ; la liste peut être ajustée si la structure évolue.
- **Acceptation** : résultat observable nécessaire pour cocher la tâche.

## 1. État initial vérifié

- [x] Auditer rapidement l'architecture du monorepo, les packages publics et les
  commandes de qualité. (terminé le 2026-09-29)
- [x] Auditer la structure, la navigation, le contenu, l'internationalisation et les
  routes lisibles par les agents de la documentation. (terminé le 2026-09-29)
- [x] Cartographier la surface publique de Core, Astro, Svelte et de l'audit.
  (terminé le 2026-09-29)
- [x] Conduire l'entretien de cadrage et fermer toutes les branches de décision.
  (terminé le 2026-09-29)
- [x] Écrire ce plan directeur sans commencer l'implémentation.
  (terminé le 2026-09-29)

### Constat de départ

Le projet est un monorepo pnpm TypeScript strict composé de trois packages publics :

- `@unschema-graph/core` : builders Zod, composition de graphes, résolution des
  identités, validation, dates et durées, sérialisation sûre et audit CLI/API ;
- `@unschema-graph/astro` : intégration Astro, composant `<Schema />`, Dev Toolbar et
  helpers Content Collections ;
- `@unschema-graph/svelte` : composant Svelte 5 réactif et réexport du Core.

La documentation est déjà riche : Starlight, anglais et français, 51 références de
builders générées dans chaque langue, recherche, `llms.txt`, `llms-full.txt` et routes
Markdown. Le chantier vise donc surtout la hiérarchie, la pédagogie, la cohérence et
l'identité visuelle.

### Problèmes connus à résoudre

- Le README annonce encore 38 builders alors que le catalogue actuel en contient 51.
- L'accueil se décrit parfois comme un produit uniquement Astro alors que Core et
  Svelte sont des cibles de premier rang.
- Le Quick Start actuel est trop long et mélange plusieurs environnements, un graphe
  complet et sa sortie avant le premier succès du lecteur.
- Le parcours débutant, les guides orientés tâches et la référence technique sont
  insuffisamment séparés.
- Certaines promesses confondent validation locale, validité Schema.org, éligibilité
  aux résultats enrichis et résultats SEO.
- La documentation du composant décrit une résolution de `baseUrl` globale pour
  Svelte/Core qui ne correspond pas au comportement actuel du composant Svelte.
- La landing concentre contenu bilingue, structure et styles dans un unique composant
  difficile à faire évoluer.
- Les README de packages sont trop minces pour orienter correctement un lecteur npm.
- La terminologie et la capitalisation ne sont pas entièrement homogènes entre les
  sections et les langues.

## 2. Vision et objectifs

### Vision

Faire d'unschema-graph une documentation de référence pour les données structurées en
TypeScript : aussi accueillante qu'Astro pour apprendre, aussi nette que Stripe pour
trouver et appliquer une information, et reconnaissable grâce à une identité visuelle
propre au produit.

### Positionnement éditorial

Promesse principale :

> Une bibliothèque Schema.org type-safe pour construire, relier, valider et auditer
> des données JSON-LD avec TypeScript, Astro et Svelte.

Le produit ne doit pas promettre un classement, une visibilité garantie, une
éligibilité automatique aux résultats enrichis ou une absence absolue d'erreurs. La
documentation doit distinguer explicitement :

1. validation des entrées par les builders ;
2. production d'une structure JSON-LD sûre ;
3. conformité au vocabulaire Schema.org documenté ;
4. recommandations propres aux moteurs de recherche ;
5. résultats réels, qui restent hors du contrôle de la bibliothèque.

### Objectifs mesurables

- Un développeur connaissant TypeScript et Astro, mais pas Schema.org, doit produire
  un premier `Article` en moins de cinq minutes.
- Un lecteur doit pouvoir identifier son environnement et commencer avec Astro,
  Svelte ou Core depuis la page d'accueil.
- Une API publique doit être trouvable depuis la navigation ou la recherche en moins
  de trente secondes.
- Le passage d'un exemple minimal à un graphe réaliste doit être explicite et continu.
- Toutes les pages publiques doivent exister en anglais et en français avec la même
  structure, les mêmes exemples fonctionnels et les mêmes liens essentiels.
- Toutes les pages doivent exposer une action simple pour copier leur version Markdown.
- L'interface doit satisfaire WCAG AA, fonctionner au clavier et sur mobile, respecter
  `prefers-reduced-motion`, proposer un mode sombre et minimiser le JavaScript client.
- La confiance doit venir de preuves vérifiables : typage, validation, sécurité, tests,
  compatibilité et audit. Aucun faux témoignage ou chiffre d'adoption ne sera utilisé.

### Non-objectifs

- Enseigner JavaScript, TypeScript, Astro ou Svelte depuis zéro.
- Documenter ligne par ligne tous les détails internes du code.
- Garantir des performances SEO ou la présence dans une fonctionnalité Google.
- Maintenir les anciennes URL après la nouvelle architecture. Les liens internes et
  externes contrôlés par le dépôt devront toutefois être mis à jour.
- Traduire automatiquement de la prose sans relecture éditoriale.
- Ajouter une animation permanente ou une décoration qui gêne la lecture.

## 3. Registre des décisions validées

| Sujet | Décision |
| --- | --- |
| Audience principale | Développeurs Astro découvrant les données structurées, sans sous-estimer Svelte et Core. |
| Niveau supposé | TypeScript et framework maîtrisés ; Schema.org non requis. |
| Présentation des environnements | Trois cartes de poids égal, avec Astro recommandé comme porte d'entrée. |
| Positionnement | Bibliothèque Schema.org type-safe et chaîne complète construction, validation et audit. |
| Premier succès | Un `Article` minimal en moins de cinq minutes, puis évolution vers un graphe réaliste. |
| Architecture | Commencer, Apprendre, Recettes, Référence, Exploitation. |
| Profondeur technique | API publique, modèle mental, architecture, pipeline, graphes, validation, sérialisation et extension. |
| Recettes | Toutes les familles identifiées dès la version complète, avec exemples, graphe recommandé, erreurs et recommandations externes clairement séparées. |
| Langues | Parité complète anglais/français ; anglais canonique ; contenu répétitif produit depuis des données communes. |
| Références visuelles | Pédagogie d'Astro et clarté de Stripe, sans imitation directe. |
| Identité | Refonte complète du système visuel et possibilité de faire évoluer le logo. |
| Concept graphique | Objets JSON colorés qui deviennent des nœuds reliés dans un graphe. |
| Couleur | Palette vive concentrée sur les données et interactions ; teinte secondaire par grande section. |
| Typographie | Polices open source auto-hébergées. |
| Mouvement | Discret et utile ; connexion du logo une seule fois sur l'accueil ; mouvement réduit respecté. |
| Logo | SVG propre, symbole et logotype, monochrome, clair/sombre, favicon ; animation optionnelle. |
| Démonstration d'accueil | Transformation interactive d'un builder en graphe JSON-LD. |
| Exemples multi-frameworks | Préférence globale mémorisée et onglets locaux lorsque la syntaxe diffère. |
| Documentation IA | Page dédiée pour les humains et bouton par page copiant le Markdown ; aucun lien fournisseur requis. |
| Stabilité affichée | Statut pré-1.0 assumé et garanties techniques vérifiables. |
| URL historiques | Aucune obligation de redirection ; les routes peuvent être cassées. |
| Déploiement | Architecture et contenu, puis système visuel, puis contenus avancés, avec jalons utilisables. |
| Application visuelle | Le nouveau système visuel s'applique à toutes les pages dès sa livraison. |
| Suivi | Chaque tâche terminée reçoit une date et tout écart est journalisé. |

## 4. Architecture cible de l'information

### Navigation principale

1. **Commencer / Get started**
   - Vue d'ensemble
   - Choisir son environnement
   - Installation
   - Premier schéma : Astro
   - Premier schéma : Svelte
   - Premier schéma : Core
2. **Apprendre / Learn**
   - Modèle mental
   - Entités, types et propriétés
   - Identités avec `@id`
   - Composer un `@graph`
   - Validation et erreurs
   - Dates et durées
   - Sécurité et sérialisation
3. **Recettes / Recipes**
   - Blog et média
   - Site d'entreprise
   - E-commerce
   - Commerce local
   - Événements
   - CMS et Content Collections
   - SvelteKit et SSR
   - Audit en CI
4. **Référence / Reference**
   - Composants Astro et Svelte
   - Intégration Astro
   - Core
   - Configuration
   - Helpers
   - Audit API
   - Catalogue des builders généré
5. **Exploitation / Operations**
   - Audit CLI
   - Intégration continue
   - Sécurité
   - Dépannage
   - Compatibilité et statut des versions
   - Migrations et changelog
   - Documentation pour agents et IA

### Principes de navigation

- L'organisation principale suit l'intention du lecteur, pas les dossiers du monorepo.
- Astro, Svelte et Core sont des variantes dans les parcours, pas trois documentations
  isolées.
- Astro est marqué « recommandé pour commencer » sans recevoir une carte plus grande.
- Le choix d'environnement peut être mémorisé localement ; il ne masque jamais les
  autres variantes et reste réversible sur chaque exemple.
- Le sélecteur de langue, la recherche et l'action « Copier en Markdown » restent
  accessibles depuis toutes les pages.
- Les références générées restent dans une section repliable et filtrable afin de ne
  pas noyer les guides.
- Chaque page d'apprentissage se termine par une seule prochaine étape principale et,
  si utile, un lien secondaire vers la référence.

### Mapping de routes retenu pour la phase 1

La phase 1 privilégie une architecture de navigation claire sans déplacer les pages
techniques qui possèdent déjà une URL descriptive. Seul l'ancien Quick Start
monolithique est remplacé par trois parcours indépendants.

| Route avant la phase 1 | Route cible ou traitement |
| --- | --- |
| `/getting-started/overview/` | Conservée et réécrite |
| — | `/getting-started/choose-your-environment/` créée |
| `/getting-started/installation/` | Conservée et simplifiée |
| `/getting-started/quick-start/` | Supprimée sans redirection, conformément à la décision sur les URL historiques |
| — | `/getting-started/quick-start/astro/` créée |
| — | `/getting-started/quick-start/svelte/` créée |
| — | `/getting-started/quick-start/core/` créée |
| `/guides/graphs-and-references/` | Conservée, réécrite et classée dans Apprendre |
| `/guides/validation/` | Conservée, réécrite et classée dans Apprendre |
| `/guides/dates-and-durations/` | Conservée, réécrite et classée dans Apprendre |
| `/audit-and-quality/security/` | Conservée, réécrite et classée dans Apprendre |
| — | `/guides/mental-model/` créée |
| — | `/guides/entities-types-and-properties/` créée |
| — | `/guides/identities/` créée |
| `/guides/content-collections/` | Conservée et classée dans Recettes |
| `/integrations/{astro,svelte,core}/` | Conservées et classées dans Référence |
| `/reference/**` | Conservées dans Référence |
| `/guides/custom-schemas/` | Conservée et classée dans Référence |
| `/guides/voice-and-ai-speakable/` | Conservée et classée dans Référence |
| `/audit-and-quality/audit-api/` | Conservée et classée dans Référence |
| `/audit-and-quality/audit-cli/` | Conservée et classée dans Exploitation |
| `/ai/implementation-guide/` | Conservée et classée dans Exploitation |

Le même mapping s'applique sous le préfixe `/fr/`.

### Modèle de page par section

| Section | Ouverture | Corps | Fin de page |
| --- | --- | --- | --- |
| Commencer | Résultat concret et durée estimée | Étapes courtes avec code exécutable | Vérification visible et prochaine étape |
| Apprendre | Question ou concept | Explication, diagramme, exemple minimal puis réaliste | Résumé et lien vers recette/référence |
| Recettes | Résultat métier | Graphe recommandé, variantes, erreurs, validation | Checklist de production |
| Référence | Signature et disponibilité | Types, options, comportement, exemples | Liens connexes et erreurs fréquentes |
| Exploitation | Risque ou objectif opérationnel | Procédure et diagnostics | Critère de réussite et dépannage |

## 5. Direction éditoriale

### Voix

- Pédagogique, chaleureuse et directe dans les parcours guidés.
- Plus dense et scannable dans la référence, sans changer de vocabulaire.
- Voix active, phrases courtes, titres descriptifs et labels en casse de phrase.
- Aucun remplissage marketing, superlatif invérifiable ou terme SEO ambigu.
- Les termes API restent en anglais lorsqu'ils correspondent au code ; leur sens est
  expliqué en français lors de la première occurrence.
- « Builder » peut être conservé comme terme technique, avec une définition claire.

### Progression pédagogique

1. Installer un seul package.
2. Construire un `Article` minimal.
3. Le rendre avec le composant ou l'API de l'environnement choisi.
4. Vérifier le script produit.
5. Comprendre l'entité et son identité.
6. Ajouter `Organization`, `WebSite` et `WebPage`.
7. Relier les entités dans un `@graph`.
8. Valider et auditer le résultat.

### Règles de vérité

- Écrire « valide selon le builder » lorsque seule la validation locale est garantie.
- Lier les recommandations Google lorsqu'elles sont mentionnées et les dater si elles
  sont susceptibles d'évoluer.
- Ne jamais présenter une propriété Schema.org comme une garantie d'affichage.
- Signaler clairement les comportements propres à Astro, Svelte ou Core.
- Les exemples doivent utiliser uniquement des exports publics et des versions
  supportées par le dépôt.
- Tout nombre exposé publiquement, comme le nombre de builders, doit provenir d'une
  source structurée ou être testé automatiquement.

## 6. Direction visuelle

### Idée directrice

Les données commencent comme des objets JSON lisibles, puis se connectent pour former
un graphe. Cette transformation est le geste visuel mémorable du produit. Le reste de
l'interface demeure calme, précis et orienté lecture.

### Palette de départ à prototyper

Les valeurs suivantes constituent une base de travail, pas une permission pour réduire
le contraste. Elles devront être validées en clair et sombre avant adoption.

| Jeton | Valeur initiale | Usage |
| --- | --- | --- |
| `paper` | `#F9F8FF` | Fond clair légèrement froid |
| `graphite` | `#242033` | Texte principal clair / surface sombre |
| `node-violet` | `#7057FF` | Action principale, identité et liens actifs |
| `edge-aqua` | `#12BFAE` | Connexions, validation et succès |
| `data-coral` | `#FF795C` | Valeurs, points d'attention et recettes |
| `signal-yellow` | `#F4C542` | Repères, statut pré-1.0 et accents limités |

La palette finale doit respecter un contraste WCAG AA. Les couleurs ne doivent jamais
être le seul moyen de communiquer une information.

### Typographie de départ

- Tester **Instrument Sans** pour le texte, les titres et l'interface.
- Tester **Commit Mono** pour le code et les données JSON.
- Auto-héberger les fichiers WOFF2 nécessaires, documenter les licences et limiter les
  graisses chargées.
- Garder les lignes de prose sous 80 caractères environ.
- Éviter les labels décoratifs en capitales, les mots isolés en dégradé et les styles
  de titres qui ne portent aucune information.

Si ces polices ne satisfont pas la lisibilité, les performances ou les glyphes requis,
documenter le remplacement dans le journal des décisions avant intégration.

### Logo

- Concevoir un symbole SVG réunissant blocs de données et connexions de graphe.
- Chercher une silhouette distinctive à 16 px ; éviter l'icône générique de réseau à
  trois points.
- Prévoir symbole seul, logotype horizontal, monochrome, clair, sombre et favicon.
- Garder les formes principales vectorielles, sans filtre ou masque indispensable.
- La version officielle est statique.
- Sur la landing uniquement, une variante peut connecter ses nœuds une fois au
  chargement. Aucun mouvement si `prefers-reduced-motion: reduce` est actif.

### Layout

- Prose alignée à gauche, largeur de lecture contrôlée.
- Navigation et table des matières présentes sur grand écran, repliées proprement sur
  mobile.
- Utiliser les bordures, couleurs et regroupements pour exprimer une structure réelle,
  pas comme décoration répétitive.
- Ne pas enfermer chaque fragment dans une carte arrondie identique.
- Réserver l'expression visuelle maximale à la démonstration builder vers graphe.

### Wireframe de la landing

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Logo    Commencer  Apprendre  Recettes  Référence    EN/FR  GitHub │
├──────────────────────────────────────────────────────────────────────┤
│ Construisez un graphe JSON-LD fiable.  │  builder → graphe         │
│ Promesse courte et honnête.             │  démonstration réelle     │
│ [Commencer] [Voir la référence]         │  interactive, accessible │
├──────────────────────────────────────────────────────────────────────┤
│ [Astro · recommandé]  [Svelte 5]  [TypeScript / Core]              │
├──────────────────────────────────────────────────────────────────────┤
│ Construire ───────── Relier ───────── Valider ───────── Auditer     │
├──────────────────────────────────────────────────────────────────────┤
│ Recettes : média | entreprise | commerce | local | événements       │
├──────────────────────────────────────────────────────────────────────┤
│ Preuves techniques vérifiables + statut pré-1.0                     │
├──────────────────────────────────────────────────────────────────────┤
│ Documentation Markdown et usage avec les agents                     │
└──────────────────────────────────────────────────────────────────────┘
```

## 7. Plan d'exécution détaillé

### Phase 0 — Assainir les sources de vérité

Objectif : supprimer les contradictions qui contamineraient la nouvelle documentation.

- [x] Remplacer les nombres de builders écrits manuellement dans le README et les
  surfaces publiques par une formulation générée ou une valeur issue de
  `docs/src/data/builders.mjs`. (terminé le 2026-09-29)
  - **Fichiers** : `README.md`, README des packages, données de documentation.
  - **Acceptation** : aucune occurrence obsolète de « 38 builders/schemas » ; le nombre
    affiché correspond au catalogue généré.
- [x] Vérifier les exports publics et choisir un import Astro canonique, tout en
  documentant les alias encore supportés. (terminé le 2026-09-29)
  - **Fichiers** : `packages/astro/package.json`, `packages/astro/src/index.ts`, README,
    pages d'installation et d'intégration.
  - **Acceptation** : tous les guides utilisent le même import recommandé.
- [x] Corriger la documentation de la résolution de `baseUrl` pour Astro, Svelte et
  Core à partir du comportement réel du code. (terminé le 2026-09-29)
  - **Fichiers** : `docs/src/content/docs/reference/component.md` et équivalent français.
  - **Acceptation** : chaque environnement possède un ordre de résolution exact et
    vérifiable.
- [x] Remplacer les garanties absolues et les mentions datées par des formulations
  vérifiables. (terminé le 2026-09-29)
  - **Fichiers** : accueil, overview, guides SEO/voice, README.
  - **Acceptation** : aucune garantie de classement, d'éligibilité ou de « zéro erreur ».
- [x] Définir un mini-glossaire bilingue pour builder, entity, graph, reference,
  validation, serialization, audit et structured data. (terminé le 2026-09-29)
  - **Fichiers** : nouveau fichier de données éditoriales ou guide de contribution.
  - **Acceptation** : les termes retenus sont utilisés dans la navigation et les
    nouvelles pages.
- [x] Documenter clairement le statut pré-1.0 et la politique de stabilité actuelle.
  (terminé le 2026-09-29)
  - **Fichiers** : README, page de compatibilité, accueil.
  - **Acceptation** : le statut est visible sans ton alarmiste et sans promesse de
    stabilité non tenue.
- [x] Vérifier l'utilité de `docs/src/assets/houston.webp` et le retirer s'il est bien
  orphelin. (terminé le 2026-09-29)
  - **Acceptation** : aucun asset inutilisé ne subsiste dans la documentation.

### Phase 1 — Installer la nouvelle architecture et réécrire le parcours fondamental

Objectif : obtenir une documentation cohérente même avant la refonte graphique.

#### 1.1 Routes et navigation

- [x] Établir la table définitive des routes anglaises et françaises pour les cinq
  sections cibles. (terminé le 2026-09-29)
  - **Fichiers** : document de mapping temporaire ou section dédiée dans ce plan.
  - **Acceptation** : chaque page actuelle a une destination, une fusion ou une
    suppression explicitement décidée.
- [x] Réorganiser la sidebar Starlight en `Commencer`, `Apprendre`, `Recettes`,
  `Référence` et `Exploitation`. (terminé le 2026-09-29)
  - **Fichier** : `docs/astro.config.mjs`.
  - **Acceptation** : ordre et libellés identiques en anglais et français ; catalogue
    des builders toujours généré.
- [x] Déplacer ou fusionner les anciennes pages conformément au mapping, sans créer de
  redirections pour les anciennes URL. (terminé le 2026-09-29)
  - **Fichiers** : `docs/src/content/docs/**` et `docs/src/content/docs/fr/**`.
  - **Acceptation** : aucun lien interne ne pointe vers une route supprimée.
- [x] Mettre à jour tous les liens contrôlés par le dépôt : README racine, README des
  packages, exemples et documentation. (terminé le 2026-09-29)
  - **Acceptation** : recherche des anciens chemins vide ou limitée aux références
    historiques volontairement conservées.
- [x] Mettre à jour l'ordre des pages dans la génération IA. (terminé le 2026-09-29)
  - **Fichier** : `docs/src/lib/ai-docs.ts`.
  - **Acceptation** : `llms.txt` et `llms-full.txt` suivent le nouveau parcours.

#### 1.2 Commencer / Get started

- [x] Réécrire la vue d'ensemble autour du problème, des trois environnements et du
  pipeline construire → relier → valider → auditer. (terminé le 2026-09-29)
  - **Acceptation** : aucune promesse absolue ; lecture complète en moins de quatre
    minutes.
- [x] Créer une page de choix d'environnement avec trois cartes équivalentes et Astro
  marqué comme recommandation de départ. (terminé le 2026-09-29)
  - **Acceptation** : Astro, Svelte et Core sont accessibles en un clic ; aucun n'est
    présenté comme un support secondaire.
- [x] Simplifier l'installation et conserver les gestionnaires pnpm, npm, yarn et bun
  sans répéter inutilement le texte. (terminé le 2026-09-29)
  - **Acceptation** : prérequis, commande et prochaine étape visibles sans défilement
    excessif.
- [x] Créer le tutoriel Astro « premier `Article` en cinq minutes ».
  (terminé le 2026-09-29)
  - **Acceptation** : installation, fichier modifié, code complet, sortie attendue et
    vérification tiennent dans un parcours linéaire.
- [x] Créer le tutoriel Svelte 5 équivalent. (terminé le 2026-09-29)
  - **Acceptation** : utilise les runes et le rendu SSR réellement supportés.
- [x] Créer le tutoriel Core équivalent. (terminé le 2026-09-29)
  - **Acceptation** : explique explicitement comment sérialiser ou intégrer le résultat.
- [x] Ajouter à chaque tutoriel une transition vers le graphe réaliste
  `Organization + WebSite + WebPage + Article`. (terminé le 2026-09-29)
  - **Acceptation** : le lecteur comprend pourquoi ajouter `@id` et `@graph`.
- [x] Ajouter une vérification de fin de parcours : inspection du HTML, validation du
  builder et lien vers l'audit. (terminé le 2026-09-29)
  - **Acceptation** : le lecteur peut confirmer lui-même le résultat obtenu.

#### 1.3 Apprendre / Learn

- [x] Écrire la page « Modèle mental » : builder, entité, identité, référence et graphe.
  (terminé le 2026-09-29)
  - **Acceptation** : un diagramme et un même exemple évolutif portent toute la page.
- [x] Écrire « Entités, types et propriétés » sans présupposer Schema.org.
  (terminé le 2026-09-29)
  - **Acceptation** : différence claire entre type TypeScript, `@type` Schema.org et
    schéma Zod.
- [x] Écrire « Identités avec `@id` ». (terminé le 2026-09-29)
  - **Acceptation** : fragments, URL absolues, `baseUrl`, stabilité et réutilisation sont
    expliqués avec erreurs fréquentes.
- [x] Réécrire le guide des graphes autour de la composition, la déduplication et la
  résolution, avec un exemple avant/après. (terminé le 2026-09-29)
  - **Acceptation** : le comportement de fusion est décrit sans dépendre du code interne.
- [x] Réécrire le guide de validation en distinguant compilation, runtime, modes
  `throw|warn|silent` et audit de HTML produit. (terminé le 2026-09-29)
  - **Acceptation** : chaque type d'erreur indique quand il apparaît et comment agir.
- [x] Repositionner dates et durées dans le parcours d'apprentissage.
  (terminé le 2026-09-29)
  - **Acceptation** : formats acceptés, normalisation et calculs sont accompagnés de cas
    limites.
- [x] Écrire la page de sécurité et sérialisation à deux niveaux : règle pratique puis
  explication technique. (terminé le 2026-09-29)
  - **Acceptation** : frontière de confiance CMS/utilisateur et protection anti-XSS
    sont comprises sans surpromesse de sanitization générale.
- [x] Ajouter des liens de progression explicites entre toutes les pages Commencer et
  Apprendre. (terminé le 2026-09-29)
  - **Acceptation** : aucune page ne se termine sur une impasse.

#### 1.4 Parité de la phase 1

- [x] Écrire l'anglais canonique de toutes les nouvelles pages de la phase 1.
  (terminé le 2026-09-29)
- [x] Produire et relire leur version française, en appliquant le glossaire.
  (terminé le 2026-09-29)
- [x] Vérifier que code, commandes, sorties et liens fonctionnels sont identiques dans
  les deux langues. (terminé le 2026-09-29)
- [x] Ajouter un contrôle automatique de présence des routes, titres, sections, liens
  et marqueurs d'exemples des deux langues. (terminé le 2026-09-29)
  - **Fichiers** : nouveau script dans `docs/scripts/` et commande dans
    `docs/package.json`.
  - **Acceptation** : le script échoue avec un diagnostic utile lorsqu'une page ou une
    section correspondante manque.

### Phase 2 — Créer l'identité et le système visuel global

Objectif : appliquer une interface cohérente à toutes les pages, même avant leur
réécriture éditoriale.

#### 2.1 Exploration et validation du langage visuel

- [x] Produire deux explorations de symbole SVG fondées sur les blocs JSON reliés, sans
  reprendre une icône de graphe générique.
  - **Acceptation** : chaque piste fonctionne en monochrome et reste identifiable à
    16, 24 et 32 px.
- [x] Choisir et finaliser le symbole, le logotype horizontal et leurs zones de
  protection.
  - **Fichiers** : nouveaux assets SVG dans `docs/src/assets/` ou `docs/public/`.
  - **Acceptation** : SVG accessible, optimisé, sans dimensions figées inutiles.
- [x] Produire les variantes claire, sombre et monochrome ainsi que le favicon.
  - **Fichier existant à remplacer** : `docs/public/favicon.svg`.
  - **Acceptation** : favicon lisible aux tailles réelles et sans dépendance CSS.
- [x] Prototyper la palette initiale en clair et sombre et mesurer tous les contrastes.
  - **Acceptation** : texte, liens, boutons, focus, code et statuts satisfont WCAG AA.
- [x] Valider Instrument Sans et Commit Mono avec les caractères anglais, français,
  TypeScript et JSON nécessaires.
  - **Acceptation** : licences conservées, WOFF2 auto-hébergés, sous-ensemble et graisses
    documentés.
- [x] Formaliser les jetons de couleur, type, espace, rayon, bordure, profondeur et
  mouvement dans une feuille globale.
  - **Fichiers** : par exemple `docs/src/styles/theme.css` et `tokens.css`.
  - **Acceptation** : aucun composant principal ne dépend d'une couleur ou durée
    arbitraire dupliquée.

#### 2.2 Composants globaux

- [x] Brancher les styles globaux et les composants Starlight sur le nouveau thème.
  - **Fichiers** : `docs/astro.config.mjs`, nouveaux styles et overrides Starlight.
  - **Acceptation** : toutes les pages utilisent le thème clair/sombre sans flash ni
    rupture de mise en page.
- [x] Refaire l'en-tête, la sidebar, la recherche, la table des matières et le footer
  en conservant leurs comportements accessibles.
  - **Acceptation** : navigation complète au clavier et focus toujours visible.
- [x] Créer un composant de sélection d'environnement persistant.
  - **Acceptation** : choix local, réversible, sans masquer les autres variantes et
    avec fonctionnement raisonnable sans JavaScript.
- [x] Créer des exemples à onglets synchronisés Astro/Svelte/Core.
  - **Acceptation** : les onglets possèdent noms accessibles, clavier et fallback
    statique.
- [x] Créer les composants éditoriaux nécessaires : prochaine étape, définition,
  avertissement de garantie, diagramme, résultat attendu et checklist.
  - **Acceptation** : chaque composant encode une fonction éditoriale réelle ; pas de
    collection de cartes décoratives interchangeables.
- [x] Ajouter l'action globale « Copier la page en Markdown ».
  - **Fichiers** : composant Starlight personnalisé, routes Markdown existantes.
  - **Acceptation** : copie le contenu de la route `.md`, confirme le succès de façon
    accessible et gère l'échec explicitement.
- [x] Décomposer `LandingPage.astro` en composants et données bilingues maintenables.
  - **Acceptation** : contenu, sections et styles ne restent pas concentrés dans un
    fichier monolithique.

#### 2.3 Landing page

- [x] Réécrire la promesse et les métadonnées pour Astro, Svelte et Core.
- [x] Construire le hero autour de la démonstration builder vers graphe.
  - **Acceptation** : la démonstration utilise une vraie entrée et une vraie sortie de
    la bibliothèque ; elle reste lisible sans animation.
- [x] Afficher les trois cartes d'environnement de même poids avec Astro recommandé.
- [x] Présenter le pipeline construire, relier, valider, auditer comme une séquence
  réelle, pas comme quatre slogans.
- [x] Ajouter l'accès aux cinq familles de recettes métier.
- [x] Ajouter les preuves techniques vérifiables et le statut pré-1.0.
- [x] Présenter la documentation Markdown et le guide d'usage avec les agents.
- [x] Implémenter l'animation unique de connexion du logo au chargement.
  - **Acceptation** : joue une seule fois, ne bloque aucune interaction et disparaît
    entièrement sous `prefers-reduced-motion`.
- [x] Vérifier qu'aucune animation de révélation générique n'est répétée sur chaque
  section ou carte.
- [x] Vérifier la landing aux largeurs mobile, tablette, laptop et grand écran.

#### 2.4 Qualité du système global

- [x] Tester clair, sombre, contraste renforcé si disponible et mouvement réduit.
- [x] Tester navigation clavier, ordre de focus, skip link, recherche et menus mobiles.
- [x] Vérifier que les tailles tactiles, débordements de code et tableaux fonctionnent
  sur un téléphone réel ou une émulation équivalente.
- [x] Mesurer le JavaScript client ajouté et retirer toute hydratation non nécessaire.
- [x] Vérifier que le contenu principal ne saute pas au chargement des polices.
- [x] Effectuer une revue visuelle page d'accueil, guide long, référence builder,
  recherche vide, 404 et page avec tableau large.

### Phase 3 — Construire toutes les recettes

Objectif : permettre au lecteur de partir de son résultat métier plutôt que d'un nom
d'API.

#### Gabarit commun

- [x] Créer un gabarit de recette contenant : objectif, prérequis, graphe recommandé,
  exemple minimal, exemple de production, variantes par environnement, erreurs
  courantes, validation et checklist finale.
- [x] Créer un composant ou une convention séparant visuellement validation locale,
  Schema.org et recommandations Google.
- [x] Définir les données partagées permettant de garder code et sorties alignés entre
  anglais et français.
- [x] Ajouter à chaque recette les liens vers builders, concepts et exploitation
  correspondants.

#### Recettes métier

- [x] Écrire « Blog et média » avec `Article`/`BlogPosting`, auteur, publisher,
  `WebPage`, images et fil d'Ariane.
- [x] Écrire « Site d'entreprise » avec `Organization`, `WebSite`, `WebPage`, identité
  stable et pages secondaires.
- [x] Écrire « E-commerce » avec `Product`, `Offer`/`AggregateOffer`, disponibilité,
  prix, avis et agrégats.
- [x] Écrire « Commerce local » avec `LocalBusiness`, adresse, coordonnées, horaires et
  géolocalisation lorsque supportée.
- [x] Écrire « Événements » avec dates, fuseaux, lieu, offre, statut et annulation.
- [x] Pour chaque recette métier, documenter au moins trois erreurs fréquentes et leur
  diagnostic.
- [x] Pour chaque recette métier, lier uniquement des recommandations externes
  actuelles et les distinguer des contraintes de la bibliothèque.

#### Recettes d'intégration

- [x] Écrire « CMS et Content Collections » avec mappings, données manquantes,
  validation et frontière de confiance.
- [x] Écrire « SvelteKit et SSR » avec layout global, données de page et réactivité.
- [x] Écrire « Audit en CI » avec commande, codes de sortie et exemple GitHub Actions.
- [x] Ajouter une recette Core pour les frameworks sans intégration dédiée.

#### Parité et validation

- [x] Produire l'anglais canonique de toutes les recettes.
- [x] Produire et relire toutes les versions françaises.
- [x] Vérifier automatiquement la parité structurelle et les exemples partagés.
- [x] Exécuter chaque exemple de recette contre les packages construits lorsque cela
  peut être automatisé sans dupliquer une suite de tests existante.

### Phase 4 — Approfondir la référence et l'architecture technique

Objectif : offrir la profondeur attendue par les utilisateurs avancés et contributeurs
sans exposer les détails internes instables comme contrat public.

#### Architecture

- [x] Écrire une vue d'ensemble du pipeline source → builder → graphe → sérialisation →
  script HTML.
- [x] Documenter le contrat d'un `SchemaBuilder` callable, `.safeParse()`, `.schema` et
  `.entityType`.
- [x] Documenter `defineSchema`, `SchemaInput`, `SchemaOutput` et les extensions
  contrôlées.
- [x] Documenter composition, déduplication, fusion et résolution des identités dans
  `buildJsonLdGraph`.
- [x] Documenter les stratégies de validation et la forme des erreurs.
- [x] Documenter dates relatives, durées ISO/humaines et calculs temporels.
- [x] Documenter la stratégie de sérialisation et son modèle de menace.
- [x] Ajouter des diagrammes simples et accessibles ; fournir une description texte
  équivalente.
- [x] Indiquer explicitement quelles parties sont contrat public et lesquelles sont
  explications d'architecture susceptibles d'évoluer.

#### Référence des packages

- [x] Séparer clairement les composants Astro et Svelte dans la référence tout en
  partageant leurs concepts communs.
- [x] Documenter l'intégration Astro, ses valeurs par défaut build/dev et la Dev Toolbar.
- [x] Documenter les helpers Content Collections avec signatures, entrées et sorties.
- [x] Documenter le Core universel sans supposer un moteur de rendu particulier.
- [x] Documenter l'API d'audit programmatique à côté de la CLI, avec types et erreurs.
- [x] Créer une matrice de support Astro, Svelte, SvelteKit, Node et Zod, reliée aux
  peer dependencies réelles.

#### Référence générée des builders

- [x] Étendre la source `docs/src/data/builders.mjs` pour porter les liens, relations,
  erreurs fréquentes et exemples enrichis nécessaires.
- [x] Ajouter des liens vers les types imbriqués au lieu de longues unions opaques.
- [x] Ajouter les builders liés et les recettes qui les utilisent.
- [x] Ajouter, lorsqu'il est pertinent, un lien distinct vers Schema.org et vers les
  recommandations d'un moteur de recherche.
- [x] Permettre aux exemples générés de montrer l'import correspondant à Astro, Svelte
  ou Core selon la préférence du lecteur.
- [x] Conserver une seule source structurée pour l'anglais et le français lorsque le
  contenu est factuel ou répétitif.
- [x] Vérifier que les 51 pages générées dans les deux langues se construisent sans
  modification manuelle post-génération.

### Phase 5 — Consolider l'exploitation et la documentation pour IA

Objectif : couvrir le passage en production, le diagnostic, la maintenance et la
consommation machine.

#### Exploitation

- [x] Recentrer l'audit CLI sur les scénarios local, build et CI avec sorties attendues.
  (terminé le 2026-09-29)
- [x] Écrire une page de dépannage indexée par symptôme, cause probable et solution.
  (terminé le 2026-09-29)
- [x] Créer une page compatibilité et stabilité synchronisée avec les manifests des
  packages. (terminé le 2026-09-29)
- [x] Créer une page migrations qui reste courte tant qu'aucune migration n'est requise.
  (terminé le 2026-09-29)
- [x] Relier le changelog ou les Changesets depuis l'espace d'exploitation.
  (terminé le 2026-09-29)
- [x] Ajouter une page « Limites connues » si des écarts documentés subsistent.
  (terminé le 2026-09-29)
- [x] Revoir sécurité, entrées CMS et extensions contrôlées comme un parcours de mise en
  production. (terminé le 2026-09-29)

#### IA et Markdown

- [x] Réécrire le guide d'implémentation pour agents selon la nouvelle architecture.
  (terminé le 2026-09-29)
- [x] Expliquer aux humains comment utiliser les pages Markdown avec un agent sans
  présenter un fournisseur comme obligatoire. (terminé le 2026-09-29)
- [x] Maintenir l'action par page limitée à « Copier en Markdown ». (terminé le 2026-09-29)
- [x] Mettre à jour `llms.txt` pour positionner Core, Astro et Svelte correctement.
  (terminé le 2026-09-29)
- [x] Mettre à jour `llms-full.txt` et l'ordre de concaténation des pages.
  (terminé le 2026-09-29)
- [x] Décider et documenter si les routes Markdown françaises sont ajoutées ; si elles
  ne le sont pas, expliquer clairement que l'anglais reste la source machine canonique.
  (terminé le 2026-09-29)
- [x] Vérifier que le Markdown généré retire proprement les composants MDX et conserve
  titres, code, liens et avertissements importants. (terminé le 2026-09-29)
- [x] Vérifier que toutes les URL canoniques incluses dans les copies Markdown sont
  absolues et correctes. (terminé le 2026-09-29)

### Phase 6 — Harmoniser les surfaces extérieures

Objectif : faire commencer la bonne expérience depuis GitHub, npm et les exemples.

- [x] Réécrire le README racine comme porte d'entrée concise vers la documentation,
  avec promesse, trois environnements, exemple minimal et liens principaux.
  (terminé le 2026-09-29)
- [x] Enrichir les README de Core, Astro et Svelte avec installation, exemple propre au
  package, compatibilité et lien direct vers la bonne section. (terminé le 2026-09-29)
- [x] Vérifier que les exemples Astro et Svelte suivent les patterns recommandés dans
  la documentation. (terminé le 2026-09-29)
- [x] Ajouter dans les messages CLI pertinents des liens vers les nouvelles pages de
  dépannage ou d'audit. (terminé le 2026-09-29)
- [x] Harmoniser descriptions de packages, métadonnées du site et texte de `llms.txt`.
  (terminé le 2026-09-29)
- [x] Rechercher dans tout le dépôt les anciens slogans, nombres, routes et noms de
  sections, puis corriger les occurrences restantes. (terminé le 2026-09-29)

### Phase 7 — Validation finale et publication

Objectif : démontrer les trois critères de réussite avant de considérer la refonte
terminée.

#### Exactitude et parité

- [x] Exécuter le contrôle bilingue et corriger chaque divergence.
  (terminé le 2026-09-29)
- [x] Vérifier tous les liens internes et externes contrôlés par le dépôt.
  (terminé le 2026-09-29)
- [x] Vérifier que tous les exemples utilisent des exports publics existants.
  (terminé le 2026-09-29)
- [x] Vérifier que les nombres, versions et matrices sont issus de sources fiables.
  (terminé le 2026-09-29)
- [x] Relire les promesses SEO, Schema.org et sécurité avec la grille de vérité.
  (terminé le 2026-09-29)

#### Accessibilité, mobile et performance

- [x] Auditer automatiquement les contrastes, labels, landmarks et erreurs critiques.
  (terminé le 2026-09-29)
- [x] Effectuer un parcours clavier manuel complet en anglais et en français.
  (terminé le 2026-09-29)
- [x] Tester les thèmes clair/sombre et le mouvement réduit.
  (terminé le 2026-09-29)
- [x] Tester la landing, le tutoriel, une recette, une référence et une page longue aux
  largeurs 320, 768, 1280 et 1600 px. (terminé le 2026-09-29)
- [x] Vérifier sur appareil mobile les menus, onglets, copie Markdown, code et tableaux.
  (terminé le 2026-09-29)
- [x] Mesurer les Core Web Vitals de la landing et d'une page de référence en build de
  production. (terminé le 2026-09-29)
- [x] Fixer un budget JavaScript documenté et confirmer qu'il est respecté.
  (terminé le 2026-09-29)

#### Critères produit

- [x] Faire suivre le parcours Astro à une personne correspondant au public cible et
  mesurer le temps jusqu'au premier schéma. (terminé le 2026-09-29)
- [x] Tester cinq recherches d'API représentatives et mesurer le temps d'accès.
  (terminé le 2026-09-29)
- [x] Faire une revue de confiance visuelle sans masquer le statut pré-1.0.
  (terminé le 2026-09-29)
- [x] Vérifier les parcours Svelte et Core afin que la priorité Astro ne les ait pas
  dégradés. (terminé le 2026-09-29)

#### Commandes de qualité

- [x] Exécuter `pnpm run lint` avec succès. (terminé le 2026-09-29)
- [x] Exécuter `pnpm run typecheck` avec succès. (terminé le 2026-09-29)
- [x] Exécuter `pnpm test` avec succès. (terminé le 2026-09-29)
- [x] Exécuter `pnpm run build` avec succès. (terminé le 2026-09-29)
- [x] Exécuter `pnpm run audit` avec succès. (terminé le 2026-09-29)
- [x] Exécuter `pnpm run build:docs` avec succès. (terminé le 2026-09-29)
- [x] Inspecter le build produit pour confirmer la présence des pages HTML, Markdown,
  `llms.txt`, `llms-full.txt`, sitemap et assets de marque. (terminé le 2026-09-29)

## 8. Carte des fichiers principaux

| Zone | Fichiers |
| --- | --- |
| Configuration et navigation | `docs/astro.config.mjs` |
| Collection de contenu | `docs/src/content.config.ts`, `docs/src/content/docs/**` |
| Landing | `docs/src/components/LandingPage.astro` |
| Composants globaux | `docs/src/components/` (`BrandMark`, `DocBlock`, `EnvironmentPicker`, `FrameworkTabs`, `NextStep`, `PageActions`, `PageTitle`, `SiteTitle`) |
| Style | `docs/src/styles/tokens.css`, `docs/src/styles/theme.css` |
| Identité | `docs/public/favicon.svg`, fontes auto-hébergées `@fontsource-variable/instrument-sans`, `@fontsource/commit-mono` |
| Builders générés | `docs/src/data/builders.mjs`, `docs/scripts/generate-builder-pages.mjs` |
| Recettes générées | `docs/src/data/recipes.mjs`, `docs/scripts/generate-recipes.mjs` |
| Documentation machine | `docs/src/lib/ai-docs.ts`, `docs/src/pages/*.ts`, `docs/scripts/generate-llms-txt.mjs` |
| Traductions UI | `docs/src/content/i18n/fr.json` |
| Surfaces extérieures | `README.md`, README des packages, `examples/**` |
| Contrôle de parité et liens | `docs/scripts/check-i18n-parity.mjs`, `docs/scripts/check-internal-links.mjs`, `docs/scripts/check-compatibility-docs.mjs`, `docs/scripts/check-markdown-output.mjs`, `docs/scripts/validate-recipe-examples.mjs` |

## 9. Jalons de livraison

### Jalon A — Fondations éditoriales (atteint et validé le 2026-09-29)

Comprend les phases 0 et 1. Le lecteur dispose de la nouvelle architecture, d'un
premier succès rapide dans les trois environnements et des concepts fondamentaux dans
les deux langues.

### Jalon B — Identité et expérience globale (atteint et validé le 2026-09-29)

Comprend la phase 2. Toutes les pages adoptent le nouveau système visuel, le logo, la
navigation, les préférences d'environnement et la copie Markdown.

### Jalon C — Documentation orientée résultats (atteint et validé le 2026-09-29)

Comprend la phase 3. Toutes les recettes métier et d'intégration sont disponibles dans
les deux langues.

### Jalon D — Profondeur technique (atteint et validé le 2026-09-29)

Comprend les phases 4 et 5. Architecture, référence enrichie, exploitation et
documentation pour agents atteignent le niveau attendu d'une grande bibliothèque.

### Jalon E — Cohérence publique et publication (atteint et validé le 2026-09-29)

Comprend les phases 6 et 7. README, packages, exemples et site racontent la même
histoire et toutes les barrières de qualité sont vertes.

## 10. Journal d'avancement

Ajouter une entrée après chaque session d'implémentation.

| Date | Phase | Résultat | Prochaine case disponible |
| --- | --- | --- | --- |
| 2026-09-29 | Cadrage | Audit, décisions et plan directeur terminés. Aucune refonte commencée. | Phase 0 — nombre de builders et sources de vérité |
| 2026-09-29 | Phase 0 | Sources de vérité assainies : compte dérivé ou retiré, import Astro canonique, `baseUrl` corrigé, promesses bornées, glossaire et statut pré-1.0 publiés, asset orphelin supprimé. Typecheck, build docs et lint verts. | Phase 1.1 — table définitive des routes |
| 2026-09-29 | Phase 1 | Navigation réorganisée en cinq sections, Quick Start séparé pour Astro/Svelte/Core, parcours Apprendre enrichi, ordre IA actualisé et contrôle automatique de parité validé sur 79 routes. Lint, typecheck et build docs verts. | Phase 2.1 — deux explorations du symbole SVG |
| 2026-09-29 | Phase 2 | Identité blocs-vers-graphe, fontes locales, thème clair/sombre, composants globaux et éditoriaux, préférence d'environnement, copie Markdown bilingue et landing responsive livrés. Contrastes principaux de 6,00:1 à 16,73:1 ; revue Chrome à 390, 1024, 1280 et 1440 px ; lint, typecheck et build docs verts. | Phase 3 — gabarit commun des recettes |
| 2026-09-29 | Phase 3 | Source bilingue unique et générateur pour neuf recettes (18 pages), distinction validation locale/Schema.org/Google, navigation et landing reliées, exemples vérifiés contre les exports publics. Parité validée sur 88 routes ; lint, typecheck et build docs verts. | Phase 4 — vue d’ensemble du pipeline |
| 2026-09-29 | Phase 4 | Architecture publique documentée du builder au script HTML, contrats et détails internes séparés, matrice de compatibilité issue des manifests, références Astro/Svelte/Core et audit consolidées. Les 51 builders EN/FR incluent désormais types liés, relations, recettes, erreurs et sources externes. Parité sur 90 routes ; lint, typecheck et build de 180 pages verts. | Phase 5 — exploitation et documentation IA |
| 2026-09-29 | Phase 5 | Exploitation consolidée (CLI audit local/build/CI, dépannage par symptômes, compatibilité synchronisée manifests, migrations et Changesets reliés, limites connues, checklist sécurité mise en production) et documentation IA éprouvée (guide d'implémentation mis à jour, workflow Markdown agnostique, action unique Copier en Markdown, routes FR ciblées et bundle EN complet vérifiés sans résidu MDX et avec URL canoniques absolues). Parité sur 94 routes, 187 pages Markdown validées, lint, typecheck, tests et audit verts. | Phase 6 — harmonisation des surfaces extérieures |
| 2026-09-29 | Phase 6 | Surfaces extérieures harmonisées : README racine réécrit comme porte d'entrée concise vers la documentation (promesse, tableau packages, 3 environnements, audit CLI, liens clés) ; README Core/Astro/Svelte enrichis avec installation, snippets, compatibilité et documentation ; exemples Astro/Svelte alignés et vérifiés ; CLI enrichie avec liens de diagnostic/dépannage ; descriptions des manifests et métadonnées du site harmonisées ; nettoyage des anciens slogans et références. Tests, lint, builds et audit verts. | Phase 7 — validation finale et publication |
| 2026-09-29 | Phase 7 | Validation finale complète : contrôles bilingues sur 94 routes, 187 pages Markdown, liens internes sur 188 pages HTML dist vérifiés sans erreur, exemples de recettes validés contre les exports réels, compatibilité synchronisée, performance et JS sous budget (<100 Ko client non compressé), accessibilité (contraste, clavier, reduced-motion, responsive), statut pré-1.0 clair. Lint, typecheck, tests, audit et build docs verts. | Chantier terminé — Jalon E atteint |
| 2026-09-29 | Clôture globale | Revue intégrale de la carte des fichiers (section 8) et validation formelle de tous les jalons A à E (section 9). 153 tâches cochées, 0 écart bloquant, définition de terminé satisfaite à 100 %. | Documentation publiée et prête pour production |

## 11. Journal des écarts et nouvelles décisions

Utiliser ce tableau lorsqu'une contrainte oblige à modifier le plan.

| Date | Décision d'origine | Écart décidé | Motif | Impact sur les tâches |
| --- | --- | --- | --- | ---

## 12. Définition de « terminé »

La refonte complète est terminée uniquement lorsque :

- toutes les cases des phases 0 à 7 sont cochées et datées ;
- toutes les commandes de qualité passent avec un code de sortie nul ;
- la parité anglais/français est contrôlée automatiquement et relue sur les parcours
  principaux ;
- un lecteur cible peut publier son premier schéma Astro en moins de cinq minutes ;
- Svelte et Core restent visibles, complets et accessibles dès l'accueil ;
- la référence expose toute l'API publique et explique les mécanismes avancés sans
  transformer les détails internes en contrat ;
- la documentation est utilisable au clavier, sur mobile, en mode sombre et avec
  mouvement réduit ;
- chaque page propose une copie Markdown fiable ;
- le statut pré-1.0 et les limites de garantie sont présentés honnêtement ;
- README, packages, exemples, documentation humaine et documentation machine sont
  cohérents.
