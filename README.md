# Adagio

Adagio is a Persian, right-to-left streetwear storefront built with Next.js. It provides the customer-facing experience for browsing products, managing a cart and wishlist, signing in with a phone number and one-time password (OTP), and maintaining delivery addresses.

This repository is the **frontend and backend-for-frontend (BFF) layer**. It does not include a database, payment provider, or business backend. A compatible backend is required for the application to work.

**Architecture:** [English](ARCHITECTURE.md) · [فارسی](ARCHITECTURE.fa.md)

## Features

- Product catalog with collections, filtering, search, and pagination
- Product detail pages and image galleries
- Guest and signed-in shopping carts
- Account-only wishlist
- Phone-number and OTP authentication
- Session-aware account state
- Saved delivery addresses with province and city selection
- Checkout information flow
- Static blog and informational pages
- Persian (`fa`) and RTL interface with local fonts

> **Current status:** The checkout user interface is available, but a payment gateway is not connected. The UI is currently Persian-only; it does not implement a general internationalization system.

## Technology stack

| Area                 | Libraries and tools                                                  |
| -------------------- | -------------------------------------------------------------------- |
| Framework            | Next.js 15 (App Router), React 19, TypeScript                        |
| Styling              | Tailwind CSS 4, `tailwind-merge`, `clsx`, `class-variance-authority` |
| UI                   | shadcn/ui, Base UI, Lucide icons, `cmdk`                             |
| Data and state       | TanStack React Query                                                 |
| Forms and validation | React Hook Form, Zod                                                 |
| Animation            | Motion                                                               |
| Quality and build    | ESLint, Next.js ESLint config, Docker, Node.js 22                    |

## Prerequisites

- Node.js 22 or newer
- npm
- A reachable Adagio-compatible backend API
- A backend that manages cart and authenticated user sessions with HTTP cookies

## Configuration

Copy the example environment file and provide the URLs for your deployment:

```bash
cp .env.exampel .env.local
```

| Variable                        | Required | Description                                                                             |
| ------------------------------- | -------- | --------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_BACKEND_BASE_URL`  | Yes      | Base URL of the backend that serves catalog, cart, wishlist, account, and address APIs. |
| `NEXT_PUBLIC_FRONTEND_BASE_URL` | Yes      | Public URL of this Next.js storefront.                                                  |
| `NODE_ENV`                      | No       | Environment mode: `development` or `production`.                                        |

`NEXT_PUBLIC_*` values are exposed to the browser and are embedded at build time. Do not place secrets in them. Changing either value requires a new production build.

## Local development

```bash
npm install
npm run dev
```

The development server runs on [http://localhost:3030](http://localhost:3030).

| Command         | Description                                           |
| --------------- | ----------------------------------------------------- |
| `bun dev`   | Start the development server on port 3030.            |
| `npm run lint`  | Run ESLint.                                           |
| `bun run build` | Create a production build.                            |
| `bun start` | Start the production server after a successful build. |

## Backend and session requirements

The backend owns all business data and authentication. At minimum, it must provide APIs for:

- Products, categories, collections, and product images
- Cart creation and cart item updates for guests and members
- Phone login and OTP verification
- The current authenticated user/session
- Wishlist and saved addresses for authenticated users
- Provinces and cities used by address forms
- Order and payment processing when payment is implemented

### How sessions work

The browser calls same-origin Next.js route handlers under `/api/*` for session-sensitive operations. These handlers forward requests and the incoming `Cookie` header to the external backend. This BFF pattern allows the storefront to work with cookie-based sessions without exposing cross-origin session handling to client components.

After successful OTP verification, the backend **must set session cookies** in its `Set-Cookie` response headers. The proxy forwards every cookie individually to the browser, including multi-cookie responses such as access and refresh sessions. On later requests, the browser sends the session cookie to the same-origin `/api/*` route, and the route forwards it to the backend.

For a reliable deployment, configure the backend cookie attributes and origin policy for the frontend's public URL. In particular:

- Use secure cookie settings in HTTPS production deployments.
- Keep the session cookie available to the storefront's proxy routes.
- Return all cookies needed to restore an authenticated session.
- Ensure the backend accepts requests from the deployed frontend/proxy topology.

Catalog and collection data can be fetched server-side and cached; session, cart, wishlist, and address data are treated as dynamic data.

## Docker deployment

The included multi-stage Docker image creates a standalone Next.js build and exposes port 3000.

```bash
cp .env.exampel .env
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). Docker Compose passes the public URLs as build arguments and runtime environment variables. Because `NEXT_PUBLIC_*` variables are bundled during `npm run build`, rebuild the image after changing them:

```bash
docker compose up --build
```

## Project structure

| Path          | Purpose                                                                   |
| ------------- | ------------------------------------------------------------------------- |
| `app/`        | App Router pages, layouts, and same-origin API route handlers.            |
| `components/` | Storefront, authentication, cart, checkout, and shared UI components.     |
| `hooks/`      | Client hooks for account, cart, wishlist, and bootstrap data.             |
| `lib/`        | Data access, application state, React Query configuration, and utilities. |
| `services/`   | Client-facing API service functions.                                      |
| `types/`      | TypeScript declarations for backend domain data.                          |
| `utils/`      | Server utilities, including safe forwarding of backend session cookies.   |

## Participation and use

This project is free and open for anyone to use, study, modify, and share, including for commercial purposes, under the [MIT License](LICENSE).

By contributing, you agree to:

- Submit work you are allowed to share and that does not infringe third-party rights.
- Keep applicable copyright and license notices intact.
- Describe material changes clearly in commits or pull requests.
- Treat other participants respectfully and focus contributions on improving the project.
- Accept that maintainers may review, revise, or decline contributions to protect project quality and security.

The software is provided without warranty. Read the full [LICENSE](LICENSE) for the complete terms.

## Contributing

1. Fork the repository and create a focused branch.
2. Keep changes small, typed, and consistent with the existing App Router and component patterns.
3. Run `npm run lint` and `npm run build` before opening a pull request.
4. Explain user-visible changes, backend-contract changes, and any required environment updates in the pull request.

For backend changes, preserve the cookie-based session contract described above. Any route that proxies a backend response carrying session cookies must forward every `Set-Cookie` value independently.
