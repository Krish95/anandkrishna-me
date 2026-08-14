import type { APIRoute } from 'astro';

/**
 * Generated rather than dropped in `public/` so the sitemap URL always tracks
 * whatever `site` is set to.
 */
export const GET: APIRoute = ({ site }) =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${new URL('sitemap-index.xml', site).href}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
