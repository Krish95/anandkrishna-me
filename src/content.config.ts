import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
// Imported straight from zod rather than re-exported via `astro:content`, which
// is deprecated in Astro 7.
import { z } from 'zod';

/**
 * Long-form writing. Markdown or MDX — reach for `.mdx` when a post needs
 * components (charts, embeds, custom callouts).
 */
const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().max(120),
        /** Used for meta description, list pages, RSS, and the OG image. */
        description: z.string().max(300),
        pubDate: z.coerce.date(),
        /** Set when you materially revise a post; shown as "Updated ...". */
        updatedDate: z.coerce.date().optional(),
        tags: z.array(z.string()).default([]),
        /** Drafts build locally but are excluded from production output. */
        draft: z.boolean().default(false),
        /** Featured posts surface on the homepage. */
        featured: z.boolean().default(false),
        /** Optional lead image, resolved and optimised by `astro:assets`. */
        hero: image().optional(),
        heroAlt: z.string().optional(),
        /** Render the table of contents sidebar. */
        toc: z.boolean().default(true),
        /** Group related posts, e.g. "Building Poiro". */
        series: z.string().optional(),
      })
      .superRefine((data, ctx) => {
        // Enforce alt text at build time rather than shipping an unlabelled image.
        if (data.hero && !data.heroAlt) {
          ctx.addIssue({
            code: 'custom',
            path: ['heroAlt'],
            message: '`heroAlt` is required whenever `hero` is set.',
          });
        }
      }),
});

/**
 * Work worth showing. Each project gets its own page plus a card on /projects.
 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(120),
      description: z.string().max(300),
      /** Display string so ranges work: "2024", "2023–24", "2025–present". */
      year: z.string(),
      /** Your role on it. */
      role: z.string().optional(),
      /** Rendered as monospace chips. */
      stack: z.array(z.string()).default([]),
      status: z.enum(['shipped', 'building', 'experiment', 'archived']).default('shipped'),
      /** Live URL, if there is one. */
      url: z.url().optional(),
      repo: z.url().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** Lower sorts first on /projects. Ties fall back to reverse year. */
      order: z.number().default(0),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

/**
 * Short dated updates — the "Now" feed on the homepage.
 * Edited as one flat YAML file because these are one-liners, not documents.
 */
const notes = defineCollection({
  loader: file('src/content/notes.yaml'),
  schema: z.object({
    date: z.coerce.date(),
    /** Plain text or inline markdown-ish is fine; rendered as text. */
    text: z.string(),
    /** Optional link the note points at. */
    href: z.url().optional(),
  }),
});

/**
 * Papers and preprints.
 *
 * The body of each file is the abstract, so LaTeX in it renders through KaTeX
 * like anywhere else. Everything that needs to be sortable or filterable lives
 * in frontmatter instead.
 */
const publications = defineCollection({
  loader: glob({ base: './src/content/publications', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    /** In publication order, exactly as it appears on the paper. */
    authors: z.array(z.string()).min(1),
    /** Full date if you have it; the year drives grouping and sort order. */
    date: z.coerce.date(),
    /** Venue as you'd cite it: "AAAI 2025", "ITCS 2024", "In Submission". */
    venue: z.string(),
    /** Drives the badge colour and the grouping on /publications. */
    type: z.enum(['conference', 'journal', 'preprint', 'thesis', 'workshop']),
    /** Optional one-line "why this matters", shown in lists instead of the abstract. */
    summary: z.string().optional(),
    links: z
      .object({
        pdf: z.string().optional(),
        arxiv: z.url().optional(),
        doi: z.url().optional(),
        code: z.url().optional(),
        video: z.url().optional(),
        slides: z.string().optional(),
        poster: z.string().optional(),
      })
      .default({}),
    /** BibTeX, rendered in a copyable block on the publication page. */
    bibtex: z.string().optional(),
    /** Featured papers surface on the homepage. */
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, projects, notes, publications };
