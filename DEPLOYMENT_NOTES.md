# Deployment & Session Notes

Running log of what's been done and what's still outstanding. Kept in the repo so it survives even if the chat history doesn't.

## Live deployment

- **Live URL**: https://motorcycle-website-plum.vercel.app
- **CMS (Sanity Studio)**: https://motorcycle-website-plum.vercel.app/studio
- **Vercel project ID**: `prj_a3LmPJVmh2p6z43hO2XcB8XPdnKQ`
- **Vercel org**: `ms-real-estates-projects`
- **Vercel account email**: born04416@gmail.com
- **Sanity project ID**: `f3zi3siz` (dataset: `production`)
- **GitHub repo**: https://github.com/born-stackflow/rks-motor (main branch) — connected to Vercel, **auto-deploys on every push to `main`**. No need to run `vercel --prod` manually anymore; just `git push`.
- Push access from this machine is via SSH key (`~/.ssh/id_ed25519`, authenticated as GitHub user `codewithahmedkhan`, added as a collaborator on `born-stackflow/rks-motor`).
- An earlier repo (`codewithahmedkhan/Motorcycle-website-dev-machine`) was created first and has an initial commit pushed to it, but is **not** the one connected to Vercel — `born-stackflow/rks-motor` is the real one in use.
- `vercel.json` has `"framework": "nextjs"` — required fix, Vercel didn't auto-detect the framework on first link and defaulted to looking for a `dist` folder, which failed the first deploy attempt.
- `package.json` has `"engines": { "node": ">=20.9.0" }` — Next.js 16 requires it; this dev machine's default Node (18.19.1) is too old to even run `next build`, so use `nvm use 20` before any local build/lint check.

## Custom domain — rksitalia.it (in progress, not finished)

- Domain added in Vercel, purchased/registered via **Aruba**.
- User **switched the domain's nameservers entirely to Vercel's** (`ns1.vercel-dns.com` / `ns2.vercel-dns.com`), rather than just adding the single `A` record Vercel suggests. This means **Vercel is now the authoritative DNS for the whole domain** — Aruba's own DNS zone editor is no longer used/read.
- DNS propagation was still in progress as of last check (can take up to a few hours, sometimes longer for `.it` domains).
- **⚠️ Outstanding action**: because Aruba's DNS is bypassed now, the **MX record for the user's real Aruba mailboxes must be re-added inside Vercel's DNS settings** for this domain, or incoming mail to their Aruba inboxes will stop working. Waiting on the user to provide the exact MX record value(s) from Aruba (hostname + priority) — do not guess this value, wrong MX = silently bounced mail.
- Once that's done: `vercel dns add rksitalia.it @ MX <priority> <value>` (via CLI, already authenticated in this environment) is the way to add it.

## Email system — what's wired vs. still placeholder

Built this session: branded email templates (already existed in `lib/email-templates/` but were orphaned/never wired in) are now connected to all enquiry routes, and recipient addresses are CMS-configurable via Sanity Site Settings → Contact tab (`salesEmail`, `tradeEmail`, `partsEmail`, `teamNotificationEmail` — the latter two are new fields added this session). See `lib/sanity.server.ts` → `getNotificationSettings()` for the CMS-first/env-fallback logic.

**Still using placeholder values on Vercel (production env vars) — must be replaced:**
- `RESEND_FROM_EMAIL` = `onboarding@resend.dev` (Resend's sandbox sender — works for testing, but not a real branded domain). Needs the Aruba sending subdomain (e.g. `mail.rksitalia.it`) verified in Resend first (SPF + DKIM TXT records added to DNS — now via Vercel's DNS panel, not Aruba's, per the nameserver change above), then update this var and redeploy.
- `TEAM_NOTIFICATION_EMAIL`, `SALES_TEAM_EMAIL`, `PARTS_TEAM_EMAIL`, `TRADE_TEAM_EMAIL` = all currently set to the user's own Gmail (`born04416@gmail.com`) as a safe fallback so nothing crashes. **Every form submission is currently emailing the user's personal Gmail**, not real team inboxes. Fix via Sanity Studio → Site Settings → Contact tab (takes effect immediately, no redeploy needed) once real Aruba mailboxes exist for these roles.
- Real, correctly-configured: Sanity project ID/dataset/API token, Resend API key, `NEXT_PUBLIC_APP_URL` / `SANITY_STUDIO_URL` (pointing at the Vercel URL above).

## Other fixes made this session (code, not deployment)

- `/compare` page was fully hardcoded with fake motorcycle data (combustion-engine specs on an e-bike brand) — rebuilt to pull real models from Sanity (`queries.compareModels` in `lib/sanity.ts`).
- Fixed real bugs found via `tsc`/`eslint`: a `Buffer`/`BodyInit` type error in the invoice PDF route, Framer Motion `Variants` typing errors on `/news` and `/prices`, a couple of React hook lint issues.
- A full `eslint` pass still shows ~80 pre-existing `no-explicit-any` errors scattered across `sanity/schemas/*.ts` and various pages — not touched yet, flagged as later cleanup, not blocking.
