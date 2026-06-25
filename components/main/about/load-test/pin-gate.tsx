"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Gauge,
  Lock,
  Minus,
  Play,
  RefreshCw,
  Square,
  Terminal,
  Unlock,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

import {
  cancelLoadTestRun,
  createLoadTestSession,
  getLoadTestRun,
  listLoadTestRuns,
  listLoadTestScenarios,
  startLoadTestRun,
  type LoadTestRun,
  type LoadTestScenario,
  type ScenarioConfig,
} from "@/lib/api/load-tests"
import { getErrorMessage } from "@/lib/api/errors"
import { cn } from "@/lib/utils"

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1]
const activeStatuses = new Set(["queued", "preparing", "running", "draining"])

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function defaultConfig(scenario?: LoadTestScenario): ScenarioConfig {
  return {
    vus: scenario?.defaults.vus ?? 1,
    duration: scenario?.defaults.duration ?? "1m",
    ramp_up: scenario?.defaults.ramp_up ?? "",
    hold: scenario?.defaults.hold ?? "",
    stock: scenario?.defaults.stock ?? 1,
    timeout_seconds: scenario?.defaults.timeout_seconds ?? 120,
  }
}

function formatNumber(value?: number) {
  return (value ?? 0).toLocaleString()
}

function statusTone(status?: string) {
  if (status === "passed") return "text-emerald-700 dark:text-[#39FF14]"
  if (status === "failed" || status === "cancelled") return "text-[#DC143C]"
  return "text-[#FF6600]"
}

function statusDot(status?: string) {
  if (status === "passed") return "bg-emerald-600 dark:bg-[#39FF14]"
  if (status === "failed" || status === "cancelled") return "bg-[#DC143C]"
  return "bg-[#FF6600]"
}

function relativeTime(iso?: string) {
  if (!iso) return ""
  const diff = Date.now() - new Date(iso).getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return "just now"
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} min ago`
  const hr = Math.floor(min / 60)
  return `${hr}h ago`
}

function formatDuration(startedAt?: string, endedAt?: string) {
  if (!startedAt) return "—"
  const end = endedAt ? new Date(endedAt).getTime() : Date.now()
  const ms = end - new Date(startedAt).getTime()
  const sec = Math.floor(ms / 1000)
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

function isSoakScenario(scenario: LoadTestScenario) {
  return (
    scenario.tags?.some((t) => t.toLowerCase() === "soak") ||
    scenario.name.toLowerCase().includes("soak")
  )
}

/* ------------------------------------------------------------------ */
/*  Elapsed timer hook                                                */
/* ------------------------------------------------------------------ */

function useElapsedTimer(startedAt?: string, active?: boolean) {
  const [elapsed, setElapsed] = useState("00:00")
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!active || !startedAt) {
      setElapsed("00:00")
      return
    }
    const start = new Date(startedAt).getTime()
    const tick = () => {
      const sec = Math.floor((Date.now() - start) / 1000)
      const m = Math.floor(sec / 60)
      const s = sec % 60
      setElapsed(`${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`)
      rafRef.current = window.setTimeout(tick, 1000)
    }
    tick()
    return () => clearTimeout(rafRef.current)
  }, [startedAt, active])

  return elapsed
}

/* ------------------------------------------------------------------ */
/*  PinForm                                                           */
/* ------------------------------------------------------------------ */

function PinForm({ onUnlocked }: { onUnlocked: (token: string, expiresAt: string) => void }) {
  const [pin, setPin] = useState("")
  const mutation = useMutation({
    mutationFn: createLoadTestSession,
    onSuccess: (session) => {
      sessionStorage.setItem("flasharch-load-test-token", session.token)
      sessionStorage.setItem("flasharch-load-test-expires-at", session.expires_at)
      onUnlocked(session.token, session.expires_at)
      toast.success("Load test console unlocked")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Invalid load test PIN"))
      setPin("")
    },
  })

  return (
    <form
      className="mx-auto max-w-md rounded-xl border border-border bg-card p-8"
      onSubmit={(event) => {
        event.preventDefault()
        mutation.mutate(pin)
      }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6600]/10">
          <Lock className="h-5 w-5 text-[#FF6600]" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Enter Load-Test PIN</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Backend validates this PIN against the bcrypt hash in local env.
        </p>
      </div>
      <input
        type="password"
        inputMode="numeric"
        value={pin}
        onChange={(event) => setPin(event.target.value)}
        className="mt-6 h-12 w-full rounded-lg border border-border bg-background px-4 text-center font-mono text-lg outline-none focus:border-[#FF6600]"
        placeholder="PIN"
      />
      <button
        type="submit"
        disabled={mutation.isPending || pin.length === 0}
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#FF6600] text-sm font-semibold text-white transition-colors hover:bg-[#e65c00] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4" />}
        Unlock Console
      </button>
    </form>
  )
}

/* ------------------------------------------------------------------ */
/*  ConfigField                                                       */
/* ------------------------------------------------------------------ */

function ConfigField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 font-mono text-xs outline-none focus:border-[#FF6600]/50"
      />
    </label>
  )
}

/* ------------------------------------------------------------------ */
/*  ScenarioCard                                                      */
/* ------------------------------------------------------------------ */

function cleanDescription(desc: string) {
  return desc.replace(/^PRD\s+[\w-]+:\s*/i, "")
}

function ScenarioCard({
  scenario,
  selected,
  onSelect,
}: {
  scenario: LoadTestScenario
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex flex-col rounded-xl border bg-card p-5 text-left transition-all hover:border-[#FF6600]/50 hover:shadow-sm",
        selected ? "border-[#FF6600] ring-1 ring-[#FF6600]/20" : "border-border",
      )}
    >
      <h3 className="text-sm font-semibold leading-snug">{scenario.name}</h3>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
        {cleanDescription(scenario.description)}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
        <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono">
          {scenario.defaults.vus.toLocaleString()} VUs
        </span>
        <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono">
          Stock {scenario.defaults.stock.toLocaleString()}
        </span>
        {scenario.defaults.duration && (
          <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono">{scenario.defaults.duration}</span>
        )}
        {scenario.defaults.ramp_up && (
          <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono">Ramp {scenario.defaults.ramp_up}</span>
        )}
      </div>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  ScenarioSkeleton                                                  */
/* ------------------------------------------------------------------ */

function ScenarioSkeleton({ fullWidth }: { fullWidth?: boolean }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl border border-border bg-card p-5",
        fullWidth ? "col-span-1 md:col-span-2 lg:col-span-3" : "",
      )}
    >
      <div className="h-4 w-28 rounded bg-muted" />
      <div className="mt-3 space-y-1.5">
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-3/4 rounded bg-muted" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-14 rounded bg-muted" />
        <div className="h-5 w-16 rounded bg-muted" />
        <div className="h-5 w-10 rounded bg-muted" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  LiveStatusPanel                                                   */
/* ------------------------------------------------------------------ */

function LiveStatusPanel({
  run,
  onCancel,
  cancelling,
}: {
  run?: LoadTestRun
  onCancel: () => void
  cancelling: boolean
}) {
  const isActive = run && activeStatuses.has(run.status)
  const elapsed = useElapsedTimer(run?.started_at, Boolean(isActive))

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">Live Status</h3>
        {isActive && (
          <button
            onClick={onCancel}
            disabled={cancelling}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#DC143C]/30 px-2.5 text-xs text-[#DC143C] transition-colors hover:bg-[#DC143C]/5 disabled:opacity-50"
          >
            {cancelling ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <Square className="h-3 w-3" />
            )}
            Cancel
          </button>
        )}
      </div>

      {!run && (
        <p className="mt-4 text-sm text-muted-foreground">Select a scenario and run a test to see live status.</p>
      )}

      {run && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold">{run.scenario_name}</h4>
            <div className="flex items-center gap-2">
              {isActive && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6600] opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FF6600]" />
                </span>
              )}
              {!isActive && (
                <span className={cn("h-2.5 w-2.5 rounded-full", statusDot(run.status))} />
              )}
              <span className={cn("font-mono text-xs font-semibold capitalize", statusTone(run.status))}>
                {run.status}
              </span>
              {isActive && (
                <span className="font-mono text-xs text-muted-foreground tabular-nums">{elapsed}</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="rounded-md bg-muted px-2 py-1 font-mono text-muted-foreground">
              {run.config.vus.toLocaleString()} VUs
            </span>
            <span className="rounded-md bg-muted px-2 py-1 font-mono text-muted-foreground">
              Stock {run.config.stock.toLocaleString()}
            </span>
            {run.config.duration && (
              <span className="rounded-md bg-muted px-2 py-1 font-mono text-muted-foreground">
                {run.config.duration}
              </span>
            )}
            {run.config.ramp_up && (
              <span className="rounded-md bg-muted px-2 py-1 font-mono text-muted-foreground">
                Ramp {run.config.ramp_up}
              </span>
            )}
            {run.config.hold && (
              <span className="rounded-md bg-muted px-2 py-1 font-mono text-muted-foreground">
                Hold {run.config.hold}
              </span>
            )}
          </div>

          <div className="rounded-lg bg-muted/50 px-3 py-2">
            {run.status === "queued" && (
              <p className="text-xs text-muted-foreground">
                Waiting to start. The backend is queuing this test run.
              </p>
            )}
            {run.status === "preparing" && (
              <p className="text-xs text-muted-foreground">
                Preparing isolated flash sale data for this run.
              </p>
            )}
            {run.status === "running" && (
              <p className="text-xs text-muted-foreground">
                Generating virtual user traffic. Results appear when the test finishes.
              </p>
            )}
            {run.status === "draining" && (
              <p className="text-xs text-muted-foreground">
                Traffic stopped. Waiting for the queue to drain and orders to settle.
              </p>
            )}
            {run.status === "passed" && (
              <p className="text-xs text-emerald-700 dark:text-[#39FF14]">
                All checks passed. No oversell detected, queue fully drained.
              </p>
            )}
            {run.status === "failed" && (
              <p className="text-xs text-[#DC143C]">
                Test failed. Check the results below for details.
              </p>
            )}
            {run.status === "cancelled" && (
              <p className="text-xs text-muted-foreground">Test was cancelled by user request.</p>
            )}
          </div>

          <div className="space-y-1.5 text-xs text-muted-foreground">
            {run.started_at && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                <span className="font-mono tabular-nums">
                  {formatDuration(run.started_at, run.ended_at)}
                  {!run.ended_at && " elapsed"}
                </span>
              </div>
            )}
            {run.started_at && (
              <div className="pl-4.5">
                Started {new Date(run.started_at).toLocaleTimeString()}
                {run.ended_at && ` · Ended ${new Date(run.ended_at).toLocaleTimeString()}`}
              </div>
            )}
          </div>

          {run.error && (
            <div className="rounded-lg border border-[#DC143C]/20 bg-[#DC143C]/5 p-3 text-xs text-[#DC143C]">
              {run.error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  VerdictInline                                                     */
/* ------------------------------------------------------------------ */

function VerdictInline({ run }: { run: LoadTestRun }) {
  const result = run.result
  if (!result) return null

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {result.verdict === "passed" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-[#39FF14]" />
          ) : (
            <XCircle className="h-5 w-5 text-[#DC143C]" />
          )}
          <div>
            <h3 className="text-sm font-semibold">
              {result.verdict === "passed" ? "All checks passed" : "Test failed"}
            </h3>
            <p className="text-xs text-muted-foreground">Run {run.id}</p>
          </div>
        </div>
        <span className={cn("font-mono text-xs font-semibold capitalize", statusTone(run.status))}>
          {run.status}
        </span>
      </div>
      {result.reasons.length > 0 && (
        <div className="mt-4 rounded-lg border border-[#DC143C]/20 bg-[#DC143C]/5 p-3 text-xs text-[#DC143C]">
          {result.reasons.join(" · ")}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  MetricsStrip                                                      */
/* ------------------------------------------------------------------ */

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center px-4 py-3">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="mt-1.5 font-mono text-lg font-bold tabular-nums">{value}</span>
    </div>
  )
}

function MetricsStrip({ run }: { run: LoadTestRun }) {
  const result = run.result
  const m = result?.metrics

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
        Results will appear once the test finishes.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 divide-x divide-border">
        <MetricItem label="Attempts" value={formatNumber(m?.attempts)} />
        <MetricItem label="Accepted" value={formatNumber(m?.accepted)} />
        <MetricItem label="Sold Out" value={formatNumber(m?.sold_out)} />
        <MetricItem label="Errors" value={formatNumber(m?.errors)} />
        <MetricItem label="P95 Latency" value={`${Math.round(m?.latency_p95_ms ?? 0)}ms`} />
        <MetricItem label="Throughput" value={`${(m?.throughput_rps ?? 0).toFixed(1)} rps`} />
        <MetricItem label="Oversell" value={formatNumber(m?.oversell_count)} />
        <MetricItem label="Queue Drained" value={m?.queue_drained ? "yes" : "no"} />
      </div>

      {run.grafana_links && run.grafana_links.length > 0 && (
        <div className="border-t border-border px-5 py-3 flex flex-wrap gap-2">
          {run.grafana_links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-[#FF6600]/50 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  MetricsSkeleton                                                   */
/* ------------------------------------------------------------------ */

function MetricsSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-card p-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="h-3 w-14 rounded bg-muted" />
            <div className="h-6 w-12 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  RunHistoryRow                                                     */
/* ------------------------------------------------------------------ */

function RunHistoryRow({
  run,
  onSelect,
  active,
}: {
  run: LoadTestRun
  onSelect: () => void
  active: boolean
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-4 rounded-lg border px-4 py-2.5 text-left text-xs transition-colors",
        active ? "border-[#FF6600] bg-[#FF6600]/5" : "border-border hover:border-[#FF6600]/40",
      )}
    >
      <span className={cn("h-2 w-2 shrink-0 rounded-full", statusDot(run.status))} />
      <span className="flex-1 truncate font-medium">{run.scenario_name}</span>
      <span className={cn("font-mono text-[11px] capitalize", statusTone(run.status))}>{run.status}</span>
      <span className="hidden text-[11px] text-muted-foreground sm:inline">
        {relativeTime(run.updated_at)}
      </span>
      <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
        {formatDuration(run.started_at, run.ended_at)}
      </span>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  RunHistorySkeleton                                                */
/* ------------------------------------------------------------------ */

function RunHistorySkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse flex items-center gap-4 rounded-lg border border-border px-4 py-2.5">
          <div className="h-2 w-2 rounded-full bg-muted" />
          <div className="h-3 flex-1 rounded bg-muted" />
          <div className="h-3 w-14 rounded bg-muted" />
          <div className="h-3 w-16 rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main PinGate                                                      */
/* ------------------------------------------------------------------ */

export function PinGate() {
  const queryClient = useQueryClient()
  const [token, setToken] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [selectedID, setSelectedID] = useState("")
  const [config, setConfig] = useState<ScenarioConfig>(defaultConfig())
  const [activeRunID, setActiveRunID] = useState("")

  /* ---------- Queries ---------- */

  const scenariosQuery = useQuery({
    queryKey: ["load-test-scenarios", token],
    queryFn: () => listLoadTestScenarios(token),
    enabled: Boolean(token),
  })

  const runsQuery = useQuery({
    queryKey: ["load-test-runs", token],
    queryFn: () => listLoadTestRuns(token),
    enabled: Boolean(token),
    refetchInterval: activeRunID ? 3000 : false,
  })

  const activeRunQuery = useQuery({
    queryKey: ["load-test-run", token, activeRunID],
    queryFn: () => getLoadTestRun(token, activeRunID),
    enabled: Boolean(token && activeRunID),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status && activeStatuses.has(status) ? 2500 : false
    },
  })

  /* ---------- Derived ---------- */

  const scenarios = useMemo(() => scenariosQuery.data ?? [], [scenariosQuery.data])
  const effectiveSelectedID = selectedID || scenarios[0]?.id || ""
  const selectedScenario = useMemo(
    () => scenarios.find((scenario) => scenario.id === effectiveSelectedID),
    [scenarios, effectiveSelectedID],
  )
  const effectiveConfig = selectedID ? config : defaultConfig(selectedScenario)
  const latestRun = activeRunQuery.data ?? runsQuery.data?.[0]

  /* Split scenarios: first 6 in grid, rest (soak) full-width */
  const gridScenarios = useMemo(() => scenarios.filter((s) => !isSoakScenario(s)).slice(0, 6), [scenarios])
  const fullWidthScenarios = useMemo(
    () => scenarios.filter((s) => !gridScenarios.includes(s)),
    [scenarios, gridScenarios],
  )

  /* ---------- Effects ---------- */

  useEffect(() => {
    if (latestRun && !activeStatuses.has(latestRun.status)) {
      void queryClient.invalidateQueries({ queryKey: ["load-test-runs", token] })
    }
  }, [latestRun, queryClient, token])

  /* ---------- Mutations ---------- */

  const startMutation = useMutation({
    mutationFn: () => startLoadTestRun(token, { scenario_id: effectiveSelectedID, config: effectiveConfig }),
    onSuccess: (run) => {
      setActiveRunID(run.id)
      toast.success("Load test run queued")
      void queryClient.invalidateQueries({ queryKey: ["load-test-runs", token] })
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to start load test")),
  })

  const cancelMutation = useMutation({
    mutationFn: (runID: string) => cancelLoadTestRun(token, runID),
    onSuccess: (run) => {
      setActiveRunID(run.id)
      toast.success("Load test cancellation requested")
      void queryClient.invalidateQueries({ queryKey: ["load-test-runs", token] })
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to cancel load test")),
  })

  /* ---------- Handlers ---------- */

  const handleSelectScenario = useCallback(
    (scenario: LoadTestScenario) => {
      setSelectedID(scenario.id)
      setConfig(defaultConfig(scenario))
    },
    [],
  )

  /* ---------- Unauthenticated view ---------- */

  if (!token) {
    return (
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <PinForm
            onUnlocked={(nextToken, nextExpiry) => {
              setToken(nextToken)
              setExpiresAt(nextExpiry)
            }}
          />
        </div>
      </section>
    )
  }

  /* ---------- Authenticated view ---------- */

  const isRunActive = Boolean(latestRun && activeStatuses.has(latestRun.status))
  const scenariosLoading = scenariosQuery.isLoading
  const historyLoading = runsQuery.isLoading && !runsQuery.data

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: smoothEase }}
          className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end"
        >
          <div>
            <span className="font-mono text-xs uppercase text-[#FF6600]">Execution</span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Load Test Console</h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Your session expires{" "}
              {expiresAt ? new Date(expiresAt).toLocaleString() : "soon"}. Only one test can run at a
              time.
            </p>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem("flasharch-load-test-token")
              sessionStorage.removeItem("flasharch-load-test-expires-at")
              setToken("")
            }}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm"
          >
            <Lock className="h-4 w-4" />
            Lock
          </button>
        </motion.div>

        {scenariosQuery.isError && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-[#DC143C]/20 bg-[#DC143C]/5 p-4 text-sm text-[#DC143C]">
            <AlertTriangle className="h-4 w-4" />
            {getErrorMessage(scenariosQuery.error, "Failed to load scenarios")}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: smoothEase, delay: 0.05 }}
          className="mb-10"
        >
          <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Choose a Scenario</h3>

          {scenariosLoading ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ScenarioSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {gridScenarios.map((scenario) => (
                  <ScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    selected={scenario.id === effectiveSelectedID}
                    onSelect={() => handleSelectScenario(scenario)}
                  />
                ))}
              </div>

              {fullWidthScenarios.length > 0 && (
                <div className="mt-3 grid gap-3">
                  {fullWidthScenarios.map((scenario) => (
                    <ScenarioCard
                      key={scenario.id}
                      scenario={scenario}
                      selected={scenario.id === effectiveSelectedID}
                      onSelect={() => handleSelectScenario(scenario)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: smoothEase, delay: 0.1 }}
          className="mb-10 grid gap-4 lg:grid-cols-2"
        >
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-[#FF6600]" />
              <h3 className="text-sm font-semibold">Configuration</h3>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <ConfigField
                label="Virtual Users"
                value={effectiveConfig.vus}
                onChange={(value) => setConfig({ ...effectiveConfig, vus: Number(value) })}
              />
              <ConfigField
                label="Stock"
                value={effectiveConfig.stock}
                onChange={(value) => setConfig({ ...effectiveConfig, stock: Number(value) })}
              />
              <ConfigField
                label="Duration"
                value={effectiveConfig.duration}
                onChange={(value) => setConfig({ ...effectiveConfig, duration: value })}
                placeholder="2m"
              />
              <ConfigField
                label="Ramp Up"
                value={effectiveConfig.ramp_up}
                onChange={(value) => setConfig({ ...effectiveConfig, ramp_up: value })}
                placeholder="10s"
              />
              <ConfigField
                label="Hold"
                value={effectiveConfig.hold}
                onChange={(value) => setConfig({ ...effectiveConfig, hold: value })}
                placeholder="60s"
              />
              <ConfigField
                label="Timeout (sec)"
                value={effectiveConfig.timeout_seconds}
                onChange={(value) => setConfig({ ...effectiveConfig, timeout_seconds: Number(value) })}
              />
            </div>
            <button
              disabled={!effectiveSelectedID || startMutation.isPending || isRunActive}
              onClick={() => startMutation.mutate()}
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#FF6600] text-sm font-semibold text-white transition-colors hover:bg-[#e65c00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {startMutation.isPending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isRunActive ? "Test in progress..." : "Run Test"}
            </button>
          </div>

          <LiveStatusPanel
            run={latestRun}
            onCancel={() => latestRun && cancelMutation.mutate(latestRun.id)}
            cancelling={cancelMutation.isPending}
          />
        </motion.div>

        {latestRun && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: smoothEase, delay: 0.15 }}
            className="mb-10 space-y-4"
          >
            <VerdictInline run={latestRun} />

            {activeRunQuery.isLoading && !latestRun.result ? <MetricsSkeleton /> : <MetricsStrip run={latestRun} />}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: smoothEase, delay: 0.2 }}
        >
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Past Runs</h3>
              </div>
              <span className="text-[11px] text-muted-foreground">
                {(runsQuery.data ?? []).length} test{((runsQuery.data ?? []).length !== 1) && "s"}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {historyLoading ? (
                <RunHistorySkeleton />
              ) : (
                <>
                  {(runsQuery.data ?? []).slice(0, 10).map((run) => (
                    <RunHistoryRow
                      key={run.id}
                      run={run}
                      active={run.id === latestRun?.id}
                      onSelect={() => setActiveRunID(run.id)}
                    />
                  ))}
                  {(runsQuery.data ?? []).length === 0 && (
                    <p className="py-4 text-center text-xs text-muted-foreground">
                      No tests have been run yet.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
