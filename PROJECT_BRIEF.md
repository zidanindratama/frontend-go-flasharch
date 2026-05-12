# Project Brief: Go FlashArch Frontend

Last updated: 2026-05-12

## One-Liner

Go FlashArch is an e-commerce frontend with normal shopping, buyer authentication, admin management, and a high-performance flash sale flow backed by Golang, Redis, RabbitMQ, PostgreSQL, and centralized observability.

## Source Context

This project is based on the thesis:

**"Perancangan Arsitektur Backend High-Performance pada Sistem Flash Sale melalui Integrasi Message Broker, In-Memory Cache, dan Observability Terpusat"**

Author: Muhamad Zidan Indratama, NPM 50422968, Informatics, Universitas Gunadarma.

The thesis problem is a classic flash sale failure mode: extreme concurrent checkout traffic can overload the main database, increase latency, create deadlocks, and trigger over-selling. The proposed backend architecture prevents this by validating and decrementing stock atomically in Redis, queueing checkout work through RabbitMQ, persisting final state to PostgreSQL, and monitoring the whole system through Loki, Grafana, Tempo, and Prometheus.

## Product Goal

Build a polished e-commerce application where customers can register, login, browse products, buy regular items, and participate in flash sales.

The frontend should feel like a real commerce product with a strong technical backbone. It should not be only a thesis explainer. The thesis architecture should appear naturally inside the flash sale, admin, observability, and load-test parts of the product.

The app should help users see:

- how buyers browse and buy products,
- how admins manage products, stock, and flash sale campaigns,
- how flash sale traffic enters the system,
- how stock safety is protected,
- how queue-based processing stabilizes writes,
- how observability exposes logs, metrics, and traces,
- how K6 load testing proves latency, throughput, and over-selling resistance.

## Primary Audience

- Buyers who register, login, browse products, checkout, and join flash sales.
- Admin users who manage catalog, inventory, orders, and flash sale sessions.
- Thesis examiners and academic reviewers who need to understand the research contribution quickly.
- Backend and platform engineers evaluating the architecture.
- Developers who may continue the codebase and need strong project context.
- Demo viewers who need a clear product story before seeing backend internals.

## Core Research Questions To Preserve

1. How can a backend architecture using Redis and RabbitMQ process high concurrent checkout requests without overloading PostgreSQL and without over-selling?
2. How can centralized observability using Loki, Grafana, Tempo, and Prometheus help trace bottlenecks, failures, and recovery signals in an asynchronous system?

## System Scope

Included:

- Buyer registration, login, session-aware UI, and account states.
- Admin login and protected admin dashboard.
- Product catalog, product detail, cart or direct checkout, and regular purchase flow.
- Product and inventory management for admins.
- Order list and order detail for buyers and admins.
- Flash sale campaign listing, campaign detail, product listing, and stock visibility.
- High-concurrency checkout simulation or demo flow.
- Stock state derived from backend data.
- Queue state, order state, and processing feedback.
- Observability-oriented screens or sections for metrics, logs, traces, and system health.
- Load test results or K6-oriented visualizations.

Excluded:

- Full marketplace or multi-vendor e-commerce.
- Real payment gateway settlement unless the backend explicitly supports it.
- Shipping provider integration unless the backend explicitly supports it.
- Coupons, reviews, wishlist, recommendation engine, marketplace seller center, or complex loyalty features.
- Deep account settings beyond buyer/admin identity, order history, and demo needs.

## Backend Architecture Narrative

The UI should consistently tell this story:

1. Buyers can shop normally through the catalog, product detail, cart, and checkout.
2. Admins manage products, stock, orders, and flash sale campaigns.
3. During a flash sale launch, traffic spikes far beyond normal shopping traffic.
4. The frontend sends checkout intent to the backend API.
5. Redis performs fast atomic stock validation and stock decrement.
6. Valid flash sale checkout work is pushed to RabbitMQ.
7. Workers consume queue messages and write final transaction data to PostgreSQL.
8. Prometheus records metrics, Loki stores logs, Tempo captures traces, and Grafana visualizes system health.
9. K6 load testing verifies throughput, latency, and stock correctness under concurrent requests.

## Current Frontend Stack

- Framework: Next.js App Router, currently Next 16.
- Language: TypeScript.
- UI system: shadcn/ui, style `radix-nova`.
- Styling: Tailwind CSS v4 using `app/globals.css` and CSS variables.
- Primary font direction: Plus Jakarta Sans via `next/font/google`.
- Icons: lucide-react.
- Animation: framer-motion.
- Server/client split: page files should stay clean, route-level, and mostly server-rendered. Components that use motion, hooks, browser APIs, state, or event handlers must use `"use client"`.

## Engineering Principles

- `page.tsx` files compose sections only. They should not hold business logic, long markup, animation logic, or data transformation.
- Each route gets a feature folder under `components/main/<route>/`.
- Shared blocks live in `components/common/`.
- shadcn primitives in `components/ui/` are treated as design-system source code. Prefer composing existing primitives before creating custom markup.
- Use semantic color tokens and reusable constants where possible.
- Keep API/data logic outside page files. Prefer `lib/`, `hooks/`, server actions, route handlers, or feature-local data files depending on the final architecture.
- Preserve clean imports using the configured aliases: `@/components`, `@/components/ui`, `@/lib`, and `@/hooks`.

## Suggested Route Map

Minimum strong product:

- `/` storefront home: featured products, active flash sale, categories, and commerce entry points.
- `/login` buyer/admin login.
- `/register` buyer registration.
- `/products` regular product catalog.
- `/products/[slug]` product detail and buy/cart action.
- `/cart` cart review for regular checkout if cart is in scope.
- `/checkout` checkout flow for regular purchases.
- `/orders` buyer order history.
- `/orders/[id]` buyer order detail.
- `/flash-sale` active and upcoming flash sale campaigns.
- `/flash-sale/[slug]` flash sale product flow with stock, checkout CTA, and state transitions.
- `/admin` admin dashboard overview.
- `/admin/products` admin product and inventory management.
- `/admin/orders` admin order management.
- `/admin/flash-sales` admin flash sale campaign management.
- `/architecture` visual system flow: Frontend, API, Redis, RabbitMQ, Worker, PostgreSQL, LGTP.
- `/observability` admin/ops metrics, logs, and traces dashboard inspired by Grafana without pretending to be Grafana itself.
- `/load-test` K6 result summary: throughput, latency, failed requests, stock correctness.
- `/about` thesis context, author, research goal, and technology rationale.

Optional:

- `/profile` buyer profile.
- `/admin/users` basic user management if backend supports it.
- `/admin/settings` basic operational settings if needed.

## Definition Of Done

A feature is done when:

- it supports the e-commerce product and, where relevant, the thesis story,
- it works responsively on mobile and desktop,
- it has smooth motion that enhances comprehension,
- it has clear loading, empty, success, failure, and disabled states,
- it uses shadcn components where appropriate,
- it keeps route files thin,
- it does not add unrelated marketplace scope,
- it can be explained in a thesis demo without extra context.

## AI Collaboration Rules

When coding in this repo:

- Read `PROJECT_BRIEF.md`, `PROJECT_PRODUCT.md`, and `PROJECT_DESIGN.md` before making design or product decisions.
- Do not turn the app into a generic portfolio, SaaS template, or thin thesis dashboard.
- Build real e-commerce flows first: auth, catalog, product detail, checkout, orders, and admin.
- Keep flash sale UI decisions tied to reliability, asynchronous processing, stock safety, or observability.
- Prioritize clarity, demo value, and engineering credibility.
- If adding a new page, create route-level components first, then keep `page.tsx` as a composition shell.
