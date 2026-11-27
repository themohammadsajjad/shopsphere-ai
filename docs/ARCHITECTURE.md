# Architecture

## Organization

ShopSphere AI uses a feature-based structure.

- `src/app` — App Router routes and composition
- `src/features` — domain UI and feature logic
- `src/services` — API/service orchestration
- `src/store` — Zustand client state
- `src/types` — shared domain models
- `src/hooks` — shared stateful logic
- `src/utils` — pure helpers

## State Management

TanStack Query owns remote/cache state such as DummyJSON products. Zustand owns local client state such as cart, wishlist, orders, reviews, authentication, recommendation signals, analytics, and simulated admin state.

## Recommendation Layers

`UI -> hook -> service -> provider -> mock engine`

Scoring and filtering logic stays outside React presentation components. The provider boundary is designed so a future ML/LLM-backed provider can replace the mock engine without rewriting the UI.

## AI Assistant

The assistant is rule-based. Structured intent parsing is separated from the UI. The assistant service reuses product filtering and recommendation services instead of creating a parallel catalogue engine.

## Authentication

Authentication uses a local JWT-like session object, persisted client-side, with role-aware protected routes. It is a development-stage simulation, not a production identity system.

## Performance

- App Router route splitting
- Dynamic loading for non-critical assistant/admin UI
- Next.js Image optimization
- Debounced search
- TanStack Query stale-time and request deduplication
- Pagination for large product lists
- Memoization in list/filter-heavy components
- Skeleton loading states

## Accessibility

The app uses semantic landmarks, keyboard-accessible controls, visible focus states, ARIA where needed, live regions for dynamic content, and an assistant dialog with Escape handling, focus trapping, and focus return.
