<script lang="ts">
import {
  buildJsonLdGraph,
  getGlobalConfig,
  type SchemaProps,
  serializeJsonLd,
} from '@unschema-graph/core';

type Props = SchemaProps;

let {
  data,
  item,
  items,
  pretty = false,
  indent = 2,
  context = 'https://schema.org',
  graph = true,
  baseUrl,
  inLanguage,
}: Props = $props();

const globalConfig = getGlobalConfig();
const effectiveBaseUrl = $derived(baseUrl ?? globalConfig.baseUrl);
const effectiveLocale = $derived(inLanguage ?? globalConfig.inLanguage);

const languageAwareTypes = new Set([
  'Article',
  'BlogPosting',
  'NewsArticle',
  'WebSite',
  'WebPage',
  'ProfilePage',
  'Book',
  'Course',
  'Movie',
  'VideoObject',
]);

const jsonLdOutput = $derived.by(() => {
  const rawItems: unknown[] = [];
  if (item) rawItems.push(item);
  if (items && Array.isArray(items)) rawItems.push(...items);
  if (data) {
    if (Array.isArray(data)) rawItems.push(...data);
    else rawItems.push(data);
  }

  const preparedItems = rawItems.map((rawItem) => {
    if (!effectiveLocale || !rawItem || typeof rawItem !== 'object') {
      return rawItem;
    }
    const entity = rawItem as Record<string, unknown>;
    const rawType = entity['@type'];
    const types = Array.isArray(rawType) ? rawType : [rawType];
    const isLanguageAware = types.some(
      (type) => typeof type === 'string' && languageAwareTypes.has(type)
    );
    if (!isLanguageAware || 'inLanguage' in entity) {
      return rawItem;
    }
    return { ...entity, inLanguage: effectiveLocale };
  });

  const graphPayload = buildJsonLdGraph(preparedItems, {
    graph,
    context,
    baseUrl: effectiveBaseUrl,
  });

  return graphPayload ? serializeJsonLd(graphPayload, { pretty, indent }) : null;
});
</script>

<svelte:head>
  {#if jsonLdOutput}
    <svelte:element this={'script'} type="application/ld+json">{jsonLdOutput}</svelte:element>
  {/if}
</svelte:head>
