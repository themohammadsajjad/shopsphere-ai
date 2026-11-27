# API Integration

## Primary Data Source

DummyJSON provides product catalogue data.

Configured base URL:

`NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com`

Primary product operations:

- `GET /products`
- `GET /products/:id`
- `GET /products/categories`
- `GET /products/search`

Product requests are routed through the product service and cached with TanStack Query.

## Local / Simulated Domains

The following are intentionally local in this frontend-only build:

- Authentication
- Cart
- Wishlist
- Checkout
- Orders
- Reviews
- Recommendation engine
- Recommendation analytics
- AI Shopping Assistant
- Admin write operations

## Recommendations

Recommendation calls are frontend service functions. Conceptually they map to:

- `/recommendations/personalized`
- `/recommendations/similar/:productId`
- `/recommendations/trending`
- `/recommendations/frequently-bought/:productId`

## Production Evolution

A production version would move authentication, orders, reviews, analytics, catalogue writes, payment, and recommendation-provider calls behind secured backend APIs with persistent storage.
