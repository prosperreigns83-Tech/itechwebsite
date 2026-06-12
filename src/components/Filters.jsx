import React from "react";

export default function Filters({ title, options = [], selected, onSelect }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 18, display: "grid", gap: 12 }}>
      <div style={{ fontWeight: 700, color: "var(--text)" }}>{title}</div>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))" }}>
        {options.map((option) => (
          <button key={option} onClick={() => onSelect(option)} style={{ padding: 12, borderRadius: 14, border: option === selected ? "1px solid #3B82F6" : "1px solid rgba(255,255,255,0.08)", background: option === selected ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)", color: "var(--text)", cursor: "pointer" }}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
