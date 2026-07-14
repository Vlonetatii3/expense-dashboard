import type { CSSProperties } from "react";
import type { Expense } from "../types";

interface Props {
  expenses: Expense[];
  onDelete: (id: number) => void;
}

export default function ExpensesLedger({ expenses, onDelete }: Props) {
  return (
    <section>
      <h2 style={sectionTitle}>Movimientos</h2>
      {expenses.length === 0 ? (
        <p style={{ color: "var(--ink-soft)", fontStyle: "italic" }}>
          No hay movimientos en este período.
        </p>
      ) : (
        <div>
          <div style={{ ...row, fontSize: 12, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <span style={{ width: 90 }}>Fecha</span>
            <span style={{ flex: 1 }}>Comercio</span>
            <span style={{ width: 130 }}>Categoría</span>
            <span style={{ width: 110, textAlign: "right" }}>Monto</span>
            <span style={{ width: 28 }} />
          </div>
          {expenses.map((exp) => (
            <div key={exp.id} style={row}>
              <span className="tabular" style={{ width: 90, fontSize: 13, color: "var(--ink-soft)" }}>
                {exp.expense_date}
              </span>
              <span style={{ flex: 1 }}>{exp.merchant}</span>
              <span style={{ width: 130, fontSize: 13, color: "var(--credit)" }}>{exp.category}</span>
              <span className="tabular" style={{ width: 110, textAlign: "right", color: "var(--debit)" }}>
                −${exp.amount.toFixed(2)}
              </span>
              <button
                onClick={() => onDelete(exp.id)}
                title="Eliminar movimiento"
                style={{
                  width: 28,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--ink-soft)",
                  fontSize: 15,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const sectionTitle: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontStyle: "italic",
  fontWeight: 500,
  fontSize: 19,
  color: "var(--ink)",
  borderBottom: "1px solid var(--rule-strong)",
  paddingBottom: 8,
  marginBottom: 8,
};

const row: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "8px 4px",
  borderBottom: "1px solid var(--rule)",
};