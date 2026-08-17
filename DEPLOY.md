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

## 2. Cloudflare account — done

Account created. Nothing else needed here.

---

## 3. Connect the repo — you: about six clicks, once

This is the only route that gives automatic builds on every push, and it has to
happen in the dashboard because Cloudflare needs to authorise against GitHub.
It produces a live `*.pages.dev` URL, so no DNS is involved and **mail is not
touched at this stage**.

1. <https://dash.cloudflare.com> → **Workers & Pages** → **Create** →
   **Pages** tab → **Connect to Git**.
2. **Connect GitHub.** Authorise as **Krish95** — check the account shown in the
   GitHub prompt, since a browser signed in as `anandpoiro` will offer that
   account instead. Grant access to `anandkrishna-me` (or all repositories).
3. Pick `anandkrishna-me` → **Begin setup**.
4. Build settings:

   | Field | Value |
   |---|---|
   | Project name | `anandkrishna-me` |
   | Production branch | `main` |
   | Framework preset | **Astro** |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

5. Under **Environment variables**, add `NODE_VERSION` = `22`. `.nvmrc` pins it
   too, but the variable is what Cloudflare reads first.
6. **Save and Deploy.**

The build takes a couple of minutes. When it finishes you get
`anandkrishna-me.pages.dev` — send me that URL and I'll verify the deployment
properly: every route, the social cards, search, the redirects and the security
headers.

Every push to `main` rebuilds from here on, and pull requests get their own
preview URLs.

---

## 4. Attach the domain — only once you're happy with pages.dev

**This is the step that can break mail.** Do it deliberately.

1. Cloudflare dashboard → **Add a site** → `anandkrishna.me` → **Free**.
2. Cloudflare scans your existing DNS. **Stop and read the record list.**
   Confirm both MX records are present:
   - `MX` `@` → `smtp.secureserver.net`, priority `0`
   - `MX` `@` → `mailstore1.secureserver.net`, priority `10`

   If either is missing, add it before going any further.
3. Cloudflare shows two nameservers, like `xxx.ns.cloudflare.com`. Copy both.

   **Before touching GoDaddy, pre-flight the zone:**

   ```bash
   bash scripts/check-dns.sh <one-of-your-cloudflare-nameservers>
   ```

   This queries Cloudflare directly while the domain is still delegated to
   GoDaddy, so it confirms the mail records are right *before* the switch rather
   than after mail has already stopped. It prints "safe to change nameservers"
   only when both MX records are present.
4. GoDaddy → **My Products** → `anandkrishna.me` → **DNS** → **Nameservers** →
   **Change** → **I'll use my own nameservers** → paste both → save.
5. Run `bash scripts/check-dns.sh`. It confirms the nameservers flipped and that
   both mail servers survived. Usually under an hour.
6. Back in the Pages project → **Custom domains** → add `anandkrishna.me` and
   `www.anandkrishna.me`. Cloudflare writes the records itself, replacing the
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
