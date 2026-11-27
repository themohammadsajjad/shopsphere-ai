# ShopSphere AI

ShopSphere AI is a frontend-only personalized e-commerce application built with Next.js, React, TypeScript, Tailwind CSS, Zustand, TanStack Query, Vitest, and Playwright.

## Features

- Product discovery with search, filters, sorting, pagination, and comparison
- Product detail pages with stock-aware purchase controls
- Persistent cart and wishlist
- Six-step simulated checkout
- Local order history and tracking
- Reviews with sorting, rating distribution, voting, and local-order-derived Verified Purchase
- Nine explainable recommendation strategies
- Rule-Based / Mock AI Shopping Assistant with conversational refinement
- Admin catalogue, order management, and Local Analytics

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Zustand for local/client state
- TanStack Query for remote/cache state
- DummyJSON for product data
- Vitest + React Testing Library
- Playwright

No paid API, LLM provider, backend, database, or payment gateway is required.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment

```env
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com
NEXT_PUBLIC_USE_LOCAL_MOCKS=true
NEXT_PUBLIC_ENABLE_LOCAL_ANALYTICS=true
```

No secrets or API keys are required.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm test
npm run test:e2e
```

## Demo Accounts

Customer: `customer@shopsphere.dev` / `Customer123!`

Admin: `admin@shopsphere.dev` / `Admin123!`

These are local development fixtures only.

## Recommendation Architecture

`UI -> useRecommendations() -> Recommendation Service -> Recommendation Provider -> Mock Recommendation Engine -> DummyJSON + local signals`

Personalized scoring weights:

| Signal | Weight |
| --- | ---: |
| Category match | 0.22 |
| Price similarity | 0.15 |
| Tag overlap | 0.18 |
| Normalized rating | 0.15 |
| Recently viewed relation | 0.10 |
| Wishlist relation | 0.10 |
| Cart relation | 0.10 |

Each component is normalized to 0-1 before weighting.

Implemented strategies:

1. Recently Viewed
2. Similar Products
3. Category-Based
4. Price-Based
5. Wishlist-Based
6. Cart-Based
7. Frequently Bought Together
8. Trending Products
9. Personalized For You

## AI Shopping Assistant

The assistant is intentionally a **Rule-Based / Mock AI system**, not a real LLM. It parses structured shopping intent such as category, price, rating, and supported color keywords, then reuses existing product and recommendation services for results and similarity refinement.

## Persistence

Browser storage is used for development-stage persistence for authentication, cart, wishlist, checkout, orders, reviews, recommendation signals/analytics, admin simulations, and assistant session history.

## Documentation

- `docs/ARCHITECTURE.md`
- `docs/API_INTEGRATION.md`
- `docs/TESTING_REPORT.md`
- `docs/TECHNICAL_REPORT.md`

## Release Gate

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

The production deployment should be functionally equivalent to the verified local build.
