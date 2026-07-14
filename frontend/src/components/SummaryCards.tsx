import type { Summary } from "../types";

interface Props {
  summary: Summary | null;
}

function formatMoney(n: number): string {
  return n.toLocaleString("es-PY", { style: "currency", currency: "USD" });
}

export default function SummaryCards({ summary }: Props) {
  if (!summary) return null;

  const items: { label: string; value: string; color?: string }[] = [
    { label: "Total gastado", value: formatMoney(summary.total_spent), color: "var(--debit)" },
    { label: "Ticket promedio", value: formatMoney(summary.average_ticket) },
    { label: "Movimientos", value: String(summary.transaction_count) },
    { label: "Categoría top", value: summary.top_category ?? "—" },
  ];

  return (
    <div
      style={{
        border: "2px solid var(--rule-strong)",
        borderRadius: 4,
        padding: "20px 24px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 16,
        position: "relative",
        background: "var(--paper-raised)",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: -12,
          left: 20,
          background: "var(--paper)",
          padding: "0 8px",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--stamp)",
          border: "1px solid var(--stamp)",
          borderRadius: 2,
          transform: "rotate(-2deg)",
        }}
      >
        Balance del período
      </span>

      {items.map((item) => (
        <div key={item.label}>
          <div
            style={{
              fontSize: 12,
              color: "var(--ink-soft)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 4,
            }}
          >
            {item.label}
          </div>
          <div
            className="tabular"
            style={{ fontSize: 22, fontWeight: 600, color: item.color ?? "var(--ink)" }}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}