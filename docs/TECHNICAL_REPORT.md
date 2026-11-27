# Final Technical Report

## Summary

ShopSphere AI was built as a frontend-only personalized commerce application with clear separation between UI, services, remote cache state, and local client state.

## Key Decisions

### Zustand vs TanStack Query

Remote DummyJSON data is managed with TanStack Query. Local customer and simulation state is managed with Zustand.

### Recommendation Architecture

Recommendation scoring is isolated behind service and provider boundaries so a future production recommendation provider can replace the mock implementation without rewriting UI components.

### Rule-Based Assistant

The assistant intentionally uses deterministic structured-intent parsing rather than a paid or hidden LLM integration.

### Local Persistence

Commerce and operational features that normally need a backend use browser persistence because backend infrastructure is outside the current project scope.

## Challenges

The main engineering challenge was maintaining consistent state across cart, checkout, orders, reviews, and personalization while keeping recommendation logic outside React components.

Another challenge was preserving deterministic automated tests while using a public product API. Critical Playwright flows therefore mock external catalogue responses.

## Performance Trade-offs

Recommendation rails can require broad catalogue data for ranking. TanStack Query caching and bounded result sizes limit repeated UI work. In a production system, ranking would typically move server-side.

Non-critical assistant and admin interfaces are dynamically loaded.

## Production Next Steps

A production version would add:

- Persistent backend/database
- Server-side authentication and authorization
- Real payment integration
- Durable orders and reviews
- Inventory service
- Server-side analytics
- ML/LLM provider integration
- Observability and monitoring
- CI/CD quality gates
