import type {
  AdminConfig,
  BehaviorMetricsPayload,
  LeadPayload,
  LeadResponse,
} from "./types";

export function toValue(rawValue: FormDataEntryValue | null): string {
  return (rawValue ?? "").toString().trim();
}

export function optionalOrNull(rawValue: FormDataEntryValue | null): string | null {
  const value = toValue(rawValue);
  return value.length > 0 ? value : null;
}

export function buildLeadPayload(data: FormData): LeadPayload {
  return {
    first_name: toValue(data.get("first_name")),
    last_name: toValue(data.get("last_name")),
    patronymic: optionalOrNull(data.get("patronymic")),
    business_info: toValue(data.get("business_info")),
    business_niche: toValue(data.get("business_niche")),
    company_size: toValue(data.get("company_size")),
    task_volume: toValue(data.get("task_volume")),
    role: toValue(data.get("role")),
    business_size: toValue(data.get("business_size")),
    need_volume: toValue(data.get("need_volume")),
    result_deadline: toValue(data.get("result_deadline")),
    task_type: toValue(data.get("task_type")),
    interested_product: toValue(data.get("interested_product")),
    budget: toValue(data.get("budget")),
    preferred_contact_method: toValue(data.get("preferred_contact_method")),
    convenient_time: toValue(data.get("convenient_time")),
    comments: toValue(data.get("comments")),
  };
}

export async function createLead(payload: LeadPayload): Promise<LeadResponse> {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Lead create failed: ${response.status}`);
  }
  return (await response.json()) as LeadResponse;
}

export function buildBehaviorPayload(
  applicationId: number,
  pageOpenTime: number,
  clicks: string[],
  zones: Set<string>,
  returnCount: number,
): BehaviorMetricsPayload {
  return {
    application_id: applicationId,
    time_on_page_seconds: Math.max(1, Math.floor((Date.now() - pageOpenTime) / 1000)),
    button_clicks: clicks.length > 0 ? clicks : ["submit_click"],
    cursor_hover_zones: zones.size > 0 ? Array.from(zones) : ["form_root"],
    return_visits_count: returnCount,
    technical_payload: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer || null,
    },
  };
}

export async function sendBehaviorMetrics(payload: BehaviorMetricsPayload): Promise<void> {
  const response = await fetch("/api/behavior-metrics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Behavior metrics create failed: ${response.status}`);
  }
}

export function normalizeToStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (value && typeof value === "object") {
    return Object.values(value).filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0,
    );
  }

  return [];
}

export function extractBudgetRangeText(value: unknown): string | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const raw = value as Record<string, unknown>;
  const from = typeof raw.from === "string" ? raw.from : null;
  const to = typeof raw.to === "string" ? raw.to : null;
  const label = typeof raw.label === "string" ? raw.label : null;
  if (label) {
    return label;
  }
  if (from && to) {
    return `${from} - ${to}`;
  }
  return from ?? to ?? null;
}

/** Парсит числа из строк вида «300 000», «5000000» для ползунка бюджета */
export function parseMoneyToNumber(s: string): number | null {
  const digits = s.replace(/\D/g, "");
  if (!digits) {
    return null;
  }
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) ? n : null;
}

export type BudgetBounds = { min: number; max: number; step: number };

const DEFAULT_BUDGET: BudgetBounds = { min: 150_000, max: 5_000_000, step: 50_000 };

export function budgetBoundsFromAdmin(value: unknown): BudgetBounds {
  if (!value || typeof value !== "object") {
    return DEFAULT_BUDGET;
  }
  const raw = value as Record<string, unknown>;
  const fromN =
    typeof raw.from === "number"
      ? raw.from
      : typeof raw.from === "string"
        ? parseMoneyToNumber(raw.from)
        : null;
  const toN =
    typeof raw.to === "number"
      ? raw.to
      : typeof raw.to === "string"
        ? parseMoneyToNumber(raw.to)
        : null;
  if (fromN != null && toN != null && toN > fromN) {
    const span = toN - fromN;
    const step = Math.max(50_000, Math.round(span / 40 / 50_000) * 50_000);
    return { min: fromN, max: toN, step };
  }
  return DEFAULT_BUDGET;
}

export async function fetchLatestAdminConfig(): Promise<AdminConfig | null> {
  try {
    const response = await fetch("/api/admin-config?limit=1");
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as AdminConfig[];
    return data[0] ?? null;
  } catch {
    return null;
  }
}

export function getDefaultServices(): string[] {
  return [
    "Комплексная AI-автоматизация отдела продаж",
    "Запуск персонального AI-консультанта",
    "Аудит воронки и скриптов продаж",
    "Внедрение CRM + аналитика под ключ",
  ];
}
