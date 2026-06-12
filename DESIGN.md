# Project Design: Go FlashArch Frontend

Last updated: 2026-05-12

## Design Direction

Design the interface like a modern e-commerce product with an operations-grade flash sale core: shoppable, urgent, precise, fast, and controlled.

The visual system should combine customer-facing commerce clarity with infrastructure credibility. The app should not feel like a generic dark dashboard, a simple store template, or a decorative portfolio site.

If a future AI agent explores visual variants, it should propose distinct directions first instead of jumping into a generic screen. Each direction must explain its product reasoning and stay grounded in the flash sale, backend reliability, and observability story.

Scene sentence:

A buyer is shopping on a laptop or phone, an admin is monitoring stock and orders, and a thesis reviewer is watching the flash sale flow prove backend reliability under pressure.

Theme implication:

Use a light-first storefront surface with charcoal admin and operations sections where they improve focus. Dark panels are allowed for observability, admin monitoring, and terminal-like operational areas, but the whole app should not become a flat dark dashboard.

## Color Strategy

Use a committed action palette with restrained neutrals.

Brand colors requested:

- Primary action: Crimson Red `#DC143C`
- Primary action alternative: Blaze Orange `#FF6600`
- Secondary neutral: Charcoal Black `#333333`
- Health accent: Neon Green `#39FF14`

Recommended role split:

- Blaze Orange: main CTA, checkout action, flash sale launch, active flow highlights.
- Crimson Red: urgency, low stock, sold out, destructive or failure moments.
- Charcoal Black: text, deep panels, navigation, high-contrast infrastructure surfaces.
- Neon Green: only for healthy service status, available stock, successful checks, and Grafana-like system health.

Do not use Neon Green as a general accent. It should remain meaningful.

## Suggested Semantic Tokens

The project uses Tailwind v4 and shadcn CSS variables in `app/globals.css`. Prefer semantic variables over raw colors in components.

Suggested variable mapping:

```css
:root {
  --background: oklch(0.985 0.006 78);
  --foreground: oklch(0.235 0.005 40);
  --card: oklch(0.995 0.004 78);
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);

  --primary: oklch(0.69 0.22 42);
  --primary-foreground: oklch(0.99 0.006 78);
  --secondary: oklch(0.235 0.005 40);
  --secondary-foreground: oklch(0.98 0.006 78);
  --accent: oklch(0.86 0.29 139);
  --accent-foreground: oklch(0.18 0.006 135);

  --destructive: oklch(0.58 0.23 24);
  --destructive-foreground: oklch(0.99 0.006 78);
  --muted: oklch(0.94 0.008 78);
  --muted-foreground: oklch(0.48 0.006 40);
  --border: oklch(0.88 0.009 78);
  --input: oklch(0.9 0.009 78);
  --ring: var(--primary);
}
```

If the UI needs a darker operations surface:

```css
--ops-background: oklch(0.21 0.006 40);
--ops-foreground: oklch(0.96 0.006 78);
--ops-grid: oklch(0.35 0.012 40 / 35%);
--health: oklch(0.86 0.29 139);
--warning: oklch(0.76 0.18 72);
--critical: oklch(0.58 0.23 24);
```

## Visual Hierarchy

Use strong hierarchy, not busy decoration.

- Storefront hero: active flash sale, featured products, and one clear shopping action.
- Admin hero: order, stock, queue, and service health summary.
- Section headings: short, concrete, and tied to system behavior.
- Metrics: compact and scannable, with units and state labels.
- Architecture diagrams: animated flow lines and staged reveal, not static clip-art.
- Observability sections: dense but readable, with table/chart/log affordances.

Avoid:

- gradient text,
- decorative glass cards,
- repeated same-size icon cards,
- oversized marketing sections that delay the actual product,
- one-note red/orange surfaces everywhere.

## Typography

Use **Plus Jakarta Sans** as the primary interface font. Do not use Inter as the main product font.

Recommended usage:

- Plus Jakarta Sans: product UI, headings, body, navigation, forms, product cards, admin tables, and checkout surfaces.
- Geist Mono or another clean mono font: trace IDs, queue names, metric labels, log snippets, timestamps.

Next.js setup direction:

```tsx
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
```

Guidelines:

- Use compact dashboard text in operational areas.
- Cap paragraph width around 65 to 75 characters.
- Keep button labels short.
- Use uppercase sparingly for labels such as `QUEUE DEPTH`, `P95 LATENCY`, or `STOCK SAFE`.
- Letter spacing should stay at `0` unless a specific small label needs mild tracking from an existing component pattern.

## Layout Principles

- Put the actual product experience on the first viewport.
- Let the storefront hero include products and flash sale state, not just copy.
- Let admin pages prioritize tables, filters, forms, and operational status over decorative hero sections.
- Use full-width sections or clear operational bands.
- Avoid nested cards.
- Cards are for repeated entities: products, orders, metrics, logs, traces, and service health.
- Use stable dimensions for dashboards, diagrams, icon buttons, and metric tiles so animation does not shift layout.
- On mobile, prioritize one-column clarity and sticky critical actions where useful.

## Motion Direction

Motion should communicate system flow and pressure.

Required behavior from the user request:

- Every major section should have smooth micro-animation.
- Scroll-triggered animations should replay when the section enters the viewport again.
- Do not set `viewport={{ once: true }}` for these repeated section animations.

Use:

```tsx
viewport={{ once: false, amount: 0.25 }}
```

Preferred motion patterns:

- `whileInView` fade and rise for section content.
- `useScroll` plus `useTransform` for background flow lines, large labels, timelines, and architecture movement.
- Subtle staggered children for products, order rows, forms, and metrics.
- Animated queue pulses to show buffering.
- Count-up metrics only when useful and not distracting.
- Hover or tap micro-interactions on CTA, product cards, toggles, and diagram nodes.

Avoid:

- bounce and elastic easing,
- layout-property animation,
- excessive parallax,
- animations that obscure text,
- animations that only fire once in long pages.

Suggested transition:

```ts
const smoothEase = [0.16, 1, 0.3, 1];

const sectionReveal = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: smoothEase },
  },
};
```

## Component Style Rules

Use shadcn components first:

- Button for commands.
- Badge for status.
- Card for repeated products and metrics.
- Field, Input, Select, Checkbox, and related form primitives for login, register, checkout, product forms, and campaign forms.
- Table for structured logs or results.
- Tabs for switching logs, metrics, and traces.
- Tooltip or HoverCard for technical definitions.
- Chart wrapper for Recharts visualizations.
- Skeleton for loading states.
- Alert for system failures or test warnings.
- Progress for queue or load test progress.

shadcn conventions:

- Use `gap-*`, not `space-x-*` or `space-y-*`.
- Use `size-*` when width and height match.
- Use `cn()` for conditional classes.
- Do not manually override shadcn component colors unless the design token supports it.
- Icons in buttons should use lucide-react and be placed as proper button content.

## Status Language And Color

Stock status:

- Available: Neon Green accent, clear positive state.
- Limited: Blaze Orange or warning token.
- Sold out: Crimson Red or destructive token.

System health:

- Healthy: Neon Green.
- Degraded: warning amber.
- Down: Crimson Red.
- Unknown: muted neutral.

Checkout:

- Validating: animated neutral.
- Reserved: Neon Green but quieter than final success.
- Queued: Blaze Orange pulse.
- Processing: Charcoal panel with moving progress.
- Confirmed: Neon Green.
- Failed: Crimson Red.

Authentication:

- Login required: Blaze Orange or muted warning.
- Authenticated: neutral or Neon Green only when confirming access.
- Forbidden: Crimson Red.
- Admin role: Charcoal with clear badge treatment.

Orders:

- Pending: muted neutral.
- Paid or confirmed: Neon Green.
- Queued or processing: Blaze Orange.
- Cancelled or failed: Crimson Red.

## Page And Folder Rules

`page.tsx` files should only compose sections and export metadata.

Pattern:

```tsx
import type { Metadata } from "next";
import { CTA } from "@/components/common/cta";
import { StorefrontHero } from "@/components/main/home/storefront-hero";
import { FeaturedProducts } from "@/components/main/home/featured-products";
import { ActiveFlashSale } from "@/components/main/home/active-flash-sale";

export const metadata: Metadata = {
  title: "Go FlashArch",
  description:
    "E-commerce and flash sale platform powered by Redis, RabbitMQ, PostgreSQL, and centralized observability.",
};

export default function HomePage() {
  return (
    <main className="w-full">
      <StorefrontHero />
      <FeaturedProducts />
      <ActiveFlashSale />
      <CTA
        title="Ready for the drop?"
        subtitle="Enter the active flash sale."
        buttonText="View Flash Sale"
        href="/flash-sale"
      />
    </main>
  );
}
```

Interactive and animated components:

- Add `"use client"` only in files that need it.
- Keep animation variants near the component or in a small shared motion helper.
- Keep data fetching and business rules out of presentational components unless the feature is still mocked.

## Section Ideas

Overview:

- Storefront hero with featured products.
- Active flash sale status strip.
- Category or collection preview.
- Popular products.
- Architecture or stock safety proof as a lower-page credibility section.

Auth:

- Login form.
- Register form.
- Role-aware redirects.
- Clear unauthenticated and forbidden states.

Products:

- Product catalog with filters and sorting.
- Product detail with stock, price, image, description, and buy action.
- Cart or direct checkout state.

Admin:

- Dashboard summary.
- Product table and product form.
- Inventory controls.
- Order table and order status management.
- Flash sale campaign form and campaign table.

Flash Sale:

- Product grid with stock status.
- Checkout state machine timeline.
- Queue position or processing indicator.
- Result panel with trace ID.

Architecture:

- Request path animation.
- Redis atomic stock gate.
- RabbitMQ pressure buffer.
- Worker persistence step.
- PostgreSQL source of truth.
- LGTP monitoring overlay.

Observability:

- Service health board.
- Prometheus metric charts.
- Loki log stream.
- Tempo trace waterfall.
- Incident or bottleneck callout.

Load Test:

- K6 scenario configuration.
- Throughput and latency charts.
- Failed request breakdown.
- Oversell count, expected target is zero.
- Short thesis-ready interpretation.

## Anti-Patterns

Do not:

- make it a generic portfolio site,
- make it a generic product landing page,
- make it only a thesis explainer,
- bury the actual shopping flow below marketing copy,
- use Neon Green for decoration,
- use big metrics without context,
- use fake charts without labels or units,
- turn every section into a card grid,
- put business logic in route files,
- animate once and leave the rest of the page static.

## Design Quality Bar

The UI should feel:

- shoppable,
- fast,
- technical,
- alert,
- readable,
- controlled,
- thesis-demo ready.

It should make the viewer think: this is a real store, and when pressure spikes, the system remains observable, structured, and safe.

## Future Prototype Workflow

For high-fidelity explorations, create 2 or 3 meaningfully different variants before committing:

- Operations Room: dense, precise, Grafana-adjacent, best for observability-heavy demos.
- Storefront Command: urgent commerce surface with clear stock, checkout, auth, and flash sale drama, best for customer-flow demos.
- Architecture Lab: diagram-led and educational, best for thesis explanation and defense.

Validate the chosen direction in-browser before expanding it across pages. Check mobile, desktop, scroll motion replay, text overflow, and chart or diagram readability.
