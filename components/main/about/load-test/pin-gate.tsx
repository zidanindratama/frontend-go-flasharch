"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Unlock,
  Loader2,
  Play,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Timer,
  Zap,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ------------------------------------------------------------------ */
/*  PIN GATE                                                           */
/* ------------------------------------------------------------------ */

function PinInput({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const CORRECT_PIN = "2711";

  const focus = (i: number) => {
    inputsRef.current[i]?.focus();
  };

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...pin];
    next[i] = val.slice(-1);
    setPin(next);
    setError(false);

    if (val && i < 3) focus(i + 1);

    const joined = next.join("");
    if (joined.length === 4) {
      if (joined === CORRECT_PIN) {
        onUnlock();
      } else {
        setError(true);
        setShaking(true);
        setTimeout(() => setShaking(false), 400);
        setPin(["", "", "", ""]);
        setTimeout(() => focus(0), 50);
      }
    }
  };

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[i] && i > 0) {
      focus(i - 1);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <motion.div
        animate={shaking ? { x: [0, -8, 8, -8, 8, 0] } : {}}
        transition={{ duration: 0.35 }}
        className="flex justify-center gap-3"
      >
        {pin.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKey(i, e)}
            className={cn(
              "h-14 w-14 rounded-xl border-2 bg-card text-center text-2xl font-bold outline-none transition-colors md:h-16 md:w-16",
              error
                ? "border-[#DC143C] text-[#DC143C]"
                : "border-border text-foreground focus:border-[#FF6600]"
            )}
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="mt-3 text-center text-xs text-[#DC143C]"
          >
            Incorrect PIN. Try again.
          </motion.p>
        )}
      </AnimatePresence>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Hint: thesis completion year
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TEST CONFIG                                                        */
/* ------------------------------------------------------------------ */

interface Config {
  endpoint: string;
  vus: number;
  rampUp: number;
  hold: number;
}

const endpoints = [
  { label: "POST /flash-sale/checkout", value: "checkout" },
  { label: "GET /products", value: "products" },
  { label: "GET /flash-sales/active", value: "flash-sales" },
  { label: "POST /auth/sign-in", value: "sign-in" },
];

function ConfigPanel({ config, onChange }: { config: Config; onChange: (c: Config) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: smoothEase }}
      className="rounded-xl border border-border bg-card p-5 md:p-6"
    >
      <h3 className="text-sm font-semibold">Test Configuration</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="text-xs text-muted-foreground">Target Endpoint</label>
          <select
            value={config.endpoint}
            onChange={(e) => onChange({ ...config, endpoint: e.target.value })}
            className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-2 text-xs font-mono outline-none focus:border-[#FF6600]/40"
          >
            {endpoints.map((ep) => (
              <option key={ep.value} value={ep.value}>
                {ep.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Virtual Users</label>
          <input
            type="number"
            min={100}
            max={50000}
            step={100}
            value={config.vus}
            onChange={(e) => onChange({ ...config, vus: Number(e.target.value) })}
            className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-xs font-mono outline-none focus:border-[#FF6600]/40"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Ramp-up (s)</label>
          <input
            type="number"
            min={5}
            max={300}
            value={config.rampUp}
            onChange={(e) => onChange({ ...config, rampUp: Number(e.target.value) })}
            className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-xs font-mono outline-none focus:border-[#FF6600]/40"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Hold (s)</label>
          <input
            type="number"
            min={10}
            max={600}
            value={config.hold}
            onChange={(e) => onChange({ ...config, hold: Number(e.target.value) })}
            className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-xs font-mono outline-none focus:border-[#FF6600]/40"
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  LIVE METRICS (during run)                                          */
/* ------------------------------------------------------------------ */

function LiveMetrics({ progress }: { progress: number }) {
  const metrics = [
    { label: "VUs", value: `${Math.floor(progress * 100)}` },
    { label: "Req/s", value: `${Math.floor(200 + progress * 2800)}` },
    { label: "Errors", value: `${Math.floor(progress * 12)}` },
    { label: "Latency", value: `${Math.floor(12 + progress * 38)}ms` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: smoothEase }}
      className="rounded-xl border border-border bg-card p-5 md:p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Live Metrics</h3>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6600] opacity-75" />
            <span className="relative inline-flex h-full w-full rounded-full bg-[#FF6600]" />
          </span>
          Running
        </span>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-[#FF6600]"
          initial={{ width: "0%" }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-lg bg-muted/50 p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {m.label}
            </p>
            <p className="mt-1 font-mono text-lg font-bold">{m.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  RESULTS PANEL                                                      */
/* ------------------------------------------------------------------ */

const mockResults = {
  totalReqs: 284_730,
  failedReqs: 142,
  rps: 2_847.3,
  duration: "100s",
  vusMax: 10_000,

  latency: {
    min: "8.2ms",
    avg: "34.1ms",
    med: "28ms",
    p90: "58ms",
    p95: "72ms",
    p99: "124ms",
    max: "412ms",
  },

  httpCodes: [
    { code: 200, count: 142_100, pct: 49.9 },
    { code: 201, count: 141_800, pct: 49.8 },
    { code: 429, count: 412, pct: 0.14 },
    { code: 500, count: 98, pct: 0.03 },
    { code: 503, count: 44, pct: 0.02 },
  ],

  rpsOverTime: [
    200, 450, 780, 1200, 1650, 2100, 2480, 2750, 2847, 2847,
    2840, 2835, 2847, 2850, 2845, 2847, 2842, 2847, 2840, 2847,
  ],

  checks: [
    { name: "status is 200/201", pass: 99.95, fail: 0.05 },
    { name: "response time < 200ms", pass: 98.2, fail: 1.8 },
    { name: "stock not negative", pass: 100, fail: 0 },
    { name: "no duplicate orders", pass: 99.99, fail: 0.01 },
  ],
};

function ResultMetric({ label, value, trend }: { label: string; value: string; trend?: "up" | "down" | "neutral" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-[#FF6600]/20">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        {trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-emerald-700 dark:text-[#39FF14]" />}
        {trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-[#FF6600]" />}
      </div>
    </div>
  );
}

function LatencyTable() {
  const entries = Object.entries(mockResults.latency);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        <Timer className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          Latency Breakdown
        </span>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4 md:grid-cols-7">
        {entries.map(([key, val]) => (
          <div key={key} className="bg-card px-4 py-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {key}
            </p>
            <p className="mt-1 font-mono text-sm font-semibold">{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusCodeBar({ code, count, pct }: { code: number; count: number; pct: number }) {
  const isError = code >= 400;
  const color = isError ? "bg-[#DC143C]" : code === 201 ? "bg-emerald-700 dark:bg-[#39FF14]" : "bg-[#FF6600]";

  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "inline-flex w-10 shrink-0 items-center justify-center rounded px-1.5 py-0.5 font-mono text-[10px] font-bold",
          isError
            ? "bg-[#DC143C]/10 text-[#DC143C]"
            : "bg-emerald-700/10 text-emerald-700 dark:bg-[#39FF14]/10 dark:text-[#39FF14]"
        )}
      >
        {code}
      </span>
      <div className="flex-1">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${Math.max(pct * 3, 1)}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className={`h-full rounded-full ${color}`}
          />
        </div>
      </div>
      <span className="w-16 text-right font-mono text-xs text-muted-foreground">
        {count.toLocaleString()}
      </span>
      <span className="w-10 text-right font-mono text-[10px] text-muted-foreground">
        {pct}%
      </span>
    </div>
  );
}

function ChecksTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          Threshold Checks
        </span>
      </div>
      <div className="divide-y divide-border">
        {mockResults.checks.map((check) => (
          <div
            key={check.name}
            className="flex items-center justify-between px-5 py-3"
          >
            <span className="text-xs">{check.name}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-[#39FF14]">
                <CheckCircle2 className="h-3 w-3" />
                {check.pass}%
              </span>
              {check.fail > 0 && (
                <span className="flex items-center gap-1 text-xs font-medium text-[#DC143C]">
                  <XCircle className="h-3 w-3" />
                  {check.fail}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RpsSparkline() {
  const data = mockResults.rpsOverTime;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 500;
  const height = 80;
  const step = width / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });

  const areaPoints = `${points[0].split(",")[0]},${height} ${points.join(" ")} ${points[points.length - 1].split(",")[0]},${height}`;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            RPS Over Time
          </span>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          Peak: 2,850 req/s
        </span>
      </div>
      <div className="p-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          preserveAspectRatio="none"
        >
          <motion.polygon
            fill="rgba(255,102,0,0.08)"
            points={areaPoints}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />
          <motion.polyline
            fill="none"
            stroke="#FF6600"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points.join(" ")}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: smoothEase }}
          />
        </svg>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          <span>0s</span>
          <span>25s</span>
          <span>50s</span>
          <span>75s</span>
          <span>100s</span>
        </div>
      </div>
    </div>
  );
}

function ResultsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: smoothEase }}
      className="space-y-4"
    >
      {/* Summary metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ResultMetric label="Total Requests" value="284,730" trend="up" />
        <ResultMetric label="Requests/sec" value="2,847.3" trend="up" />
        <ResultMetric label="Failed" value="142" trend="down" />
        <ResultMetric label="Duration" value="100s" />
      </div>

      {/* Latency */}
      <LatencyTable />

      {/* RPS sparkline */}
      <RpsSparkline />

      {/* Two column: status codes + checks */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              HTTP Status Distribution
            </span>
          </div>
          <div className="space-y-3 p-4">
            {mockResults.httpCodes.map((hc) => (
              <StatusCodeBar
                key={hc.code}
                code={hc.code}
                count={hc.count}
                pct={hc.pct}
              />
            ))}
          </div>
        </div>

        <ChecksTable />
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN GATE COMPONENT                                                */
/* ------------------------------------------------------------------ */

export function PinGate() {
  const [unlocked, setUnlocked] = useState(false);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  const [configOpen, setConfigOpen] = useState(true);
  const [config, setConfig] = useState<Config>({
    endpoint: "checkout",
    vus: 10000,
    rampUp: 30,
    hold: 70,
  });

  const handleRun = () => {
    setRunning(true);
    setFinished(false);
    setProgress(0);
    setConfigOpen(false);
  };

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) {
          clearInterval(interval);
          setRunning(false);
          setFinished(true);
          return 1;
        }
        return p + 0.01;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [running]);

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="mb-12"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Execution
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Load Test Runner
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            PIN-protected test execution. Configure virtual users, target
            endpoints, and inspect results.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!unlocked ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="mx-auto max-w-lg rounded-xl border border-border bg-card p-8 md:p-10"
            >
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6600]/10">
                  <Lock className="h-5 w-5 text-[#FF6600]" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Enter PIN to Execute</h3>
                <p className="mt-1 text-center text-sm text-muted-foreground">
                  This action triggers traffic against production endpoints.
                  Authentication required.
                </p>
                <div className="mt-6 w-full">
                  <PinInput onUnlock={() => setUnlocked(true)} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="space-y-4"
            >
              {/* Unlocked header */}
              <div className="flex items-center gap-3 rounded-xl border border-emerald-700/20 bg-emerald-700/5 px-5 py-3 dark:border-[#39FF14]/20 dark:bg-[#39FF14]/5">
                <Unlock className="h-4 w-4 text-emerald-700 dark:text-[#39FF14]" />
                <span className="text-sm font-medium text-emerald-700 dark:text-[#39FF14]">
                  Execution unlocked
                </span>
              </div>

              {/* Config toggle */}
              <button
                onClick={() => setConfigOpen(!configOpen)}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/30"
              >
                <div>
                  <h3 className="text-sm font-semibold">Configuration</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {endpoints.find((e) => e.value === config.endpoint)?.label} ·{" "}
                    {config.vus.toLocaleString()} VUs · {config.rampUp}s ramp ·{" "}
                    {config.hold}s hold
                  </p>
                </div>
                {configOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {configOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: smoothEase }}
                    className="overflow-hidden"
                  >
                    <ConfigPanel config={config} onChange={setConfig} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Run button */}
              {!running && !finished && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleRun}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6600] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#e65c00]"
                >
                  <Play className="h-4 w-4" />
                  Run Load Test
                </motion.button>
              )}

              {/* Running state */}
              {running && <LiveMetrics progress={progress} />}

              {/* Finished */}
              {finished && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: smoothEase }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-[#39FF14]" />
                      <div>
                        <h3 className="text-sm font-semibold">Test Complete</h3>
                        <p className="text-xs text-muted-foreground">
                          {mockResults.totalReqs.toLocaleString()} requests in{" "}
                          {mockResults.duration}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFinished(false);
                        setProgress(0);
                        setConfigOpen(true);
                      }}
                      className="flex items-center gap-1.5 rounded-md border border-border bg-muted px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/80"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Rerun
                    </button>
                  </div>
                  <ResultsPanel />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
