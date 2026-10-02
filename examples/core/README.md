# @unschema-graph/core Example

A standalone TypeScript / Node.js playground demonstrating how to use `@unschema-graph/core` in a framework-neutral environment.

## Features Demonstrated

- **Universal Schema.org Builders**: Typed `Article`, `Organization`, `WebSite`, and `BreadcrumbList`.
- **Relational Entity-Object References**: Direct object references (`publisher: organization`, `isPartOf: website`, `breadcrumb: breadcrumb`).
- **Automatic `@graph` Resolution**: Recursive discovery of connected nodes without manual array management.
- **Anti-XSS Serialization**: Safe Unicode escaping of HTML-breaking characters.
- **Static HTML Output & Auditing**: Generating `dist/index.html` with valid JSON-LD and running the CLI audit tool.

## Running the Example

```bash
# Print the generated JSON-LD graph to the console
pnpm start

# Build the static HTML page into dist/
pnpm run build

# Audit the generated HTML with the unschema-graph CLI
pnpm run audit
```
