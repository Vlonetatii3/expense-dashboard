import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { CSSProperties } from "react";
import type { MonthlyTrendItem } from "../types";

interface Props {
  data: MonthlyTrendItem[];
}

export default function MonthlyTrend({ data }: Props) {
  return (
    <section>
      <h2 style={sectionTitle}>Evolución mensual</h2>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ left: -12, right: 12, top: 8 }}>
          <CartesianGrid stroke="var(--rule)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontFamily: "var(--font-mono)", fontSize: 12, fill: "var(--ink-soft)" }}
            axisLine={{ stroke: "var(--rule-strong)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontFamily: "var(--font-mono)", fontSize: 12, fill: "var(--ink-soft)" }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Total"]}
            contentStyle={{
              background: "var(--paper-raised)",
              border: "1px solid var(--rule-strong)",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
            }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="var(--debit)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--debit)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
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
  marginBottom: 16,
};