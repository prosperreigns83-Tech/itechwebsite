import React from "react";

export default function EmptyState({ title, description }) {
  return (
    <div style={{ textAlign: "center", padding: 30, borderRadius: 18, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#94A3B8" }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>{title}</div>
      <div>{description}</div>
    </div>
  );
}
