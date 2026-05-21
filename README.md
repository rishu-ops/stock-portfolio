# Stock Portfolio

A simplified portfolio dashboard built with Next.js. Demonstrates the three
rendering strategies (SSR, CSR, ISR), HTTP-only cookie authentication, and
edge-runtime route protection.

## Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS 4**
- **jose** for JWT signing / verification (works in Edge runtime)
- **react-hot-toast** for notifications

## Quick start

```bash
# clone and install
git clone git@github.com:rishu-ops/stock-portfolio.git
cd stock-portfolio
npm install

# set up the JWT secret
cp .env.example .env.local
# open .env.local and replace JWT_SECRET with any long random string

# run the dev server
npm run dev
```

Open `http://localhost:3000` and log in with:

| Email             | Password |
|-------------------|----------|
| `test@finapp.com` | `123456` |

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── login/route.ts        POST: validate creds, sign JWT, set cookie
│   │   ├── logout/route.ts       POST: clear the session cookie
│   │   ├── portfolio/route.ts    GET:  returns mock holdings (auth required)
│   │   └── news/route.ts         GET:  returns mock news (public)
│   ├── dashboard/
│   │   ├── page.tsx              SSR server component, fetches /api/portfolio
│   │   ├── loading.tsx           skeleton fallback
│   │   ├── error.tsx             error boundary
│   │   └── _components/
│   │       ├── LivePortfolio.tsx CSR client component, ticks every 2.5s
│   │       └── PortfolioTable.tsx
│   ├── news/
│   │   ├── page.tsx              ISR, revalidate=30
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── login/page.tsx            form, client-side validation, POSTs /api/login
│   ├── page.tsx                  redirects / → /dashboard
│   ├── layout.tsx                root layout, Toaster, Footer
│   └── globals.css
├── components/
│   ├── Header.tsx                shared nav for protected pages
│   └── Footer.tsx
├── lib/
│   ├── auth.ts                   JWT sign/verify, cookie options, credentials
│   └── format.ts                 currency / percent / time-ago helpers
├── types/
│   ├── portfolio.ts
│   └── news.ts
└── proxy.ts                      Edge route protection (formerly middleware.ts)
```

> **Note on `proxy.ts`** — Next.js 16 renamed the `middleware.ts` convention
> to `proxy.ts` (function exported as `proxy` instead of `middleware`). The
> behavior is identical; the file still runs at the Edge.

## Rendering strategy

| Page          | Strategy | Why |
|---------------|----------|-----|
| `/dashboard`  | **SSR**  | Portfolio data must be fresh per request. `export const dynamic = "force-dynamic"` + `cache: "no-store"` defeats Next's default caching. |
| `/dashboard`  | **CSR** *(within SSR)* | Live price updates run client-side via `setInterval` inside `LivePortfolio.tsx`. The server provides the initial paint; the client takes over for ticks. |
| `/news`       | **ISR**  | News changes occasionally, not per request. `revalidate: 30` caches the page for 30 seconds and regenerates in the background after that. |
| `/login`      | CSR      | Static layout with client-side form state. |

### Why mix SSR + CSR on the dashboard

The SSR fetch produces a fast first paint with real data — no flash of empty
state. After hydration, `LivePortfolio` takes the SSR-seeded data as a prop
into `useState` and runs the live updates locally. This is the standard
"server-seeded client component" pattern and avoids making the live updates a
network round-trip on every tick.

### Why ISR for news (and not SSR)

A real news feed updates every few minutes, not on every page load. ISR
caches the rendered output and serves it instantly; visits within the
30-second window are served from cache with zero work. After 30 seconds, the
next visit serves the stale cache *and* triggers a background regeneration
("stale-while-revalidate"). The visit after that gets the new version.

You can prove ISR is working by refreshing `/news` and watching the
"Last regenerated at HH:MM:SS" label — it only changes once every 30+
seconds, not on every refresh.

## Authentication

### Flow

1. User submits credentials → `POST /api/login`
2. Server validates input, compares against the demo credentials
3. Server signs a JWT (HS256) with `{ sub, iat, exp }` using `JWT_SECRET`
4. JWT is set in an HTTP-only cookie (`session`) with `SameSite=Lax`,
   `MaxAge=3600`, `Secure` in production
5. Client receives 200 → `router.push("/dashboard")` → cookie travels
   automatically on subsequent requests
6. Logout → `POST /api/logout` → server clears the cookie

### Token

- Algorithm: **HS256** (symmetric — same key signs and verifies, fine for a
  single-process app; RS256 would be needed if a separate service had to
  verify without holding the signing key)
- Library: **`jose`** — works in both Node and Edge runtimes (the
  `jsonwebtoken` package depends on Node `crypto` and would crash inside
  `proxy.ts`)

### Validation — both sides

- **Client** ([login/page.tsx](src/app/login/page.tsx)): required-field
  check + email regex *before* hitting the network. UX feedback, not
  security.
- **Server** ([api/login/route.ts](src/app/api/login/route.ts)): JSON parse
  guard, type-check that `email`/`password` are non-empty strings,
  comparison against `VALID_CREDENTIALS`. **This is the real gate** — an
  attacker can bypass the form and hit `/api/login` directly.

## Route protection (Edge proxy)

[src/proxy.ts](src/proxy.ts) runs at the Edge for every request matching:

```ts
matcher: ["/dashboard/:path*", "/news/:path*", "/login"]
```

Behavior:

| Path           | Has valid session | Action                                 |
|----------------|-------------------|----------------------------------------|
| `/dashboard/*` | no                | 307 → `/login` (and clear bad cookie)  |
| `/dashboard/*` | yes               | continue                               |
| `/news/*`      | no                | 307 → `/login`                         |
| `/news/*`      | yes               | continue                               |
| `/login`       | yes               | 307 → `/dashboard` (already signed in) |
| `/login`       | no                | continue                               |

Token verification happens via `verifySessionToken(token)` from `lib/auth.ts`,
which wraps `jose.jwtVerify` in a try/catch and returns `null` for any
failure — bad signature, malformed payload, **expired token**. The
middleware spec explicitly asks for token-expiry validation at this level;
that's enforced by `jose.jwtVerify` rejecting tokens whose `exp` claim has
passed.

If the token exists but fails verification, the proxy also issues a
`Set-Cookie` with `MaxAge=0` so the bad cookie is cleared from the browser
on the redirect.

## Security considerations

**Mandatory**

- **HTTP-only cookie** — `httpOnly: true` blocks JavaScript from reading the
  token, mitigating XSS-based session theft. No token ever lives in
  `localStorage` or `sessionStorage`.
- **Server-side validation** of every input that comes from the network.
- **Proxy gates protected routes** at the Edge before the page code runs.
- **`JWT_SECRET` stays on the server** — only ever read via `process.env`
  inside `lib/auth.ts`; never sent to the client.

**Defense in depth**

- **CSRF mitigation** — `SameSite=Lax` on the session cookie. The browser
  won't send the cookie on cross-site POST/PUT/DELETE requests, blocking
  the most common CSRF attack class. (`Lax` rather than `Strict` so
  top-level navigation from external links to `/dashboard` still works.)
- **`Secure` flag in production** — cookie only transmitted over HTTPS when
  `NODE_ENV === "production"`.
- **XSS prevention** — React auto-escapes anything rendered in JSX; we never
  use `dangerouslySetInnerHTML`. No `eval` or other dynamic-code execution.
- **Auth check at the API route too** ([api/portfolio/route.ts](src/app/api/portfolio/route.ts))
  — even though the proxy gates the *page*, the API route independently
  verifies the session. Defense in depth, in case the matcher is ever
  misconfigured.
- **No secrets in error messages** — auth failures return generic
  `"Invalid credentials"` rather than distinguishing "user not found" from
  "wrong password".

## Logging (observability)

Console logging is used per the spec:

- `[auth] login success: <email>` / `[auth] login failed: <email>`
- `[auth] blocked /dashboard (no/invalid session)` (proxy-level)
- `[auth] logout`
- `[portfolio] unauthorized access attempt`
- `[dashboard] portfolio fetch failed: <status>` / `[news] fetch failed: <status>`

## Performance choices

- **SSR only where freshness is required** — dashboard re-fetches every
  request; news doesn't (ISR); login is static.
- **No client-side polling for prices** — pure local random walk derived
  from previous state. Zero network traffic after the initial SSR fetch.
- **`useMemo` for derived totals** in `LivePortfolio` — invested,
  currentValue, totalPL are computed once per tick, not on every component
  function call.
- **Functional `setState`** in the interval to avoid stale-closure reads
  and unnecessary effect re-runs.
- **Edge runtime for the proxy** — no Node cold-start, runs close to the
  user.
- **Proxy `matcher`** — proxy code runs only on three paths, not on static
  assets or other API routes.

## Optional enhancements implemented

- Loading skeletons for `/dashboard` and `/news` ([dashboard/loading.tsx](src/app/dashboard/loading.tsx), [news/loading.tsx](src/app/news/loading.tsx))
- Error boundaries for both protected routes ([dashboard/error.tsx](src/app/dashboard/error.tsx), [news/error.tsx](src/app/news/error.tsx))
- Toast notifications for login success/failure and logout
- TypeScript in strict mode
- Environment variable for the JWT secret
- Responsive layout (mobile-safe header, table horizontal scroll on small screens)
- Dark theme styled to feel like a finance product
- Clickable news cards linking to the source publication

## Not implemented

- WebSocket-based live updates (spec marks this as optional; current
  approach uses `setInterval` with a local random walk per the requirement
  that no external real-time libraries be added)
- Pagination/filtering on the news page (spec marks this as optional;
  6 mock articles render comfortably without pagination)

## Scripts

```bash
npm run dev      # start the dev server (Turbopack)
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## Environment variables

| Variable     | Required | Description                                          |
|--------------|----------|------------------------------------------------------|
| `JWT_SECRET` | yes      | HMAC key used to sign and verify session JWTs (HS256). Use a long random string. |
