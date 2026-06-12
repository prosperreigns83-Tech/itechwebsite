import React from "react";

export default function OrderCard({ order }) {
  return (
    <div style={{ background: "var(--surface-strong)", border: "1px solid var(--border)", borderRadius: 18, padding: 18, display: "grid", gap: 8 }}>
      <div style={{ fontWeight: 700, color: "#FFFFFF" }}>Order #{order.id}</div>
      <div style={{ color: "#94A3B8" }}>{order.date}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#60A5FA", fontWeight: 700 }}>{order.total}</div>
        <span style={{ color: "#94A3B8", fontSize: 12 }}>{order.status}</span>
      </div>
    </div>
  );
}
