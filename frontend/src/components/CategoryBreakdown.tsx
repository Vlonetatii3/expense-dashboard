import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";
import type { CSSProperties } from "react";
import type { CategoryBreakdownItem } from "../types";

interface Props {
  data: CategoryBreakdownItem[];
}

const PALETTE = ["#2f5233", "#4c6f4f", "#7f9c88", "#a6772a", "#a13d2d", "#6b5b3a", "#3d5a4c"];

export default function CategoryBreakdown({ data }: Props) {
  return (
    <section>
      <h2 style={sectionTitle}>Por categoría</h2>
      <ResponsiveContainer width="100%" height={Math.max(220, data.length * 40)}>
        <BarChart data={data} layout="vertical" margin={{ left: 12, right: 24 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="category"
            width={130}
            tick={{ fontFamily: "var(--font-body)", fontSize: 13, fill: "var(--ink)" }}
            axisLine={{ stroke: "var(--rule-strong)" }}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number, _name, item) => [
              `$${value.toFixed(2)} (${item.payload.percentage}%)`,
              "Total",
            ]}
            contentStyle={{
              background: "var(--paper-raised)",
              border: "1px solid var(--rule-strong)",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
            }}
          />
          <Bar dataKey="total" radius={[0, 3, 3, 0]} barSize={18}>
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
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