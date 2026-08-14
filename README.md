# anandkrishna.me

Personal academic site. Static Astro build, deployed to Cloudflare Pages.

```bash
npm install
npm run dev      # http://localhost:4321, hot reload
npm run build    # static output + search index into dist/
npm run preview  # serve dist/ (use this to test search)
npm run check    # TypeScript + Astro diagnostics
npm run deploy   # build, then upload to Cloudflare Pages
```

Search is indexed from the built HTML by Pagefind, so `/search` is empty under
`npm run dev` and only works after `npm run build`.

---

## Editing the site

### Identity, links, analytics

Everything about *who the site is* lives in one file: **`src/site.config.ts`**.
Name, role, affiliation, tagline, email, research interests, social links, the
nav, and the analytics token. Nothing else needs editing to change those.

### Publications

One Markdown file per paper in `src/content/publications/`. The body is the
abstract, so LaTeX in it renders through KaTeX.

```yaml
---
title: $p$-Mean Regret for Stochastic Bandits   # inline maths allowed
authors: ['Anand Krishna', 'Philips George John', 'Vincent Y. F. Tan']
date: 2024-06-01          # drives sort order and the year grouping
venue: AAAI 2025          # as you'd cite it, or "In Submission"
type: conference          # conference | journal | preprint | thesis | workshop
featured: true            # surfaces on the homepage
summary: One line for list pages.
links:
  pdf: /papers/p-mean.pdf     # drop the file in public/papers/
  arxiv: https://arxiv.org/abs/…
  doi: https://doi.org/…
  code: https://github.com/…
  video: https://…
bibtex: |
  @inproceedings{...}
---

Abstract goes here. Maths works: $\tilde{O}(\sqrt{k/T})$.
```

Only `title`, `authors`, `date`, `venue`, and `type` are required. Link chips
only appear for links you actually provide.

**None of the seven papers currently has a PDF or arXiv link** — your old site
didn't expose them. Add them and the buttons appear.

### CV

`src/data/cv.ts` — a typed TypeScript file rather than Markdown, so your editor
autocompletes the fields and a typo fails `npm run check`. Sections: experience,
education, teaching, awards, service, skills.

### Posts

`src/content/posts/*.md` or `.mdx`. Use `.mdx` when you want components.
`src/content/posts/writing-in-this-theme.mdx` is a reference post that exercises
every markdown feature and component available — keep it while it's useful, then
delete the file.

### News feed

`src/content/notes.yaml` — the dated one-liners in the homepage News band.

### Portrait

Drop a square image at `src/assets/portrait.jpg` (or `.png` / `.webp`) and the
hero picks it up automatically. With no file there, the hero is text-only by
design rather than showing an empty frame.

---

## Things you should check

These are the places I made a judgement call you may want to correct.

| Where | What to check |
|---|---|
| `src/data/cv.ts` | Two **start years are inferred**, not sourced — your old site listed only end dates. PMRF/Ph.D. start is written as 2018, NUS postdoc as 2023. |
| `src/content/publications/barman-2020-tight-p-mean-welfare.md` | Your old site's abstract read "p-mean welfare at least $8n$ times the optimal". I wrote $\frac{1}{8n}$, which is consistent with the $8n$-approximation claimed earlier in the same abstract. Confirm against the paper. |
| `src/site.config.ts` | Email is `anandkrishna1995@live.com`, from the old site's contact section. You wrote to me from `anand@poiro.com` — if the Poiro address is the one you want public, change it. |
| Poiro | I found no verifiable description of your role there, so **the site doesn't mention it at all**. If it belongs on the site, tell me what you do there and I'll add it. |
| `src/site.config.ts` | Social links point at `github.com/Krish95`, `x.com/anand95krish`, `linkedin.com/in/anandkrishna95`, and a DBLP *search* URL. Replace the DBLP one with your canonical author page. |
| Old content | Talks, slides, and events from the Wowchemy site aren't modelled here — the only entries were demo content. `public/_redirects` sends those URLs home. Say the word and I'll add the collections. |

---

## Deploying to Cloudflare Pages

### 1. Push to a Git host

```bash
git remote add origin git@github.com:Krish95/anandkrishna-me.git
git push -u origin main
```

### 2. Create the Pages project

Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → connect
the repo, then:

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22` (already pinned in `.nvmrc`) |

Every push to `main` then builds and deploys; pull requests get preview URLs.

Alternatively, skip Git integration and run `npm run deploy` to upload `dist/`
directly with Wrangler.

### 3. Point the domain at it

Your domain is registered at GoDaddy. You have two options.

**Option A — move DNS to Cloudflare (recommended).** Cloudflare becomes your
nameserver; you keep the registration at GoDaddy. This gives you the fastest
setup, free CDN and analytics, and one place to manage records.

1. Cloudflare dashboard → **Add a site** → `anandkrishna.me` → Free plan.
   Cloudflare scans your existing DNS records — check they came across, in
   particular any **MX records for email**.
2. Cloudflare shows two nameservers, e.g. `xxx.ns.cloudflare.com`.
3. GoDaddy → **My Products** → your domain → **DNS** → **Nameservers** →
   **Change** → **I'll use my own nameservers** → paste both → save.
4. Back in Cloudflare, in the Pages project → **Custom domains** → add
   `anandkrishna.me` and `www.anandkrishna.me`. The records are created for you.

Propagation is usually under an hour, occasionally up to 24.

**Option B — keep DNS at GoDaddy.** Add these records in GoDaddy's DNS panel,
using the target Cloudflare shows in your Pages project:

| Type | Name | Value |
|---|---|---|
| CNAME | `www` | `anandkrishna-me.pages.dev` |
| CNAME or ALIAS | `@` | `anandkrishna-me.pages.dev` |

GoDaddy does not support a true CNAME at the apex; if it rejects the `@` record,
use its forwarding feature to send `anandkrishna.me` → `www.anandkrishna.me`,
or go with Option A.

### 4. Retire the old Netlify site

The current site is on Netlify. Once Cloudflare serves the domain, delete the
Netlify site or unlink its custom domain so the two can't fight over DNS.

### 5. Analytics

Cloudflare dashboard → **Analytics & Logs** → **Web Analytics** → **Add a site**
→ copy the token into `analytics.cloudflareToken` in `src/site.config.ts`. The
script is omitted entirely until that's set, and never loads in dev.

---

## How it's put together

| Concern | Choice | Why |
|---|---|---|
| Framework | Astro 7, static output | Ships no JavaScript unless a component asks for it. |
| Styling | Tailwind 4 + hand-written prose CSS | Tokens via `@theme`; no typography plugin, so the reading column is exactly specified. |
| Markdown | `unified()` (remark/rehype), **not** Astro 7's default Sätteri | Sätteri is faster but only *parses* maths — it ships no renderer. KaTeX exists only as a rehype plugin, and abstracts here are full of LaTeX. |
| Maths | `remark-math` + `rehype-katex`, `output: htmlAndMathml` | Rendered at build time, so no maths JS on the page, and screen readers get real MathML. |
| Code blocks | Shiki with 5 transformers + a local one | Dual themes as CSS variables (no flash), plus diff/focus/highlight notation, filename tabs and line numbers. |
| Search | Pagefind | Indexes built HTML. No API, no service to keep alive. |
| Social cards | Satori + resvg at build time | One card per page, generated from TTFs vendored in `src/assets/og-fonts/`. |
| Theme | CSS custom properties, three states | System / light / dark, so the toggle wins in both directions and there's no flash on load. |
| Hosting | Cloudflare Pages | Free, fast, unlimited bandwidth, free analytics. |

### Layout of the repo

```
src/
  site.config.ts        identity, nav, socials, analytics — start here
  content.config.ts     Zod schemas for every collection
  data/cv.ts            CV content
  content/
    publications/       one .md per paper; body = abstract
    posts/              blog posts (.md or .mdx)
    projects/           optional; not currently in the nav
    notes.yaml          homepage News band
  components/
    mdx/                Callout, Figure, Aside, Embed — usable in any .mdx post
  layouts/              Base, PageLayout, PostLayout
  lib/
    content.ts          collection queries and sorting
    math.ts             inline KaTeX for frontmatter strings
    shiki-code-title.ts filename tabs + line numbers
  pages/
    og/[...slug].png.ts build-time social cards
public/
  _headers              security headers + cache policy
  _redirects            old Hugo URLs -> new ones
```

### Maths in frontmatter

Paper titles and summaries aren't run through the markdown pipeline, so
`src/lib/math.ts` renders `$…$` in those strings (`mathToHtml`) and flattens it
for `<title>`, meta descriptions, and social cards (`stripMath`). That's why
`$p$-Mean Regret` shows a proper italic *p* in the heading but plain `p-Mean` in
the browser tab.

### Adding a maths-free fast path

If you ever drop LaTeX from the site, switching `markdown.processor` in
`astro.config.ts` from `unified({…})` to `satteri({ features: { gfm: true,
smartPunctuation: true } })` gets you Astro 7's Rust markdown engine and a
noticeably faster build. You'd lose KaTeX, and heading anchors would need the
small client-side fallback back.
