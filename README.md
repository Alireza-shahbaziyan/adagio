# Adagio

A Next.js (App Router) storefront frontend for the Adagio streetwear brand. Products, cart, wishlist, addresses, and phone/OTP auth are served by a separate backend; this repo is presentation, routing, and a same-origin proxy layer in front of it.

**Architecture docs:** [ARCHITECTURE.md](./ARCHITECTURE.md) (English) · [ARCHITECTURE.fa.md](./ARCHITECTURE.fa.md) (فارسی)

## Getting Started

```bash
npm install
cp .env.exampel .env.local   # fill in NEXT_PUBLIC_BACKEND_BASE_URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_BACKEND_BASE_URL` | Base URL of the external backend that owns products/cart/wishlist/auth |
| `NEXT_PUBLIC_FRONTEND_BASE_URL` | This app's own base URL |

See `.env.exampel` for the full list.

## Docker

```bash
cp .env.exampel .env   # docker compose reads ./.env for both build args and runtime env
docker compose up --build
```

This builds the production image (multi-stage `Dockerfile`, `output: "standalone"` in `next.config.ts`) and runs it on [http://localhost:3000](http://localhost:3000). `NEXT_PUBLIC_*` variables are compiled into the bundle at build time, so changing them requires `docker compose up --build` again, not just a container restart — see the comments in `Dockerfile`/`docker-compose.yml`.

---

# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Read the chat transcripts first.** There are 1 chat transcript(s) in `chats/`. The transcripts show the full back-and-forth between the user and the design assistant — they tell you **what the user actually wants** and **where they landed** after iterating. Don't skip them. The final HTML files are the output, but the chat is where the intent lives.

**Read `project/Home.dc.html` in full.** The user had this file open when they triggered the handoff, so it's almost certainly the primary design they want built. Read it top to bottom — don't skim. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `README.md` — this file
- `chats/` — conversation transcripts (read these!)
- `project/` — the `Minimalist music-inspired streetwear` project files (HTML prototypes, assets, components)

---

## Implementation status

The design above has been implemented as a Next.js 15 app (App Router, TypeScript, Tailwind CSS) at the root of this repo. See `app/` for the site, `lib/` for shared data, `components/` for shared UI. For how the pieces fit together — routing, the API proxy layer, auth/membership, state management — see [ARCHITECTURE.md](./ARCHITECTURE.md).
