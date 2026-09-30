/// <reference types="astro/client" />

declare module '*.astro' {
  type AstroComponentFactory = import('astro/runtime/server/index.js').AstroComponentFactory;
  const component: AstroComponentFactory;
  export default component;
}

declare module '@unschema-graph/astro/Schema.astro' {
  type AstroComponentFactory = import('astro/runtime/server/index.js').AstroComponentFactory;
  const component: AstroComponentFactory;
  export default component;
}
