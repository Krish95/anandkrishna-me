import { defineConfig } from 'astro/config';
import { unified, rehypeHeadingIds } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationFocus,
  transformerNotationErrorLevel,
  transformerMetaHighlight,
} from '@shikijs/transformers';

import { SITE } from './src/site.config';
import { transformerCodeTitle } from './src/lib/shiki-code-title';

export default defineConfig({
  site: process.env.SITE_URL ?? SITE.url,
  trailingSlash: 'never',

  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    /**
     * The remark/rehype pipeline, not Astro 7's default Rust engine (Sätteri).
     *
     * Sätteri is faster and needs no plugins, but it only *parses* maths — it
     * ships no renderer. Publication abstracts here are full of LaTeX, so a
     * real renderer is non-negotiable, and KaTeX only exists as a rehype
     * plugin. At this size the speed difference is a few hundred milliseconds.
     */
    processor: unified({
      gfm: true,
      smartypants: true,
      remarkPlugins: [
        // $inline$ and $$display$$ -> maths nodes for rehype-katex to render.
        remarkMath,
      ],
      rehypePlugins: [
        // Listed explicitly so autolinking is guaranteed to run *after* ids exist.
        rehypeHeadingIds,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            properties: { class: 'heading-anchor', ariaHidden: 'true', tabIndex: -1 },
            content: { type: 'text', value: '#' },
          },
        ],
        [
          rehypeKatex,
          {
            // Render the offending source in red instead of failing the whole
            // build on one malformed expression.
            throwOnError: false,
            errorColor: '#c0392b',
            // Don't warn about the unicode and spacing quirks that show up in
            // abstracts pasted out of LaTeX papers.
            strict: false,
            // MathML alongside the HTML, so screen readers get real maths.
            output: 'htmlAndMathml',
          },
        ],
      ],
    }),

    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: { light: 'rose-pine-dawn', dark: 'rose-pine-moon' },
      // `false` emits BOTH themes as CSS variables so we switch with CSS only,
      // no JS and no flash of the wrong theme.
      defaultColor: false,
      wrap: false,
      transformers: [
        // ```ts {2-4}
        transformerMetaHighlight(),
        // // [!code highlight] / [!code ++] / [!code --] / [!code focus]
        transformerNotationHighlight(),
        transformerNotationDiff(),
        transformerNotationFocus(),
        // // [!code error] / [!code warning]
        transformerNotationErrorLevel(),
        // ```ts title="src/thing.ts" showLineNumbers
        transformerCodeTitle(),
      ],
    },
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  build: {
    // Cloudflare Pages serves /blog/post.html at /blog/post cleanly.
    format: 'file',
  },
});
