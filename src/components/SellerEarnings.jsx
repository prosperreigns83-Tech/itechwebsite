import React from "react";
import PageShell from "./PageShell";

export default function SellerEarnings() {
  return (
    <PageShell title="Seller Earnings" description="Track your store revenue and performance.">
      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 20 }}>
          <div style={{ color: "#FFFFFF", fontWeight: 700, marginBottom: 10 }}>Monthly Sales</div>
          <div style={{ color: "#60A5FA", fontSize: 28, fontWeight: 800 }}>$4,890</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 20 }}>
          <div style={{ color: "#FFFFFF", fontWeight: 700, marginBottom: 10 }}>Payout Balance</div>
          <div style={{ color: "#60A5FA", fontSize: 28, fontWeight: 800 }}>$1,220</div>
        </div>
      </div>
    </PageShell>
  );
}
