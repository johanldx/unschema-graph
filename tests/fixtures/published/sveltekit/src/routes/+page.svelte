<script lang="ts">
import { Organization, Schema } from '@unschema-graph/svelte';
import DirectSchema from '@unschema-graph/svelte/Schema.svelte';

const organization = Organization({
  '@id': '#organization',
  name: 'Published SvelteKit consumer',
  url: 'https://example.com',
});
</script>

<svelte:head>
  <title>Published SvelteKit compatibility</title>
</svelte:head>

<Schema items={[organization]} baseUrl="https://example.com" />
<DirectSchema items={[organization]} />

<main>
  <h1>Published SvelteKit compatibility</h1>
</main>
