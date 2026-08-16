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
education, teaching, awards, service, skills.

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
| `src/content/publications/anand-2024-learn.md` | **Venue conflict.** You said AAAI 2026. Adarsh Barik's site lists this as **UAI 2026**, retitled *"Dynamic Regret in Outlier-Oblivious Online Optimization using Nonconvex Robust Losses"*. The file currently says AAAI 2026 under the LEARN title. |
| `src/data/cv.ts` | Every date written **`20XX`** is a placeholder I could not source: Poiro start, Walmart start/end, NUS end. LinkedIn blocks automated fetching (HTTP 999), so the Poiro and Walmart entries came from your public headline and nothing else — including the titles, both guessed as "Researcher". |
| `src/content/publications/barman-2020-tight-p-mean-welfare.md` | I **added a fourth author**, Ranjani G. Sundaram, per the ESA 2020 proceedings. Your old site listed only three. |
| `src/content/publications/barman-2022-nash-welfare-coverage.md` | I **added a fourth author**, Soumyarup Sadhukhan, per arXiv. Your old site listed only three. Also corrected the spelling from "Sadhukan" on the IJCAI paper. |
| `src/content/publications/barman-2020-tight-p-mean-welfare.md` | Your old abstract read "p-mean welfare at least $8n$ times the optimal". I wrote $\frac{1}{8n}$, matching the ESA proceedings. |
| `src/content/publications/barik-2024-robust-phase-retrieval.md` | Dated **2025** (journal publication) rather than 2024 (arXiv), so it groups under 2025. |
| `src/site.config.ts` | Public email is `anandkrishna1995@live.com`, from your old site. You write from `anand@poiro.com`. |
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

Light mode uses the **"Old photograph"** palette — four swatches, everything else
a mix of two of them, so the page reads as one toned print rather than a colour
scheme:

| Swatch | Role |
|---|---|
| `#FDFBD4` aged paper | page ground |
| `#D9D7B6` khaki | sunken surfaces, bands, the marker highlight |
| `#878672` olive grey | secondary text, rules |
| `#545333` dark olive | body text |

Body text sits at **7.3:1** against the ground (AAA), and every chip fill clears
4.5:1 against its ink.

Because the palette is tonal rather than hued, the type badges (`CONFERENCE`,
`JOURNAL`, …) carry a 1px outline — without one they dissolve into whichever
band they sit on.

Dark mode is deliberately *not* a tinted mirror of this. It uses a neutral cool
ground with warm sand as the single accent, and swaps two mechanisms:

- Links lose the highlighter sweep and become a hairline underline that thickens
  on hover. A translucent yellow bar behind light text reads as an artefact.
- Bands stop being colour tints and become elevation steps, so the rhythm comes
  from surface and the 2px rule.

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
