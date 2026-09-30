import type { APIRoute } from 'astro';
import { createFullDocumentation } from '../lib/ai-docs';

export const prerender = true;

export const GET: APIRoute = async ({ site }) =>
  new Response(await createFullDocumentation(site), {
    headers: {
      'Content-Language': 'en',
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
