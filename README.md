# RKS E-Bikes website

Public website and content studio for [rksitalia.it](https://rksitalia.it): the Ape Ryder, RKS and Skyjet e-bike
ranges, genuine parts, dealer network, news and the B2B partner programme.

- **Next.js 16** (App Router, React 19, TypeScript), **Tailwind CSS 4**
- **Sanity** headless CMS, with the Studio embedded at `/studio`
- **Resend** for transactional email, **@react-pdf/renderer** for invoices

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local   # the two public Sanity values are enough to browse the site
npm run dev                  # http://localhost:3000, Studio at /studio
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server (webpack, 4 GB heap: the Studio is large) |
| `npm run dev:turbo` | Same with Turbopack |
| `npm run build` / `npm start` | Production build and server |
| `npm run check` | Type check and lint |

Without `SANITY_API_TOKEN` and `RESEND_API_KEY` the forms answer with an error instead of storing enquiries,
which keeps local development from writing to the production dataset.

## How it fits together

```
app/
  (site)/          public pages, rendered statically and revalidated every 60 s
  studio/          Sanity Studio
  api/             form endpoints, newsletter, invoice PDF, OG image
components/        layout, shared UI, Sanity image and rich text renderers
lib/
  sanity/          read client, GROQ queries, types, cached server fetch
  server/          server-only code: write client, mail, form handler, security
  email/           email layout and templates
  i18n/            English and Italian copy
  site.ts          brands, labels and site URL
sanity/            schemas, Studio dashboard and Studio translations
```

- **Content.** Pages read published content only. Editors change models, parts, news, dealers and site settings
  in the Studio; changes appear on the site within a minute.
- **Languages.** The interface is available in English and Italian (toggle in the header, stored in the browser).
  CMS content is single-language.
- **Forms.** Contact, trade application and parts requests post to `/api/enquiry-*`. Each request is checked for
  same-site origin, rate limited, validated with zod, stored as an enquiry document and confirmed by email. Team
  recipients are set in *Studio → Site Settings → Contact*, with the environment variables as fallback.
- **Enquiry list.** The "cart" collects models and parts in the browser and sends them through the contact form;
  there is no online checkout.
- **Invoices.** `POST /api/generate-invoice` renders an order as PDF. It is disabled unless `INVOICE_API_SECRET` is
  set and requires `Authorization: Bearer <secret>`.

## Environment

See [`.env.example`](.env.example). Secrets belong in the hosting provider's environment settings, never in the
repository.

## Deployment

The project builds on any Node.js host that supports Next.js 16; on Vercel no extra configuration is needed.
Set the environment variables, point the domain to the deployment and verify the sending domain in Resend before
going live.
