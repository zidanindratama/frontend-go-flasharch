import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Admin panel for Go FlashArch. Manage products, orders, flash sales, and system health.",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Overview
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1.5 max-w-lg text-sm text-muted-foreground leading-relaxed">
          Monitor sales, orders, stock, and system health from the admin panel.
          Use the sidebar to navigate between management sections.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
          <div className="h-5 w-5 rounded-sm bg-muted-foreground/20" />
        </div>
        <h2 className="mt-5 text-base font-semibold text-foreground">
          Ready to build
        </h2>
        <p className="mt-1.5 max-w-sm mx-auto text-sm text-muted-foreground leading-relaxed">
          Widgets and metrics will appear here.
          Select a section from the sidebar to get started.
        </p>
      </div>
    </div>
  )
}
