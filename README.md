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

The design above has been implemented as a Next.js 15 app (App Router, TypeScript, Tailwind CSS) at the root of this repo. See `app/` for the site, `lib/` for shared data, `components/` for shared UI. Run `npm run dev` to start it.

## Authentication & membership

Login is phone number + OTP, no password. The flow: `components/Auth/LoginForm.tsx` collects a phone number and sends it via `app/api/auth/login/route.ts`, which proxies to the backend; the user then lands on `/login/[phonenumber]`, where `components/Auth/OtpForm.tsx` collects the 5-digit code and verifies it via `app/api/auth/verify-otp/route.ts`. All three `app/api/auth/*` routes are thin server-side proxies to the real backend (`NEXT_PUBLIC_BACKEND_BASE_URL`) — they exist so the backend's session cookie can be set same-origin, and forward the browser's cookies both directions rather than relying on cross-origin credentials, which the backend's cookie policy (`SameSite=Lax`) doesn't reliably support.

**Checking membership status:** use the `useMembership()` hook (`hooks/useMembership.ts`) — it's the one place in the app that should ever answer "is this visitor a registered member or a guest." It wraps the lower-level `useMe()` query (`hooks/useMe.ts` → `services/auth.service.ts`'s `getMe()` → `GET /api/auth/me`) and exposes:

```ts
const { user, isMember, isGuest, isLoading, isError } = useMembership();
```

It fails closed: `isMember` is only ever `true` once a user is successfully confirmed — a loading or errored check is treated the same as "guest" for any gating decision, so a slow network or a backend hiccup can never grant member-only access. Don't call `useMe()` directly outside this hook; add new membership-dependent logic against `useMembership()` instead of re-deriving it.

**Guest vs. member access:**
- The cart (`/cart`, `lib/cart.ts`, `app/api/cart/*`) works fully for guests — cart identity is a backend-issued `cart_token` cookie, unrelated to login state, so guests can add/update/remove items freely.
- Checkout (`components/CheckoutModal.tsx`) opens for everyone and its info-collection step (step 1) is guest-accessible too. Only the payment step (step 2) is gated: guests see a "log in to pay" prompt in place of the pay button, checked via `useMembership()`.
- On successful OTP verification, `OtpForm.tsx` invalidates both the membership and cart queries so the UI reflects the new signed-in state immediately, without waiting out `useMe()`'s cache staleness.
