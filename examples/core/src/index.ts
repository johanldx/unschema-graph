import { createPageGraph } from './schema.js';

const { graph, jsonLd } = createPageGraph('https://example.com');

console.log('=== @unschema-graph/core Example ===\n');
const graphList = graph && Array.isArray(graph['@graph']) ? graph['@graph'] : [];
console.log(`Discovered entities in unified @graph: ${graphList.length}`);
console.log('\n--- Serialized JSON-LD (<script type="application/ld+json">) ---\n');
console.log(jsonLd);
