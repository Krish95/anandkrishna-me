import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import type { APIRoute, GetStaticPaths } from 'astro';

import { SITE } from '@/site.config';
import { getPosts, getProjects, getPublications } from '@/lib/content';
import { stripMath } from '@/lib/math';
import { formatDate } from '@/lib/format';

/**
 * Per-page social preview images, rendered at build time.
 *
 * Satori lays out a subset of flexbox and returns SVG; resvg rasterises it.
 * Fonts must be real TTF buffers (satori can't read woff2), which is why the
 * two faces are vendored in `src/assets/og-fonts/`.
 */

const WIDTH = 1200;
const HEIGHT = 630;

// Read once per build, not once per image.
//
// Resolved from the project root rather than `import.meta.url`: this module gets
// bundled into `dist/.prerender/chunks/` before it runs, so a path relative to
// the source file no longer points anywhere real.
const fontDir = resolve(process.cwd(), 'src/assets/og-fonts');
const serif = readFileSync(resolve(fontDir, 'Newsreader.ttf'));
const sans = readFileSync(resolve(fontDir, 'Jost.ttf'));

// Light-theme palette, mirroring src/styles/global.css. Social cards are almost
// always shown on a light chrome, so they don't follow the dark theme.
const PAPER = '#fbf8f1';
const INK = '#16232a';
const INK_SOFT = '#4b5b62';
const MARKER = '#f7db6b';
const PEACH = '#f5c0a2';
const MINT = '#a3ddc7';
const RULE = '#e4ddcf';

type Card = { title: string; kicker: string; footer: string };

/** Satori takes a React-ish element tree; built as plain objects to skip JSX. */
const card = ({ title, kicker, footer }: Card) => ({
  type: 'div',
  props: {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: PAPER,
      padding: '64px 72px',
      // Riso-ish accent: a thick marker stripe down the left edge.
      borderLeft: `18px solid ${MARKER}`,
      fontFamily: 'Newsreader',
    },
    children: [
      // Kicker row
      {
        type: 'div',
        props: {
          style: { display: 'flex', alignItems: 'center', gap: '14px' },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  width: '14px',
                  height: '14px',
                  backgroundColor: PEACH,
                },
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  fontFamily: 'Jost',
                  fontSize: '22px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: INK_SOFT,
                },
                children: kicker,
              },
            },
          ],
        },
      },

      // Title
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            fontSize: title.length > 70 ? '58px' : '74px',
            lineHeight: 1.12,
            letterSpacing: '-2px',
            color: INK,
            // Satori has no `text-wrap: balance`; the clamp keeps long titles
            // from overflowing the card.
            maxHeight: '340px',
            overflow: 'hidden',
          },
          children: title,
        },
      },

      // Footer row
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `2px solid ${RULE}`,
            paddingTop: '26px',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  fontFamily: 'Jost',
                  fontSize: '24px',
                  letterSpacing: '2px',
                  color: INK,
                },
                children: SITE.author.name,
              },
            },
            {
              type: 'div',
              props: {
                style: { display: 'flex', alignItems: 'center', gap: '16px' },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        fontFamily: 'Jost',
                        fontSize: '22px',
                        color: INK_SOFT,
                      },
                      children: footer,
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', width: '14px', height: '14px', backgroundColor: MINT },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
});

export const getStaticPaths = (async () => {
  const [posts, projects, publications] = await Promise.all([
    getPosts(),
    getProjects(),
    getPublications(),
  ]);

  return [
    {
      params: { slug: 'default' },
      props: {
        title: SITE.author.tagline,
        kicker: SITE.author.role,
        footer: new URL(SITE.url).hostname,
      } satisfies Card,
    },
    ...publications.map((pub) => ({
      params: { slug: `pub-${pub.id}` },
      props: {
        // Satori has no maths support, so flatten LaTeX to readable text.
        title: stripMath(pub.data.title),
        kicker: pub.data.type === 'preprint' ? 'Preprint' : 'Paper',
        footer: pub.data.venue,
      } satisfies Card,
    })),
    ...posts.map((post) => ({
      params: { slug: post.id },
      props: {
        title: post.data.title,
        kicker: post.data.series ?? 'Writing',
        footer: formatDate(post.data.pubDate),
      } satisfies Card,
    })),
    ...projects.map((project) => ({
      // Namespaced so a post and a project can share a slug without clashing.
      params: { slug: `project-${project.id}` },
      props: {
        title: project.data.title,
        kicker: 'Project',
        footer: project.data.year,
      } satisfies Card,
    })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const svg = await satori(card(props as Card), {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'Newsreader', data: serif, weight: 600, style: 'normal' },
      { name: 'Jost', data: sans, weight: 500, style: 'normal' },
    ],
  });

  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
    font: { loadSystemFonts: false },
  })
    .render()
    .asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
