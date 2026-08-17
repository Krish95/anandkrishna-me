# Deploying anandkrishna.me

Your part is four short actions. Everything else is scripted or done for you.

Run `bash scripts/check-dns.sh` at any point to see where things stand. It
verifies nameservers, **mail**, and whether the new site is being served.

---

## The one real risk

`anandkrishna.me` carries **GoDaddy-hosted email**. As of the pre-migration
snapshot:

```
0   smtp.secureserver.net
10  mailstore1.secureserver.net
```

Moving nameservers to Cloudflare moves *all* DNS, mail included. If those two MX
records don't exist in Cloudflare before the switch, **mail to your address stops
arriving.** Cloudflare's onboarding scan usually imports them automatically — the
job is to confirm it did, before flipping the nameservers.

`scripts/check-dns.sh` fails loudly if they ever go missing.

---

## 1. GitHub — done

Pushed to <https://github.com/Krish95/anandkrishna-me> (public, `main`).

Done without touching the `gh` CLI, which stays signed in as **anandpoiro** so
work running under that account is unaffected. The push used a fine-grained
Krish95 token supplied for that one command through an environment variable and a
throwaway credential helper: nothing was written to `.git/config` and nothing
entered the keychain.

A local-only git identity is set for this repo, so commits here are authored as
`Anand Krishna <anandkrishna1995@live.com>` rather than the global poiro identity.

**Future pushes need a credential.** The system keychain helper will offer the
anandpoiro token, which this repo rejects. See "Pushing again later" at the end.

## 2. Cloudflare account — you: sign up

<https://dash.cloudflare.com/sign-up> — email, password, verify the email. Free
plan is all this needs.

---

## 3. Add the domain — you: click through, and check mail

1. Cloudflare dashboard → **Add a site** → `anandkrishna.me` → **Free**.
2. Cloudflare scans your existing DNS. **Stop and read the record list.**
   Confirm both MX records above are there. If either is missing, add it:
   - Type `MX`, Name `@`, Mail server `smtp.secureserver.net`, Priority `0`
   - Type `MX`, Name `@`, Mail server `mailstore1.secureserver.net`, Priority `10`
3. Cloudflare shows two nameservers, like `xxx.ns.cloudflare.com`. Copy both.
4. GoDaddy → **My Products** → `anandkrishna.me` → **DNS** → **Nameservers** →
   **Change** → **I'll use my own nameservers** → paste both → save.

Then run `bash scripts/check-dns.sh`. Nameservers usually flip within the hour.

---

## 4. Connect the site — you: one click, then me

```bash
npx wrangler login
```

Approve in the browser. After that I can do the rest from the CLI:

```bash
npm run deploy          # builds, then uploads dist/ to Cloudflare Pages
```

The first deploy creates the Pages project (named `anandkrishna-me`, from
`wrangler.jsonc`) and gives you a live `*.pages.dev` URL immediately — that works
regardless of DNS, so you can see the real thing before the domain moves.

Attaching the domain, once the nameservers have flipped:

Pages project → **Custom domains** → add `anandkrishna.me` and
`www.anandkrishna.me`. Cloudflare writes the records itself, replacing the old
Netlify ones.

---

## 5. Retire Netlify

The old site is the Netlify project `priceless-khorana-0f6037`. Once
`scripts/check-dns.sh` reports the new site is being served, unlink the custom
domain there or delete the project, so nothing fights over the domain.

---

## 6. Analytics

Cloudflare → **Analytics & Logs** → **Web Analytics** → **Add a site** → copy the
token into `analytics.cloudflareToken` in `src/site.config.ts`, then redeploy.
Cookieless, so no consent banner. The script is omitted entirely while the token
is empty, and never loads in dev.

---

## Afterwards

Every push to `main` can build and deploy automatically if you connect the repo
in the Cloudflare dashboard instead of uploading with Wrangler:

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22` (pinned in `.nvmrc`) |

Direct `npm run deploy` uploads and Git-connected builds are mutually exclusive
in practice — pick one. Git-connected is better once the repo is up, because it
gives you preview URLs on pull requests.

---

## Pushing again later

The keychain on this machine holds the anandpoiro credential for github.com, and
this repo belongs to Krish95, so a bare `git push` here will be refused. Changing
the keychain entry is not an option — it would break pushes for poiro repos.

Pick whichever suits:

- **SSH deploy key (recommended).** A key dedicated to this one repo, with the
  remote switched to SSH and `core.sshCommand` set locally to use it. No token on
  disk, no interference with anything else, and `git push` then just works.
- **Repo-scoped token store.** Keep a fine-grained token in a 600-permission file
  outside the repo, wired up with a local `credential.helper` and
  `credential.useHttpPath`, so it applies to this repo only.
- **Nothing.** Supply a token per push, as was done for the first one.
