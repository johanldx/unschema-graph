import type { APIRoute, GetStaticPaths } from 'astro';
import { createMarkdownPage, type DocumentationPage, getDocumentationPages } from '../lib/ai-docs';

interface Props {
  page: DocumentationPage;
}

export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await getDocumentationPages(true);

  return pages.map((page) => ({
    params: { slug: page.slug },
    props: { page },
  }));
};

export const GET: APIRoute<Props> = ({ props, site }) =>
  new Response(createMarkdownPage(props.page, site), {
    headers: {
      'Content-Language': props.page.locale,
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
