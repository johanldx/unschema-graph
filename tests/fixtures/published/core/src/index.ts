import { buildJsonLdGraph, Organization, serializeJsonLd } from '@unschema-graph/core';
import { auditHtmlContent } from '@unschema-graph/core/audit';

const organization = Organization({
  '@id': '#organization',
  name: 'Published package consumer',
  url: 'https://example.com',
});
const output = serializeJsonLd(buildJsonLdGraph(organization));

if (!output.includes('Published package consumer')) {
  throw new Error('The Core root export did not build a JSON-LD graph.');
}

if (auditHtmlContent(`<script type="application/ld+json">${output}</script>`).errors.length > 0) {
  throw new Error('The Core audit subpath rejected valid JSON-LD.');
}
