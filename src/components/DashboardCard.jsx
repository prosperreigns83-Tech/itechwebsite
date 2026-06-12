import React from "react";

export default function DashboardCard({ title, value, subtitle, accent }) {
  return (
    <div style={{ background: "var(--surface-strong)", borderRadius: 18, padding: 20, border: "1px solid var(--border)", boxShadow: "0 18px 40px rgba(0,0,0,0.14)" }}>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 10 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: accent || "#60A5FA" }}>{value}</div>
      {subtitle && <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 8 }}>{subtitle}</div>}
    </div>
  );
}
