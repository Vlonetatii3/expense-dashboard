import { useEffect, useState, useCallback } from "react";
import { api } from "./api";
import type { DateRange, Expense, Summary, CategoryBreakdownItem, MonthlyTrendItem } from "./types";
import DateRangeFilter from "./components/DateRangeFilter";
import SummaryCards from "./components/SummaryCards";
import CategoryBreakdown from "./components/CategoryBreakdown";
import MonthlyTrend from "./components/MonthlyTrend";
import ExpensesLedger from "./components/ExpensesLedger";

export default function App() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [summary, setSummary] = useState<Summary | null>(null);
  const [categories, setCategories] = useState<CategoryBreakdownItem[]>([]);
  const [trend, setTrend] = useState<MonthlyTrendItem[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async (r: DateRange) => {
    setLoading(true);
    setError(null);
    try {
      const [s, c, t, e] = await Promise.all([
        api.getSummary(r),
        api.getCategoryBreakdown(r),
        api.getMonthlyTrend(r),
        api.getExpenses(r, 50),
      ]);
      setSummary(s);
      setCategories(c);
      setTrend(t);
      setExpenses(e);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll(range);
  }, [range, loadAll]);

  async function handleDelete(id: number) {
    await api.deleteExpense(id);
    loadAll(range);
  }

  return (
    <>
      <header style={{ marginBottom: 32 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--ink-soft)",
          }}
        >
          Libro de gastos personales
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 36,
            fontWeight: 600,
            margin: "4px 0 16px",
            color: "var(--ink)",
          }}
        >
          El Libro Mayor
        </h1>
        <DateRangeFilter range={range} onChange={setRange} />
      </header>

      {error && (
        <p style={{ color: "var(--debit)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
          {error}
        </p>
      )}

      {loading ? (
        <p style={{ color: "var(--ink-soft)", fontStyle: "italic" }}>Cargando movimientos…</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <SummaryCards summary={summary} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 40,
            }}
          >
            <CategoryBreakdown data={categories} />
            <MonthlyTrend data={trend} />
          </div>
          <ExpensesLedger expenses={expenses} onDelete={handleDelete} />
        </div>
      )}
    </>
  );
}