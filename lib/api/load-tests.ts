import { loadTestApi } from "@/lib/api/load-test-axios"
import { endpoints } from "@/lib/api/endpoints"

type Envelope<T> = {
  message: string
  data: T
}

export type LoadTestStatus =
  | "queued"
  | "preparing"
  | "running"
  | "draining"
  | "passed"
  | "failed"
  | "cancelled"

export type ScenarioConfig = {
  vus: number
  duration: string
  ramp_up: string
  hold: string
  stock: number
  timeout_seconds: number
}

export type LoadTestScenario = {
  id: string
  name: string
  description: string
  script: string
  defaults: ScenarioConfig
  thresholds: {
    max_p95_ms: number
    max_http_5xx_rate: number
    require_drain: boolean
    require_no_oversell: boolean
  }
  tags: string[]
}

export type LoadTestResult = {
  verdict: "passed" | "failed"
  reasons: string[]
  metrics: {
    attempts: number
    accepted: number
    sold_out: number
    errors: number
    http_5xx_rate: number
    latency_p50_ms: number
    latency_p95_ms: number
    latency_p99_ms: number
    throughput_rps: number
    oversell_count: number
    queue_drained: boolean
    accepted_checkouts: number
    confirmed_orders: number
  }
  summary_path?: string
  raw_summary?: Record<string, unknown>
}

export type LoadTestRun = {
  id: string
  scenario_id: string
  scenario_name: string
  status: LoadTestStatus
  config: ScenarioConfig
  prepared: {
    run_prefix: string
    flash_sale_id?: string
    flash_sale_item_id?: string
    product_id?: string
    category_id?: string
  }
  created_at: string
  updated_at: string
  started_at?: string
  ended_at?: string
  error?: string
  stdout_tail?: string
  stderr_tail?: string
  result?: LoadTestResult
  grafana_links?: Array<{ label: string; url: string }>
}

function tokenHeader(token: string) {
  return { "X-Load-Test-Token": token }
}

export async function createLoadTestSession(pin: string) {
  const response = await loadTestApi.post<
    Envelope<{ token: string; expires_at: string }>
  >(endpoints.loadTests.session, { pin })
  return response.data.data
}

export async function listLoadTestScenarios(token: string) {
  const response = await loadTestApi.get<Envelope<{ items: LoadTestScenario[] }>>(
    endpoints.loadTests.scenarios,
    { headers: tokenHeader(token) },
  )
  return response.data.data.items
}

export async function startLoadTestRun(
  token: string,
  payload: { scenario_id: string; config: ScenarioConfig },
) {
  const response = await loadTestApi.post<Envelope<LoadTestRun>>(
    endpoints.loadTests.runs,
    payload,
    { headers: tokenHeader(token) },
  )
  return response.data.data
}

export async function listLoadTestRuns(token: string) {
  const response = await loadTestApi.get<Envelope<{ items: LoadTestRun[] }>>(
    endpoints.loadTests.runs,
    { headers: tokenHeader(token) },
  )
  return response.data.data.items
}

export async function getLoadTestRun(token: string, id: string) {
  const response = await loadTestApi.get<Envelope<LoadTestRun>>(
    endpoints.loadTests.run(id),
    { headers: tokenHeader(token) },
  )
  return response.data.data
}

export async function cancelLoadTestRun(token: string, id: string) {
  const response = await loadTestApi.post<Envelope<LoadTestRun>>(
    endpoints.loadTests.cancel(id),
    {},
    { headers: tokenHeader(token) },
  )
  return response.data.data
}
