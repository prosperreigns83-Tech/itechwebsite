import React from "react";
import PageShell from "./PageShell";

export default function CategoryFilter() {
  return (
    <PageShell title="Category Filters" description="Refine products by category, price, and brand.">
      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 20 }}>
          <div style={{ color: "var(--text)", fontWeight: 700, marginBottom: 10 }}>Filter panel</div>
          <div style={{ color: "#94A3B8" }}>Category filters help shoppers narrow product results.</div>
        </div>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
          {['Electronics','Fashion','Home','Beauty','Sports','Toys'].map((name) => (
            <button key={name} style={{padding:16,borderRadius:14,border:'1px solid rgba(255,255,255,0.08)',background:'var(--surface-strong)',color:'var(--text)',cursor:'pointer'}}>{name}</button>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
