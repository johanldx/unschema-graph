export type LandingLocale = 'en' | 'fr';

export interface ComparisonBlock {
  badge: string;
  title: string;
  subtitle: string;
  code: string;
  points: string[];
}

export interface IntegrationCard {
  id: 'astro' | 'svelte' | 'core';
  name: string;
  package: string;
  install: string;
  quickstart: string;
  capabilities: string[];
}

export interface PipelineStep {
  number: string;
  name: string;
  snippet: string;
  description: string;
  pastel: 'lavender' | 'blue' | 'mint' | 'apricot';
}

export interface RecipeItem {
  title: string;
  description: string;
  slug: string;
}

export type LandingCopy = (typeof landingCopy)[LandingLocale];

export const landingCopy = {
  en: {
    hero: {
      status: 'Typed JSON‑LD for Astro, Svelte, and TypeScript',
      promise: 'Ship valid JSON‑LD without maintaining schema objects by hand.',
      intro:
        'Compose Schema.org entities with TypeScript, validate them with Zod, resolve every reference, and serialize them safely for HTML.',
      ctaPrimary: 'Build your first graph',
      ctaSecondary: 'See the typed difference',
      ecosystemLabel: 'Works natively with',
      demoLabel: 'From typed entities to one resolved graph',
      demoStatus: 'Valid · linked · safe to publish',
      proofs: [
        ['51', 'Schema.org builders'],
        ['Zod', 'runtime validation'],
        ['Safe', 'HTML serialization'],
        ['CLI', 'compiled HTML audit'],
      ],
    },
    comparison: {
      kicker: 'Side-by-side',
      title: 'Manual JSON‑LD or typed builders',
      subtitle:
        'Validate entity structures with Zod, connect them in a @graph, and serialize without HTML script breakouts.',
      without: {
        badge: 'Without unschema-graph',
        title: 'Manual JSON‑LD Object',
        subtitle: 'Unchecked handwritten object prone to silent typos and script breakouts.',
        code: `const article = {
  "@type": "Article",
  "headline": "Structured Data",
  "publisher": { "@id": "#publsher" }
};

const jsonLd = JSON.stringify(article);`,
        points: [
          'No schema checks: typos and missing required properties go unnoticed',
          'Duplicated @id strings risk silent reference mismatches across entities',
          'Raw serialization can prematurely terminate <script> tags on unescaped HTML characters',
        ],
      },
      with: {
        badge: 'With unschema-graph',
        title: 'Typed & Resolved Builders',
        subtitle: 'Schema.org autocompletion with runtime Zod verification and safe serialization.',
        code: `// Typed, validated, and linked
const publisher = Organization({
  '@id': '#publisher',
  name: 'Acme Media'
});

const article = Article({
  headline: 'Structured Data',
  publisher: '#publisher'
});

const jsonLd = serializeJsonLd(buildJsonLdGraph([publisher, article]));`,
        points: [
          '51 Zod builders with full TypeScript property completion for Schema.org types',
          'buildJsonLdGraph unifies entities and resolves relative #id references automatically',
          'serializeJsonLd safely escapes </script> and <!-- sequences for HTML inclusion',
        ],
      },
      statusResolved: 'Graph resolved · Zod-validated data · Safe <script> escaping',
    },
    integrations: {
      kicker: 'Ecosystem',
      title: 'Choose your environment',
      subtitle:
        'Pick the package that fits your stack. The same builders and graph engine run in every environment.',
      cards: [
        {
          id: 'astro' as const,
          name: 'Astro',
          package: '@unschema-graph/astro',
          install: 'pnpm add @unschema-graph/astro',
          quickstart: '/getting-started/quick-start/astro/',
          capabilities: [
            'Native <Schema /> component and Content Collections helpers',
            'Dev Toolbar inspection for generated JSON‑LD',
          ],
        },
        {
          id: 'svelte' as const,
          name: 'Svelte',
          package: '@unschema-graph/svelte',
          install: 'pnpm add @unschema-graph/svelte',
          quickstart: '/getting-started/quick-start/svelte/',
          capabilities: [
            'Native Svelte 5 runes and <svelte:head> output',
            'All 51 builders with no client JavaScript overhead',
          ],
        },
        {
          id: 'core' as const,
          name: 'TypeScript',
          package: '@unschema-graph/core',
          install: 'pnpm add @unschema-graph/core',
          quickstart: '/getting-started/quick-start/core/',
          capabilities: [
            'Universal builders for Node.js, Vite, Next.js, and custom SSR',
            'Pure graph, serialization, and audit APIs',
          ],
        },
      ],
    },
    pipeline: {
      kicker: 'Architecture',
      title: 'From typed entities to audited HTML',
      subtitle: 'A concrete structured data pipeline matching the library implementation.',
      steps: [
        {
          number: '01',
          name: 'Build',
          snippet: 'Article({ headline, ... })',
          description: 'TypeScript builders backed by Zod with Schema.org property autocompletion.',
          pastel: 'lavender' as const,
        },
        {
          number: '02',
          name: 'Link',
          snippet: "publisher: '#publisher'",
          description: 'Entity linking into a unified @graph using local #id references.',
          pastel: 'blue' as const,
        },
        {
          number: '03',
          name: 'Validate',
          snippet: 'Article.safeParse(data)',
          description:
            'Strict runtime verification returning { success, data } or precise Zod issues.',
          pastel: 'mint' as const,
        },
        {
          number: '04',
          name: 'Audit',
          snippet: 'unschema-graph audit dist',
          description:
            'Static scan of JSON‑LD script tags and graph structure in your compiled HTML files.',
          pastel: 'apricot' as const,
        },
      ],
    },
    recipes: {
      kicker: 'Solutions',
      title: 'Start with the outcome you need',
      subtitle: 'Focused Schema.org recipes for common web patterns.',
      items: [
        {
          title: 'Blog & Media',
          description: 'Articles, authors, publication dates, and linked breadcrumbs.',
          slug: 'blog-media',
        },
        {
          title: 'Company & Brand',
          description: 'Organization identity, logos, contact points, and socials.',
          slug: 'company-site',
        },
        {
          title: 'E-Commerce',
          description: 'Products, offers, availability, currencies, and aggregate ratings.',
          slug: 'ecommerce',
        },
        {
          title: 'Local Business',
          description: 'Physical stores, geo coordinates, opening hours, and addresses.',
          slug: 'local-business',
        },
        {
          title: 'Events & Ticketing',
          description: 'Events, physical venues, virtual streams, and ticket offers.',
          slug: 'events',
        },
      ],
      allRecipes: 'Explore all recipes',
    },
    cta: {
      title: 'Build your first typed graph',
      subtitle:
        'Choose your environment, compose an entity, and publish validated JSON‑LD without maintaining raw schema objects.',
      primaryButton: 'Open the quick start',
      secondaryButton: 'View on GitHub',
    },
  },
  fr: {
    hero: {
      status: 'JSON‑LD typé pour Astro, Svelte et TypeScript',
      promise: 'Publiez un JSON‑LD valide sans maintenir vos schémas à la main.',
      intro:
        'Composez vos entités Schema.org en TypeScript, validez-les avec Zod, résolvez chaque référence et sérialisez-les sans risque pour le HTML.',
      ctaPrimary: 'Construire mon premier graphe',
      ctaSecondary: 'Voir la différence',
      ecosystemLabel: 'Compatible nativement avec',
      demoLabel: 'Des entités typées à un graphe résolu',
      demoStatus: 'Valide · relié · prêt à publier',
      proofs: [
        ['51', 'builders Schema.org'],
        ['Zod', 'validation à l’exécution'],
        ['Sûr', 'sérialisation HTML'],
        ['CLI', 'audit du HTML compilé'],
      ],
    },
    comparison: {
      kicker: 'Face-à-face',
      title: 'JSON‑LD manuel ou builders typés',
      subtitle:
        'Validez la structure de vos entités avec Zod, reliez-les dans un @graph et sérialisez sans risque de rupture HTML.',
      without: {
        badge: 'Sans unschema-graph',
        title: 'Objet JSON‑LD manuel',
        subtitle: 'Objet écrit à la main, exposé aux fautes de frappe et aux ruptures de balise.',
        code: `const article = {
  "@type": "Article",
  "headline": "Données structurées",
  "publisher": { "@id": "#publsher" }
};

const jsonLd = JSON.stringify(article);`,
        points: [
          'Absence de schéma : fautes de frappe et propriétés requises manquantes non détectées',
          'Chaînes @id dupliquées risquant des références orphelines dans le graphe',
          'Sérialisation brute risquant de clore la balise <script> si le texte contient </script>',
        ],
      },
      with: {
        badge: 'Avec unschema-graph',
        title: 'Builders typés & reliés',
        subtitle:
          'Autocomplétion Schema.org avec vérification Zod à l’exécution et sérialisation sûre.',
        code: `// Typé, validé et relié
const publisher = Organization({
  '@id': '#publisher',
  name: 'Acme Media'
});

const article = Article({
  headline: 'Données structurées',
  publisher: '#publisher'
});

const jsonLd = serializeJsonLd(buildJsonLdGraph([publisher, article]));`,
        points: [
          '51 builders Zod avec autocomplétion TypeScript des propriétés Schema.org',
          'buildJsonLdGraph unifie les entités et résout automatiquement les références locales #id',
          'serializeJsonLd neutralise les séquences </script> et <!-- pour une inclusion HTML sûre',
        ],
      },
      statusResolved:
        'Graphe résolu · Données validées par Zod · Échappement anti-rupture <script>',
    },
    integrations: {
      kicker: 'Écosystème',
      title: 'Choisissez votre environnement',
      subtitle:
        'Choisissez le paquet adapté à votre stack. Les mêmes builders et le même moteur fonctionnent partout.',
      cards: [
        {
          id: 'astro' as const,
          name: 'Astro',
          package: '@unschema-graph/astro',
          install: 'pnpm add @unschema-graph/astro',
          quickstart: '/getting-started/quick-start/astro/',
          capabilities: [
            'Composant <Schema /> natif et helpers Content Collections',
            'Inspection du JSON‑LD dans l’Astro Dev Toolbar',
          ],
        },
        {
          id: 'svelte' as const,
          name: 'Svelte',
          package: '@unschema-graph/svelte',
          install: 'pnpm add @unschema-graph/svelte',
          quickstart: '/getting-started/quick-start/svelte/',
          capabilities: [
            'Runes Svelte 5 natives et sortie dans <svelte:head>',
            'Les 51 builders sans JavaScript client superflu',
          ],
        },
        {
          id: 'core' as const,
          name: 'TypeScript',
          package: '@unschema-graph/core',
          install: 'pnpm add @unschema-graph/core',
          quickstart: '/getting-started/quick-start/core/',
          capabilities: [
            'Builders universels pour Node.js, Vite, Next.js et SSR sur mesure',
            'API pures pour le graphe, la sérialisation et l’audit',
          ],
        },
      ],
    },
    pipeline: {
      kicker: 'Architecture',
      title: 'Des entités typées au HTML audité',
      subtitle: 'La chaîne concrète de vos données structurées, conforme à l’implémentation.',
      steps: [
        {
          number: '01',
          name: 'Construire',
          snippet: 'Article({ headline, ... })',
          description:
            'Builders TypeScript validés par Zod avec autocomplétion des propriétés Schema.org.',
          pastel: 'lavender' as const,
        },
        {
          number: '02',
          name: 'Relier',
          snippet: "publisher: '#publisher'",
          description:
            'Liaison automatique des entités dans un @graph unifié à partir des références locales #id.',
          pastel: 'blue' as const,
        },
        {
          number: '03',
          name: 'Valider',
          snippet: 'Article.safeParse(data)',
          description:
            'Vérification stricte à l’exécution renvoyant { success, data } ou des erreurs Zod précises.',
          pastel: 'mint' as const,
        },
        {
          number: '04',
          name: 'Auditer',
          snippet: 'unschema-graph audit dist',
          description:
            'Scan statique des balises JSON‑LD et de la structure du graphe dans vos fichiers HTML compilés.',
          pastel: 'apricot' as const,
        },
      ],
    },
    recipes: {
      kicker: 'Solutions',
      title: 'Partez du résultat recherché',
      subtitle: 'Des recettes ciblées pour les cas d’usage courants du web.',
      items: [
        {
          title: 'Blog & Médias',
          description: 'Articles, auteurs, dates de publication et fil d’Ariane.',
          slug: 'blog-media',
        },
        {
          title: 'Entreprise & Marque',
          description: 'Identité d’organisation, logo, points de contact et réseaux.',
          slug: 'company-site',
        },
        {
          title: 'E-Commerce',
          description: 'Produits, offres commerciales, devises et avis agrégés.',
          slug: 'ecommerce',
        },
        {
          title: 'Commerce local',
          description: 'Établissements, coordonnées géographiques et horaires d’ouverture.',
          slug: 'local-business',
        },
        {
          title: 'Événements & Billetterie',
          description: 'Événements, lieux physiques, diffusions vidéo et billets.',
          slug: 'events',
        },
      ],
      allRecipes: 'Consulter toutes les recettes',
    },
    cta: {
      title: 'Construisez votre premier graphe typé',
      subtitle:
        'Choisissez votre environnement, composez une entité et publiez un JSON‑LD validé sans maintenir d’objets bruts.',
      primaryButton: 'Ouvrir le guide de démarrage',
      secondaryButton: 'Voir sur GitHub',
    },
  },
} as const;
