# anandkrishna.me

Personal academic site. Static Astro build, deployed to Cloudflare Pages.

```bash
npm install
npm run dev      # http://localhost:4321, hot reload
npm run build    # static output + search index into dist/
npm run preview  # serve dist/ (use this to test search)
npm run check    # TypeScript + Astro diagnostics
npm run cv:pdf   # re-render public/anand-krishna-cv.pdf from /cv
npm run deploy   # build, then upload to Cloudflare Pages
```

Note that `astro preview` in Astro 7 is a managed singleton daemon — a second
invocation reports the running one rather than starting another. Use
`npx astro preview stop` / `status` / `logs`.

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
date: 2024-12-14          # drives sort order and the year grouping
venue: AAAI 2025          # as you'd cite it
type: conference          # conference | journal | preprint | thesis | workshop
featured: true            # surfaces on the homepage
summary: One line for list pages.
links:
  doi: https://doi.org/…
  arxiv: https://arxiv.org/abs/…
  pdf: /papers/p-mean.pdf     # drop the file in public/papers/
  code: https://github.com/…
  video: https://…
bibtex: |
  @inproceedings{...}
---

Abstract goes here. Maths works: $\tilde{O}(\sqrt{k/T})$.
```

Only `title`, `authors`, `date`, `venue`, and `type` are required. Link chips
appear only for links you actually provide. Your own name is emphasised
automatically wherever the author list renders — it matches on
`SITE.author.name`, so keep the spelling consistent.

### CV

`src/data/cv.ts` — a typed TypeScript file rather than Markdown, so your editor
autocompletes the fields and a typo fails `npm run check`. Sections: experience,
education, teaching, awards, service, languages, skills.

**The PDF is generated from the page, not maintained separately.** `npm run cv:pdf`
renders `/cv` through the print stylesheet into `public/anand-krishna-cv.pdf`, which
is what the "Full CV (PDF)" button links to. Re-run it after editing `cv.ts` so the
two can't drift. Failing that, opening `/cv` in a browser and using Print → Save as
PDF uses the identical stylesheet.

The print view is not the screen view: site chrome, buttons and the social links
drop out, colour flattens to ink on white, a letterhead carries your name, role,
contact and summary, and the **full publication list renders** in place of the
"see the website" pointer — a printed CV with no publications on it is no use to
whoever is holding it.

`npm run cv:pdf` needs Chrome or Chromium installed. It drives it through
`playwright-core` rather than depending on `playwright`, which would pull a ~300MB
browser of its own; it is an authoring tool and deliberately not part of the build.

### Posts

`src/content/posts/*.md` or `.mdx`. Use `.mdx` when you want components.
`writing-in-this-theme.mdx` is a reference post that exercises every markdown
feature and component available — keep it while it's useful, then delete it.

### News feed

`src/content/notes.yaml` — the dated one-liners in the homepage News band.

### Portrait

Drop a square image at `src/assets/portrait.jpg` (or `.png` / `.webp`) and the
hero picks it up automatically. With no file there, the hero is text-only by
design rather than showing an empty frame.

---

## Things you should check

| Where | What to check |
|---|---|
| `src/content/publications/anand-2024-learn.md` | Resolved to **UAI 2026** under the new title *"Dynamic Regret in Outlier-Oblivious Online Optimization using Nonconvex Robust Losses"*. The filename still says `learn` so the redirect from the old Hugo URL keeps working; the arXiv preprint still carries the LEARN title. |
| `src/data/cv.ts` | Experience, education and languages are transcribed from your LinkedIn PDF export — no placeholders left. Two notes: your old site said the B.Tech was in **Computer Science**, LinkedIn says **Computer Engineering** (I used LinkedIn), and I deliberately left **high school** off, since academic CVs don't carry it. |
| `src/data/cv.ts` | The **Tools** list has only three entries — LinkedIn surfaced just "Machine Learning Algorithms, Computer Science, C++". Extend it. |
| `src/site.config.ts` | You now have **three** known addresses: `anandkrishna1995@live.com` (site, your choice), `anand@poiro.com` (work), `anandkrishna011095@gmail.com` (LinkedIn contact). Only the first is published. |
| `src/content/publications/barman-2020-tight-p-mean-welfare.md` | I **added a fourth author**, Ranjani G. Sundaram, per the ESA 2020 proceedings. Your old site listed only three. |
| `src/content/publications/barman-2022-nash-welfare-coverage.md` | I **added a fourth author**, Soumyarup Sadhukhan, per arXiv. Your old site listed only three. Also corrected the spelling from "Sadhukan" on the IJCAI paper. |
| `src/content/publications/barman-2020-tight-p-mean-welfare.md` | Your old abstract read "p-mean welfare at least $8n$ times the optimal". I wrote $\frac{1}{8n}$, matching the ESA proceedings. |
| All publication `date:` fields | Papers are dated by **venue year, not preprint year**, so the year headings on /publications mean what they say — the AAAI 2025 paper reads 2025, not 2024. Only the year is shown; the month is there to control sort order. |
| `src/site.config.ts` | DBLP link is a *search* URL. Replace it with your canonical author page. |
| Old content | Talks, slides and events from the Wowchemy site were all demo entries, so those sections don't exist here. `public/_redirects` sends their URLs home. |

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

Every push to `main` builds and deploys; pull requests get preview URLs.

### 3. Move DNS to Cloudflare

Your domain stays registered at GoDaddy; only the nameservers change.

> [!WARNING]
> **You have email on this domain.** As of the migration, `anandkrishna.me` has
> these MX records:
>
> ```
> 0   smtp.secureserver.net
> 10  mailstore1.secureserver.net
> ```
>
> That's GoDaddy-hosted email. If these don't come across to Cloudflare, **mail
> stops arriving.** Confirm both are present in Cloudflare's DNS list *before*
> you change the nameservers at GoDaddy.

Your current records, for reference:

| Type | Name | Value | Note |
|---|---|---|---|
| NS | `@` | `ns71.domaincontrol.com`, `ns72.domaincontrol.com` | GoDaddy — these are what you'll replace |
| A | `@` | `104.198.14.52` | Netlify; replaced by Pages |
| CNAME | `www` | `priceless-khorana-0f6037.netlify.com` | Netlify; replaced by Pages |
| MX | `@` | `smtp.secureserver.net` (0), `mailstore1.secureserver.net` (10) | **keep these** |

Steps:

1. Cloudflare → **Add a site** → `anandkrishna.me` → Free plan. Cloudflare scans
   your existing DNS. **Check the MX records above came across.**
2. Cloudflare shows two nameservers, e.g. `xxx.ns.cloudflare.com`.
3. GoDaddy → **My Products** → domain → **DNS** → **Nameservers** → **Change** →
   **I'll use my own nameservers** → paste both → save.
4. Once Cloudflare reports the domain active, open the Pages project →
   **Custom domains** → add `anandkrishna.me` and `www.anandkrishna.me`. The
   A/CNAME records are created for you, replacing the Netlify ones.

Propagation is usually under an hour, occasionally up to 24.

### 4. Retire the old Netlify site

The current site is Netlify (`priceless-khorana-0f6037`). Once Cloudflare serves
the domain, unlink the custom domain there or delete the site, so the two can't
fight over DNS.

### 5. Analytics

Cloudflare → **Analytics & Logs** → **Web Analytics** → **Add a site** → copy the
token into `analytics.cloudflareToken` in `src/site.config.ts`. The script is
omitted entirely until that's set, and never loads in dev. Cookieless, so no
consent banner is required.

---

## Design

### The palette

Light mode is **"Stone"** — a warm neutral grey with no yellow in it, and a clay-brown
accent.

Every light colour derives from **five base values** with `color-mix`, so changing
the whole scheme is a five-line edit at the top of `src/styles/global.css`. Chips,
rules, bands, buttons, code blocks and the heading slab all recompute:

```css
:root {
  --base-paper:   #faf9f8;  /* page ground */
  --base-surface: #ffffff;  /* cards */
  --base-tint:    #f0edea;  /* bands, sunken surfaces */
  --base-ink:     #221f1c;  /* body text */
  --base-accent:  #6e5a48;  /* links, buttons, marks */
}
```

Three other schemes were built and rejected, in case you want to revisit:

| Name | paper | surface | tint | ink | accent |
|---|---|---|---|---|---|
| Slate — cool, technical | `#fbfcfd` | `#ffffff` | `#edf1f4` | `#16212b` | `#2b6c8c` |
| Sage — muted green-grey | `#fafbfa` | `#ffffff` | `#ebf0ec` | `#17201a` | `#3f6b52` |
| Graphite — no hue | `#fcfcfc` | `#ffffff` | `#f1f1f1` | `#131313` | `#33393f` |

Callout colours are the exception: `--hue-info` / `--hue-ok` / `--hue-warn` /
`--hue-alert` are fixed, desaturated, and identical across palettes, so
note/tip/warning/danger stay readable as categories without adding hues to the page.

Two things resolved outside the token system and must be updated by hand when the
palette changes: the social cards in `src/pages/og/[...slug].png.ts` (Satori can't
read CSS variables) and `public/favicon.svg`.

Dark mode is deliberately *not* a mirror of any of this. It uses a neutral cool
ground with warm sand as the single accent, and swaps two mechanisms:

- Links lose the highlighter sweep and become a hairline underline that thickens
  on hover. A translucent wash behind light text reads as an artefact.
- Bands stop being colour tints and become elevation steps, so the rhythm comes
  from surface and the rule.

That's why every colour is a token: `--link-wash`, `--struck-bg`, `--fill-*` /
`--on-*` pairs. Components never name a colour directly, so a theme can change
what a chip *is* without touching a component.

The dark palette is declared twice — once behind `prefers-color-scheme` for
viewers on "system", once under `[data-theme='dark']` so the toggle wins over a
light OS. **Keep the two blocks in sync.**

### Fonts

Newsreader (reading and display), Jost (uppercase micro-labels), JetBrains Mono
(code and metadata). All self-hosted via Fontsource — no external requests.

---

## How it's put together

| Concern | Choice | Why |
|---|---|---|
| Framework | Astro 7, static output | Ships no JavaScript unless a component asks for it. ~4 KB total. |
| Styling | Tailwind 4 + hand-written prose CSS | Tokens via `@theme`; no typography plugin, so the reading column is exactly specified. |
| Markdown | `unified()` (remark/rehype), **not** Astro 7's default Sätteri | Sätteri is faster but only *parses* maths — it ships no renderer. KaTeX exists only as a rehype plugin, and abstracts here are full of LaTeX. |
| Maths | `remark-math` + `rehype-katex`, `output: htmlAndMathml` | Rendered at build time, so no maths JS on the page, and screen readers get real MathML. |
| Code blocks | Shiki (`vitesse-light`/`vitesse-dark`) + 6 transformers | Dual themes as CSS variables (no flash), plus diff/focus/highlight notation, filename tabs and line numbers. |
| Search | Pagefind | Indexes built HTML. No API, no service to keep alive. |
| Social cards | Satori + resvg at build time | One card per page, from TTFs vendored in `src/assets/og-fonts/`. |
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
