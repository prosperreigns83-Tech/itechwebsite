import React from "react";
import PageShell from "./PageShell";

export default function SellerProducts() {
  return (
    <PageShell title="Seller Products" description="Manage your product catalog and listings.">
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 24, color: "#94A3B8" }}>
        This page will let sellers add, edit, and archive products.
      </div>
    </PageShell>
  );
}
