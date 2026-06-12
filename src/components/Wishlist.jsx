import React from "react";
import PageShell from "./PageShell";
import { useStore } from "../context/StoreContext";

export default function Wishlist({ onNavigate }) {
  const { wishlist } = useStore();

  return (
    <PageShell title="Wishlist" description="Saved products for later checkout.">
      {wishlist.length === 0 ? (
        <div style={{ padding: 24, borderRadius: 18, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#94A3B8", textAlign: "center" }}>
          Your wishlist is empty. Tap a heart icon to save favorites.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {wishlist.map((item) => (
            <div key={item.id} style={{ background: "var(--surface-strong)", borderRadius: 18, padding: 18, display: "grid", gap: 10 }}>
              <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{item.title}</div>
              <div style={{ color: "#94A3B8" }}>{item.subtitle}</div>
              <div style={{ fontWeight: 700, color: "#60A5FA" }}>{item.price}</div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
