import type { DateRange } from "../types";

interface Props {
  range: DateRange;
  onChange: (range: DateRange) => void;
}

const PRESETS: { label: string; days: number | null }[] = [
  { label: "Últimos 30 días", days: 30 },
  { label: "Últimos 90 días", days: 90 },
  { label: "Todo el período", days: null },
];

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export default function DateRangeFilter({ range, onChange }: Props) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--ink-soft)",
        }}
      >
        Período
      </span>
      {PRESETS.map((preset) => (
        <button
          key={preset.label}
          onClick={() =>
            onChange({
              start: preset.days ? daysAgo(preset.days) : null,
              end: preset.days ? new Date().toISOString().slice(0, 10) : null,
            })
          }
          style={{
            background: "none",
            border: "none",
            borderBottom: "1px solid var(--rule-strong)",
            padding: "2px 4px",
            cursor: "pointer",
            fontSize: 14,
            color: "var(--credit)",
            fontStyle: "italic",
          }}
        >
          {preset.label}
        </button>
      ))}
      {(range.start || range.end) && (
        <span style={{ fontSize: 13, color: "var(--ink-soft)" }} className="tabular">
          {range.start} → {range.end}
        </span>
      )}
    </div>
  );
}