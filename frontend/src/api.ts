import type {
  Expense,
  Summary,
  CategoryBreakdownItem,
  MonthlyTrendItem,
  MerchantItem,
  DateRange,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

function buildQuery(range: DateRange, extra: Record<string, string | number> = {}): string {
  const params = new URLSearchParams();
  if (range.start) params.set("start", range.start);
  if (range.end) params.set("end", range.end);
  for (const [key, value] of Object.entries(extra)) {
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Error ${res.status} al pedir ${path}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getExpenses(range: DateRange, limit = 50): Promise<Expense[]> {
    return getJSON(`/api/expenses${buildQuery(range, { limit })}`);
  },

  getSummary(range: DateRange): Promise<Summary> {
    return getJSON(`/api/analytics/summary${buildQuery(range)}`);
  },

  getCategoryBreakdown(range: DateRange): Promise<CategoryBreakdownItem[]> {
    return getJSON(`/api/analytics/by-category${buildQuery(range)}`);
  },

  getMonthlyTrend(range: DateRange): Promise<MonthlyTrendItem[]> {
    return getJSON(`/api/analytics/monthly-trend${buildQuery(range)}`);
  },

  getTopMerchants(range: DateRange, limit = 5): Promise<MerchantItem[]> {
    return getJSON(`/api/analytics/top-merchants${buildQuery(range, { limit })}`);
  },

  async createExpense(expense: Omit<Expense, "id" | "created_at">): Promise<Expense> {
    const res = await fetch(`${API_URL}/api/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });
    if (!res.ok) throw new Error(`Error ${res.status} al crear el gasto`);
    return res.json();
  },

  async deleteExpense(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/api/expenses/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Error ${res.status} al borrar el gasto`);
  },
};