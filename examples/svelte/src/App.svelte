<script lang="ts">
import {
  Article,
  BreadcrumbList,
  Event,
  FAQPage,
  Offer,
  Organization,
  Person,
  Product,
  Schema,
  WebSite,
} from '@unschema-graph/svelte';

let articleTitle = $state('Architecture et SEO moderne avec Svelte 5 et JSON-LD');
let authorName = $state('Johan Ledoux');
let inLanguage = $state('fr');
let isPretty = $state(true);

const website = WebSite({
  '@id': '#website',
  name: 'Rootage Media',
  url: 'https://example.com',
  searchUrl: 'https://example.com/search?q={search_term_string}',
  publisher: '#organization',
});

const publisher = Organization({
  '@id': '#organization',
  name: 'Rootage Media',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png',
  foundingDate: '2024-01-15',
});

const author = $derived(
  Person({
    '@id': '#author',
    name: authorName,
    url: 'https://example.com/team/johan',
    jobTitle: 'Lead Software Architect',
  })
);

const article = $derived(
  Article({
    '@id': '#article',
    headline: articleTitle,
    description: 'Démonstration de données structurées dynamiques avec Svelte 5 et Schema.org.',
    image: 'https://example.com/images/svelte5-seo-guide.webp',
    datePublished: 'today',
    dateModified: 'now',
    author: '#author',
    publisher: '#organization',
    keywords: ['svelte', 'svelte5', 'seo', 'json-ld', 'schema-org'],
    speakable: ['h1', '.subtitle'],
  })
);

const event = Event({
  '@id': '#event',
  name: 'Svelte Paris Meetup 2026',
  description: 'Rencontre autour de Svelte 5, SEO et performances web.',
  location: 'Station F, 5 Parvis Alan Turing, 75013 Paris',
  startDate: '2026-11-20T19:00:00+01:00',
  duration: '2h00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
});

const product = Product({
  '@id': '#product',
  name: 'Unschema Graph Pro License',
  description: 'Licence commerciale pour la suite Schema.org JSON-LD universelle.',
  image: 'https://example.com/images/product.webp',
  brand: '#organization',
  offers: Offer({
    price: 149,
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    priceValidUntil: '+1y',
  }),
});

const breadcrumbs = BreadcrumbList({
  itemListElement: [
    { name: 'Accueil', item: '/' },
    { name: 'Exemples', item: '/examples' },
    { name: 'Svelte 5' },
  ],
});

const faq = FAQPage({
  questions: [
    {
      question: 'Comment intégrer Schema.org avec Svelte 5 ?',
      answer: 'Importez simplement le composant Schema et passez-lui vos entités typées.',
    },
    {
      question: 'Les modifications de props sont-elles réactives ?',
      answer:
        'Oui, le composant Schema utilise les runes Svelte 5 pour recalculer le script JSON-LD.',
    },
  ],
});

const schemaItems = $derived([
  website,
  publisher,
  author,
  article,
  event,
  product,
  breadcrumbs,
  faq,
]);
</script>

<Schema items={schemaItems} baseUrl="https://example.com" {inLanguage} pretty={isPretty} />

<div class="container">
  <header>
    <h1>unschema-graph & Svelte 5</h1>
    <p class="subtitle">
      Démonstration d'intégration réactive avec les runes Svelte 5 et &lt;svelte:head&gt;
    </p>
  </header>

  <main>
    <section class="card">
      <h2>Contrôles réactifs</h2>
      <div class="form-grid">
        <label>
          Titre de l'Article
          <input type="text" bind:value={articleTitle}>
        </label>

        <label>
          Nom de l'Auteur
          <input type="text" bind:value={authorName}>
        </label>

        <label>
          Langue (inLanguage)
          <select bind:value={inLanguage}>
            <option value="fr">Français (fr)</option>
            <option value="en">English (en)</option>
            <option value="es">Español (es)</option>
          </select>
        </label>

        <label class="checkbox-label">
          <input type="checkbox" bind:checked={isPretty}>
          Formatage indenté (pretty)
        </label>
      </div>
    </section>

    <section class="card">
      <h2>Entités Schema.org actives ({schemaItems.length} entités)</h2>
      <ul class="entities-list">
        <li>
          <strong>WebSite & SearchAction</strong>
          <span>Sitelinks Searchbox automatique</span>
        </li>
        <li>
          <strong>Organization</strong>
          <span>Rootage Media (#organization)</span>
        </li>
        <li>
          <strong>Person</strong>
          <span>{authorName} (#author)</span>
        </li>
        <li>
          <strong>Article</strong>
          <span>{articleTitle} (avec speakable et dates relatives)</span>
        </li>
        <li>
          <strong>Event</strong>
          <span>Durée '2h00' &rarr; calcul automatique endDate</span>
        </li>
        <li>
          <strong>Product & Offer</strong>
          <span>149 EUR, validité calculée '+1y'</span>
        </li>
        <li>
          <strong>BreadcrumbList</strong>
          <span>Résolution des chemins relatifs</span>
        </li>
        <li>
          <strong>FAQPage</strong>
          <span>2 questions/réponses validées</span>
        </li>
      </ul>
    </section>
  </main>
</div>

<style>
:global(body) {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background-color: #0b0f19;
  color: #e2e8f0;
  line-height: 1.5;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

header {
  margin-bottom: 2rem;
}

h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #f8fafc;
}

.subtitle {
  color: #94a3b8;
  font-size: 1.1rem;
  margin: 0;
}

.card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 1.25rem;
  margin-top: 0;
  margin-bottom: 1rem;
  color: #f1f5f9;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.checkbox-label {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
  padding-bottom: 0.5rem;
}

input[type="text"],
select {
  background: #0f172a;
  border: 1px solid #475569;
  border-radius: 4px;
  color: #f8fafc;
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
}

input[type="text"]:focus,
select:focus {
  outline: none;
  border-color: #38bdf8;
}

.entities-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}

.entities-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
  font-size: 0.9rem;
}

.entities-list strong {
  color: #38bdf8;
}

.entities-list span {
  color: #94a3b8;
}
</style>
