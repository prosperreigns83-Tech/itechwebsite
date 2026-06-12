import React from "react";

export default function ChartPlaceholder({ title }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 20, minHeight: 220, display: "grid", gap: 10 }}>
      <div style={{ fontWeight: 700, color: "var(--text)" }}>{title}</div>
      <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>
        Chart preview coming soon
      </div>
    </div>
  );
}
