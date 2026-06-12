import React from "react";

export default function SkeletonCard({ lines = 3 }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 18, display: "grid", gap: 10 }}>
      {[...Array(lines)].map((_, index) => (
        <div key={index} style={{ height: 14, borderRadius: 999, background: "rgba(255,255,255,0.08)" }} />
      ))}
    </div>
  );
}
