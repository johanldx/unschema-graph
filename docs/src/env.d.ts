/// <reference types="astro/client" />

declare module 'virtual:starlight/*' {
  // biome-ignore lint/suspicious/noExplicitAny: Starlight virtual components require any for Astro JSX typing
  const component: any;
  export default component;
}
