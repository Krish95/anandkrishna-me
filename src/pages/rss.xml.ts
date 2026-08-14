import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';

import { SITE } from '@/site.config';
import { getPosts } from '@/lib/content';

export const GET: APIRoute = async (context) => {
  const posts = await getPosts();

  return rss({
    title: `${SITE.title} — Writing`,
    description: SITE.description,
    // `context.site` comes from `site` in astro.config.ts.
    site: context.site!,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}`,
      categories: post.data.tags,
      author: `${SITE.author.email} (${SITE.author.name})`,
    })),
    customData: `<language>${SITE.locale}</language>`,
    // Lets feed readers style the raw XML instead of showing markup.
    stylesheet: false,
  });
};
