# Project Product: Go FlashArch Frontend

Last updated: 2026-05-12

## Product Identity

Name: **Go FlashArch**

Category: e-commerce application, flash sale platform, thesis companion, and admin operations interface.

Register: product UI with strong technical storytelling.

The product is a real e-commerce experience first. It supports normal product browsing and purchasing, buyer registration, buyer login, admin login, admin product management, order management, and flash sale campaigns. The thesis architecture powers and explains the flash sale part.

## Product Promise

Go FlashArch lets buyers shop normally and join flash sales while giving admins the controls and observability needed to manage stock, orders, and high-pressure campaigns.

## Product Pillars

1. **Stock integrity first**
   The interface should repeatedly show that stock safety is the core promise for both normal purchases and flash sale purchases. "Sold out", "reserved", "queued", "failed", and "confirmed" states must be visually distinct.

2. **Real commerce flow**
   Buyers should be able to register, login, browse products, inspect product detail, buy regular products, view orders, and join flash sales without needing to understand the backend.

3. **Admin control**
   Admins should manage products, stock, orders, and flash sale campaigns from protected admin pages with clear operational feedback.

4. **Traffic pressure made visible**
   Users should see bursts, queue depth, throughput, latency, and worker processing as real product signals, not decorative metrics.

5. **Observability as a feature**
   Logs, metrics, traces, and health signals are part of the product story. Observability is not a hidden backend concern.

6. **Academic clarity**
   The UI must be impressive, but it should still help explain the thesis during a formal demo.

## User Types

### Buyer

Needs:

- Register and login.
- Browse products and product details.
- Buy regular products through cart or direct checkout.
- Join flash sale campaigns.
- See checkout status clearly.
- View order history and order detail.

Success moment:

- Can buy a regular product and understand whether a flash sale checkout is confirmed, queued, rejected, or sold out.

### Admin

Needs:

- Login to protected admin pages.
- Create, edit, and deactivate products.
- Manage stock and flash sale stock allocation.
- Create and monitor flash sale campaigns.
- View and update order status.
- Inspect operational health during flash sale traffic.

Success moment:

- Can launch or manage a flash sale and see stock, queue, order, and system health without leaving the admin flow.

### Thesis Reviewer

Needs:

- Understand what problem is solved.
- See why Redis, RabbitMQ, PostgreSQL, and LGTP are used together.
- See clear proof points from load testing.
- Trust that the app scope matches the research boundaries.

Success moment:

- Can explain the architecture back in one or two minutes.

### Demo Operator

Needs:

- Login as buyer or admin.
- Launch or describe a flash sale scenario.
- Show normal purchase flow before showing flash sale behavior.
- Show stock movement and checkout results.
- Show queue and observability health.
- Recover gracefully when backend data is loading or unavailable.

Success moment:

- Can run a smooth demo without hunting through the UI.

### Engineer Or Developer

Needs:

- Identify frontend structure quickly.
- Understand route and component ownership.
- Know where API integration should live.
- See typed, maintainable UI states.

Success moment:

- Can add a new route or section without breaking project conventions.

## Main User Journeys

### 1. Shop As A Buyer

Entry: `/`

Flow:

1. Buyer lands on storefront home.
2. Buyer sees featured products, categories, active flash sale, and navigation.
3. Buyer opens product detail.
4. Buyer adds to cart or starts direct checkout.
5. Buyer logs in or registers if needed.
6. Buyer completes checkout and sees order confirmation.

### 2. Register And Login

Entry: `/register`, `/login`

Flow:

1. Buyer registers with required identity fields.
2. Buyer logs in and lands back in the intended flow.
3. Admin logs in through the same login page or an admin-specific route.
4. UI routes users by role to storefront or admin dashboard.

Important states:

- `unauthenticated`: user needs login.
- `authenticating`: credentials are being checked.
- `authenticated`: session is active.
- `forbidden`: user is logged in but lacks role access.
- `expired`: session needs refresh or re-login.

### 3. Buy Through Flash Sale

Entry: `/flash-sale`

Flow:

1. Buyer sees active and upcoming flash sale campaigns.
2. Buyer opens an active campaign.
3. Buyer sees products with live stock and sale timing.
4. Buyer initiates flash sale checkout.
5. UI shows immediate validation or reservation feedback.
6. UI shows queued or processing state if backend uses asynchronous confirmation.
7. UI resolves into confirmed, rejected, sold out, or retryable failure.

Important states:

- `available`: stock can be checked out.
- `limited`: stock is low and action urgency increases.
- `reserved`: Redis accepted the stock decrement.
- `queued`: checkout message is waiting in RabbitMQ.
- `processing`: worker is handling the message.
- `confirmed`: PostgreSQL persistence succeeded.
- `sold_out`: atomic stock validation failed.
- `failed`: system failure, not stock failure.

### 4. Operate As Admin

Entry: `/admin`

Flow:

1. Admin logs in.
2. Admin sees sales, orders, stock, service health, and active flash sale summary.
3. Admin manages products and stock.
4. Admin creates or edits flash sale campaigns.
5. Admin watches queue and checkout health during a campaign.
6. Admin opens orders to inspect buyer purchase outcomes.

### 5. Inspect Architecture

Entry: `/architecture`

Flow:

1. User sees the request path from frontend to API.
2. Redis is shown as the fast atomic stock gate.
3. RabbitMQ is shown as pressure buffer.
4. Worker and PostgreSQL are shown as controlled persistence.
5. LGTP observability wraps the flow.

The architecture page should avoid static textbook diagrams. Use gentle scroll-driven motion so the data path comes alive repeatedly.

### 6. Monitor System Health

Entry: `/observability`

Flow:

1. User sees Prometheus-style metrics such as request rate, latency, queue depth, worker throughput, and failed requests.
2. User sees Loki-style log stream previews for checkout, queue, and worker events.
3. User sees Tempo-style trace timing for one checkout request.
4. User sees Grafana-inspired status panels for backend, Redis, RabbitMQ, PostgreSQL, and LGTP components.

Do not clone Grafana chrome. Borrow the density and operational feel, then adapt it to this product.

### 7. Present Load Test Evidence

Entry: `/load-test`

Flow:

1. User sees K6 scenario summary.
2. User sees throughput, latency percentiles, error rate, and final stock correctness.
3. User sees comparison between risky synchronous pressure and the intended asynchronous architecture if data is available.
4. User can explain the performance proof in thesis language.

## Information Architecture

Recommended navigation:

- Home
- Products
- Flash Sale
- Orders
- Account
- Admin
- Observability
- Load Test
- Architecture
- About

Public buyer navigation:

- Home
- Products
- Flash Sale
- Orders
- Login or Account

Admin navigation:

- Dashboard
- Products
- Orders
- Flash Sales
- Observability
- Load Test
- Architecture

Admin routes must feel like an internal tool. Buyer routes must feel like a real store. Architecture and load-test routes can be available for thesis/demo context, but should not dominate the buyer storefront.

## Content Tone

Tone should be:

- precise,
- confident,
- technical,
- commerce-friendly,
- concise.

Avoid:

- vague hype,
- generic startup copy,
- hard-selling e-commerce language,
- excessive academic paragraphs inside UI,
- jokes inside critical states.

Good UI copy examples:

- "Stock reserved"
- "Queued for worker"
- "PostgreSQL write pending"
- "No over-selling detected"
- "Redis rejected checkout: stock exhausted"
- "Trace captured across API, queue, and worker"
- "Login required to continue checkout"
- "Order confirmed"
- "Flash sale starts in 12 minutes"
- "Admin only"

Bad UI copy examples:

- "Shop now before it is gone!"
- "Revolutionary next-gen platform"
- "Everything is blazing fast"
- "Just a simple dashboard"

## Data Model Hints

Frontend entities that are likely useful:

```ts
type ProductStockState = "available" | "limited" | "sold_out";

type UserRole = "buyer" | "admin";

type AuthState = "unauthenticated" | "authenticating" | "authenticated" | "forbidden" | "expired";

type OrderStatus = "pending" | "paid" | "queued" | "processing" | "confirmed" | "cancelled" | "failed";

type CheckoutState =
  | "idle"
  | "validating"
  | "reserved"
  | "queued"
  | "processing"
  | "confirmed"
  | "sold_out"
  | "failed";

type ServiceHealth = "healthy" | "degraded" | "down" | "unknown";
```

Suggested domain objects:

- `User`: id, name, email, role, createdAt.
- `Product`: id, name, slug, image, description, category, price, initialStock, currentStock, status, isFlashSaleEligible.
- `CartItem`: productId, quantity, priceSnapshot.
- `Order`: id, userId, items, total, status, checkoutType, createdAt.
- `FlashSaleCampaign`: id, slug, title, startsAt, endsAt, status, products.
- `CheckoutAttempt`: id, productId, quantity, status, message, traceId, createdAt.
- `QueueMetric`: depth, publishRate, consumeRate, oldestMessageAge.
- `ServiceMetric`: serviceName, health, latencyMs, errorRate, lastSeenAt.
- `LoadTestResult`: vus, duration, requestsPerSecond, p95LatencyMs, failedRate, oversellCount.

## Component Ownership

Use this shape unless a future architecture decision changes it:

```txt
app/
  (main)/
    login/
      page.tsx
    register/
      page.tsx
    products/
      page.tsx
      [slug]/
        page.tsx
    cart/
      page.tsx
    checkout/
      page.tsx
    orders/
      page.tsx
      [id]/
        page.tsx
    flash-sale/
      page.tsx
      [slug]/
        page.tsx
    architecture/
      page.tsx
    observability/
      page.tsx
    load-test/
      page.tsx
  admin/
    page.tsx
    products/
      page.tsx
    orders/
      page.tsx
    flash-sales/
      page.tsx

components/
  common/
    cta.tsx
    section-heading.tsx
    metric-tile.tsx
    status-badge.tsx
  main/
    auth/
      login-form.tsx
      register-form.tsx
    products/
      product-grid.tsx
      product-card.tsx
      product-detail.tsx
    checkout/
      cart-summary.tsx
      checkout-form.tsx
      order-confirmation.tsx
    orders/
      order-list.tsx
      order-detail.tsx
    flash-sale/
      flash-sale-hero.tsx
      product-grid.tsx
      checkout-panel.tsx
      stock-timeline.tsx
    architecture/
      architecture-hero.tsx
      system-flow.tsx
      component-deep-dive.tsx
    observability/
      observability-hero.tsx
      metrics-board.tsx
      log-stream.tsx
      trace-waterfall.tsx
    load-test/
      load-test-hero.tsx
      k6-summary.tsx
      result-charts.tsx
  admin/
    admin-shell.tsx
    dashboard-summary.tsx
    product-form.tsx
    product-table.tsx
    order-table.tsx
    flash-sale-form.tsx
```

## Route File Rule

`page.tsx` only imports and composes components.

Acceptable:

```tsx
export default function FlashSalePage() {
  return (
    <main className="w-full">
      <FlashSaleHero />
      <ProductGrid />
      <CheckoutTimeline />
      <SystemHealthStrip />
    </main>
  );
}
```

Avoid:

- long arrays,
- state machines,
- fetch parsing,
- framer-motion configuration,
- large JSX sections,
- business rules,
- component-local copy that should be reusable.

## Success Metrics For The Frontend

- A reviewer understands the thesis contribution without reading the whole PDF.
- A buyer can register, login, browse, buy regular products, join flash sales, and inspect orders.
- An admin can login, manage products, manage stock, manage orders, and manage flash sales.
- The flash sale flow clearly distinguishes stock rejection from system failure.
- Observability is visible enough to support MTTR discussion.
- The app remains responsive and readable on mobile.
- The animation feels smooth, intentional, and repeatable on scroll.
- The codebase stays easy for AI agents and humans to extend.
