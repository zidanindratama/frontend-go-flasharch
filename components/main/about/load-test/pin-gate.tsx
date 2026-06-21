"use client"

import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Lock,
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
        "rounded-xl border bg-card p-4 text-left transition-colors hover:border-[#FF6600]/50",
        selected ? "border-[#FF6600]" : "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{scenario.name}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{scenario.description}</p>
        </div>
        <span className="rounded-full bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">
          {scenario.script}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
        <span>{scenario.defaults.vus.toLocaleString()} VUs</span>
        <span>Stock {scenario.defaults.stock.toLocaleString()}</span>
        {scenario.defaults.duration && <span>{scenario.defaults.duration}</span>}
        {scenario.defaults.ramp_up && <span>Ramp {scenario.defaults.ramp_up}</span>}
      </div>
    </button>
  )
}

function ResultPanel({ run }: { run: LoadTestRun }) {
  const result = run.result
  const metrics = result?.metrics

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
        Result will appear after k6 finishes and backend verification runs.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {result.verdict === "passed" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-[#39FF14]" />
            ) : (
              <XCircle className="h-5 w-5 text-[#DC143C]" />
            )}
            <div>
              <h3 className="text-sm font-semibold">Verdict: {result.verdict}</h3>
              <p className="text-xs text-muted-foreground">Run {run.id}</p>
            </div>
          </div>
          <span className={cn("font-mono text-xs font-semibold", statusTone(run.status))}>{run.status}</span>
        </div>
        {result.reasons.length > 0 && (
          <div className="mt-4 rounded-lg border border-[#DC143C]/20 bg-[#DC143C]/5 p-3 text-xs text-[#DC143C]">
            {result.reasons.join(" · ")}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Attempts" value={formatNumber(metrics?.attempts)} />
        <Metric label="Accepted" value={formatNumber(metrics?.accepted)} />
        <Metric label="Sold Out" value={formatNumber(metrics?.sold_out)} />
        <Metric label="Errors" value={formatNumber(metrics?.errors)} />
        <Metric label="P95 Latency" value={`${Math.round(metrics?.latency_p95_ms ?? 0)}ms`} />
        <Metric label="Throughput" value={`${(metrics?.throughput_rps ?? 0).toFixed(1)} rps`} />
        <Metric label="Oversell" value={formatNumber(metrics?.oversell_count)} />
        <Metric label="Queue Drained" value={metrics?.queue_drained ? "yes" : "no"} />
      </div>

      {run.grafana_links && run.grafana_links.length > 0 && (
        <div className="flex flex-wrap gap-2">
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 font-mono text-xl font-bold">{value}</p>
    </div>
  )
}

export function PinGate() {
  const queryClient = useQueryClient()
  const [token, setToken] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [selectedID, setSelectedID] = useState("")
  const [config, setConfig] = useState<ScenarioConfig>(defaultConfig())
  const [activeRunID, setActiveRunID] = useState("")

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

  const scenarios = useMemo(() => scenariosQuery.data ?? [], [scenariosQuery.data])
  const effectiveSelectedID = selectedID || scenarios[0]?.id || ""
  const selectedScenario = useMemo(
    () => scenarios.find((scenario) => scenario.id === effectiveSelectedID),
    [scenarios, effectiveSelectedID],
  )
  const effectiveConfig = selectedID ? config : defaultConfig(selectedScenario)
  const latestRun = activeRunQuery.data ?? runsQuery.data?.[0]

  useEffect(() => {
    if (latestRun && !activeStatuses.has(latestRun.status)) {
      void queryClient.invalidateQueries({ queryKey: ["load-test-runs", token] })
    }
  }, [latestRun, queryClient, token])

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

  if (!token) {
    return (
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <PinForm onUnlocked={(nextToken, nextExpiry) => {
            setToken(nextToken)
            setExpiresAt(nextExpiry)
          }} />
        </div>
      </section>
    )
  }

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: smoothEase }}
          className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end"
        >
          <div>
            <span className="font-mono text-xs uppercase text-[#FF6600]">Execution</span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Real PRD K6 Console</h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Session expires {expiresAt ? new Date(expiresAt).toLocaleString() : "soon"}. One active run is allowed.
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

        <div className="grid gap-6 lg:grid-cols-[0.58fr_0.42fr]">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {scenarios.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  selected={scenario.id === effectiveSelectedID}
                  onSelect={() => {
                    setSelectedID(scenario.id)
                    setConfig(defaultConfig(scenario))
                  }}
                />
              ))}
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-[#FF6600]" />
                <h3 className="text-sm font-semibold">Scenario Config</h3>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <ConfigField label="VUs" value={effectiveConfig.vus} onChange={(value) => setConfig({ ...effectiveConfig, vus: Number(value) })} />
                <ConfigField label="Stock" value={effectiveConfig.stock} onChange={(value) => setConfig({ ...effectiveConfig, stock: Number(value) })} />
                <ConfigField label="Duration" value={effectiveConfig.duration} onChange={(value) => setConfig({ ...effectiveConfig, duration: value })} placeholder="2m" />
                <ConfigField label="Ramp Up" value={effectiveConfig.ramp_up} onChange={(value) => setConfig({ ...effectiveConfig, ramp_up: value })} placeholder="10s" />
                <ConfigField label="Hold" value={effectiveConfig.hold} onChange={(value) => setConfig({ ...effectiveConfig, hold: value })} placeholder="60s" />
                <ConfigField label="Timeout Seconds" value={effectiveConfig.timeout_seconds} onChange={(value) => setConfig({ ...effectiveConfig, timeout_seconds: Number(value) })} />
              </div>
              <button
                disabled={!effectiveSelectedID || startMutation.isPending || Boolean(latestRun && activeStatuses.has(latestRun.status))}
                onClick={() => startMutation.mutate()}
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#FF6600] text-sm font-semibold text-white transition-colors hover:bg-[#e65c00] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {startMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                Run {selectedScenario?.name ?? "Scenario"}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">Current Run</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{latestRun?.id ?? "No run selected"}</p>
                </div>
                {latestRun && activeStatuses.has(latestRun.status) && (
                  <button
                    onClick={() => cancelMutation.mutate(latestRun.id)}
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-[#DC143C]/30 px-3 text-xs text-[#DC143C]"
                  >
                    <Square className="h-3 w-3" />
                    Cancel
                  </button>
                )}
              </div>
              {latestRun ? (
                <div className="mt-4">
                  <div className={cn("font-mono text-sm font-semibold", statusTone(latestRun.status))}>
                    {latestRun.status}
                  </div>
                  {latestRun.error && <p className="mt-2 text-xs text-[#DC143C]">{latestRun.error}</p>}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">Start a scenario to see live status.</p>
              )}
            </div>

            {latestRun && <ResultPanel run={latestRun} />}

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Run History</h3>
              </div>
              <div className="mt-4 space-y-2">
                {(runsQuery.data ?? []).slice(0, 8).map((run) => (
                  <button
                    key={run.id}
                    onClick={() => setActiveRunID(run.id)}
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-left text-xs transition-colors hover:border-[#FF6600]/40"
                  >
                    <span className="truncate">{run.scenario_name}</span>
                    <span className={cn("font-mono", statusTone(run.status))}>{run.status}</span>
                  </button>
                ))}
                {runsQuery.data?.length === 0 && <p className="text-xs text-muted-foreground">No runs yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
