export const recipeGroups = [
  {
    label: 'Business outcomes',
    labelFr: 'Résultats métier',
    recipes: [
      {
        slug: 'blog-media',
        title: 'Blog & media',
        titleFr: 'Blog et média',
        builders: [
          'Article',
          'BlogPosting',
          'Person',
          'Organization',
          'WebPage',
          'ImageObject',
          'BreadcrumbList',
        ],
        primary: 'Article',
        goal: 'Publish an article graph with a stable author, publisher, page, image, and breadcrumb trail.',
        goalFr:
          'Publier un graphe d’article avec auteur, éditeur, page, image et fil d’Ariane stables.',
        production:
          'Give every reusable identity an absolute or resolvable `@id`. Keep the visible headline, dates, author, and images identical to the page content.',
        productionFr:
          'Donnez un `@id` absolu ou résolvable à chaque identité réutilisable. Gardez titre, dates, auteur et images identiques au contenu visible.',
        errors: [
          'Missing one of headline, image, datePublished, or author',
          'Using a publisher name where a stable Organization reference is needed',
          'Marking content that is not visible on the page',
        ],
        errorsFr: [
          'Oublier headline, image, datePublished ou author',
          'Utiliser un nom de publisher sans référence Organization stable',
          'Baliser du contenu absent de la page',
        ],
        schema: 'https://schema.org/Article',
        google: 'https://developers.google.com/search/docs/appearance/structured-data/article',
      },
      {
        slug: 'company-site',
        title: 'Company site',
        titleFr: 'Site d’entreprise',
        builders: ['Organization', 'WebSite', 'WebPage'],
        primary: 'Organization',
        goal: 'Describe one organization once and reference it from the website and its pages.',
        goalFr: 'Décrire une organisation une fois puis la référencer depuis le site et ses pages.',
        production:
          'Place the canonical Organization and WebSite nodes in the global layout; add a distinct WebPage node for each canonical page URL.',
        productionFr:
          'Placez les nœuds Organization et WebSite canoniques dans le layout global ; ajoutez un WebPage distinct pour chaque URL canonique.',
        errors: [
          'Changing the organization @id between pages',
          'Using relative identifiers without a baseUrl',
          'Creating a second full Organization node for every page',
        ],
        errorsFr: [
          'Changer l’@id de l’organisation selon la page',
          'Utiliser des identifiants relatifs sans baseUrl',
          'Recréer un nœud Organization complet sur chaque page',
        ],
        schema: 'https://schema.org/Organization',
      },
      {
        slug: 'ecommerce',
        title: 'E-commerce',
        titleFr: 'E-commerce',
        builders: ['Product', 'Offer', 'AggregateOffer', 'Review', 'AggregateRating'],
        primary: 'Product',
        goal: 'Represent one purchasable product with current price, availability, and evidence-backed ratings.',
        goalFr: 'Représenter un produit achetable avec prix, disponibilité et notes justifiées.',
        production:
          'Choose Offer for one purchasable price and AggregateOffer for a genuine range. Refresh price and availability with the page data.',
        productionFr:
          'Choisissez Offer pour un prix achetable et AggregateOffer pour une vraie fourchette. Synchronisez prix et disponibilité avec la page.',
        errors: [
          'Price or availability differs from visible content',
          'Using AggregateOffer for a single price',
          'Publishing ratings that are not collected and shown by the site',
        ],
        errorsFr: [
          'Prix ou disponibilité différents du contenu visible',
          'Utiliser AggregateOffer pour un prix unique',
          'Publier des notes non collectées et non affichées par le site',
        ],
        schema: 'https://schema.org/Product',
        google: 'https://developers.google.com/search/docs/appearance/structured-data/product',
      },
      {
        slug: 'local-business',
        title: 'Local business',
        titleFr: 'Commerce local',
        builders: ['LocalBusiness', 'PostalAddress', 'GeoCoordinates'],
        primary: 'LocalBusiness',
        goal: 'Describe a real business location with contact details, opening hours, and optional verified coordinates.',
        goalFr:
          'Décrire un établissement réel avec coordonnées, horaires et géolocalisation vérifiée facultative.',
        production:
          'Use one node per physical location. Add geo only from a trusted source and keep opening hours aligned with customer-facing information.',
        productionFr:
          'Utilisez un nœud par établissement physique. Ajoutez geo uniquement depuis une source fiable et synchronisez les horaires affichés.',
        errors: [
          'Combining several branches into one LocalBusiness',
          'Guessing latitude or longitude',
          'Publishing stale or malformed opening hours',
        ],
        errorsFr: [
          'Fusionner plusieurs établissements dans un LocalBusiness',
          'Deviner latitude ou longitude',
          'Publier des horaires périmés ou mal formés',
        ],
        schema: 'https://schema.org/LocalBusiness',
        google:
          'https://developers.google.com/search/docs/appearance/structured-data/local-business',
      },
      {
        slug: 'events',
        title: 'Events',
        titleFr: 'Événements',
        builders: ['Event', 'Offer', 'PostalAddress'],
        primary: 'Event',
        goal: 'Publish one event occurrence with explicit dates, venue, ticket offer, and lifecycle status.',
        goalFr:
          'Publier une occurrence avec dates, lieu, offre et statut de cycle de vie explicites.',
        production:
          'Use ISO 8601 offsets when the local time zone matters. On cancellation, retain the event URL and set eventStatus instead of deleting the node.',
        productionFr:
          'Utilisez un décalage ISO 8601 lorsque le fuseau importe. En cas d’annulation, conservez l’URL et changez eventStatus.',
        errors: [
          'Omitting the time-zone offset for a timed event',
          'Putting the event name in location.name',
          'Deleting a cancelled event instead of updating its status',
        ],
        errorsFr: [
          'Oublier le décalage de fuseau pour un horaire précis',
          'Mettre le nom de l’événement dans location.name',
          'Supprimer un événement annulé au lieu de mettre son statut à jour',
        ],
        schema: 'https://schema.org/Event',
        google: 'https://developers.google.com/search/docs/appearance/structured-data/event',
      },
    ],
  },
  {
    label: 'Integration recipes',
    labelFr: 'Recettes d’intégration',
    recipes: [
      {
        slug: 'cms-content-collections',
        title: 'CMS & Content Collections',
        titleFr: 'CMS et Content Collections',
        builders: ['Article'],
        primary: 'Article',
        goal: 'Map untrusted CMS entries into explicit builder inputs at one validation boundary.',
        goalFr:
          'Mapper les entrées CMS non fiables vers des entrées explicites à une frontière de validation.',
        production:
          'Validate collection shape first, map only known fields, then call `safeParse()` and surface diagnostics with the entry identifier.',
        productionFr:
          'Validez d’abord la collection, mappez uniquement les champs connus, puis appelez `safeParse()` et associez les erreurs à l’identifiant.',
        errors: [
          'Spreading the complete CMS object into a strict builder',
          'Silently replacing missing required data',
          'Trusting rich text or URLs without validation',
        ],
        errorsFr: [
          'Déverser tout l’objet CMS dans un builder strict',
          'Remplacer silencieusement une donnée obligatoire absente',
          'Faire confiance au texte riche ou aux URL sans validation',
        ],
        schema: 'https://docs.astro.build/en/guides/content-collections/',
      },
      {
        slug: 'sveltekit-ssr',
        title: 'SvelteKit & SSR',
        titleFr: 'SvelteKit et SSR',
        builders: ['Article', 'Organization'],
        primary: 'Article',
        goal: 'Render page-specific JSON-LD during SSR while keeping shared identities in layout data.',
        goalFr:
          'Rendre le JSON-LD propre à la page en SSR tout en gardant les identités partagées dans le layout.',
        production:
          'Return serializable source data from load functions, build entities close to the component, and use reactive values only when content actually changes client-side.',
        productionFr:
          'Retournez des données sérialisables depuis load, construisez les entités près du composant et réservez la réactivité aux contenus réellement changeants.',
        errors: [
          'Building browser-only values during SSR',
          'Duplicating the global organization in every route',
          'Expecting client navigation to fix invalid server output',
        ],
        errorsFr: [
          'Construire des valeurs réservées au navigateur pendant le SSR',
          'Dupliquer l’organisation globale dans chaque route',
          'Attendre de la navigation cliente qu’elle corrige un rendu serveur invalide',
        ],
        schema: 'https://svelte.dev/docs/kit/load',
      },
      {
        slug: 'audit-ci',
        title: 'Audit in CI',
        titleFr: 'Audit en CI',
        builders: ['Article'],
        primary: 'Article',
        goal: 'Fail a deployment when generated HTML contains malformed or structurally invalid JSON-LD.',
        goalFr:
          'Faire échouer un déploiement lorsque le HTML généré contient un JSON-LD mal formé ou invalide.',
        production:
          'Build first, audit the actual output directory, preserve the CLI exit code, and upload the build artifact when diagnosis is needed.',
        productionFr:
          'Compilez d’abord, auditez le vrai dossier de sortie, conservez le code de sortie et archivez le build pour le diagnostic.',
        errors: [
          'Auditing source templates instead of built HTML',
          'Pointing the command at the wrong output directory',
          'Masking a non-zero audit exit code in a shell pipeline',
        ],
        errorsFr: [
          'Auditer les templates au lieu du HTML construit',
          'Viser le mauvais dossier de sortie',
          'Masquer un code de sortie non nul dans un pipeline shell',
        ],
        schema: '/audit-and-quality/audit-cli/',
      },
      {
        slug: 'core-frameworks',
        title: 'Core in any framework',
        titleFr: 'Core dans tout framework',
        builders: ['Article', 'Organization'],
        primary: 'Article',
        goal: 'Use the universal engine when no dedicated rendering integration exists.',
        goalFr: 'Utiliser le moteur universel lorsqu’aucune intégration de rendu dédiée n’existe.',
        production:
          'Build and serialize on the server, then place the returned string in one application/ld+json script without parsing and re-stringifying it.',
        productionFr:
          'Construisez et sérialisez côté serveur, puis placez la chaîne dans un script application/ld+json sans la parser et la sérialiser à nouveau.',
        errors: [
          'Importing the Node audit entry point into browser code',
          'Serializing with plain JSON.stringify in HTML',
          'Forgetting baseUrl when resolving relative identifiers',
        ],
        errorsFr: [
          'Importer le point d’entrée Node de l’audit dans le navigateur',
          'Sérialiser avec JSON.stringify directement dans le HTML',
          'Oublier baseUrl pour résoudre les identifiants relatifs',
        ],
        schema: '/integrations/core/',
      },
    ],
  },
];
export const recipes = recipeGroups.flatMap((group) => group.recipes);
