import React from "react";

export default function RelatedProducts({ products = [] }) {
  const sample = products.length ? products : [
    { id: 1, title: "Smart Watch", price: "$69.99" },
    { id: 2, title: "Wireless Earbuds", price: "$49.99" },
    { id: 3, title: "Travel Backpack", price: "$29.99" }
  ];

  return (
    <div style={{ padding: 18, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18 }}>
      <div style={{ fontWeight: 700, color: "#FFFFFF", marginBottom: 12 }}>Related Products</div>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        {sample.map((product) => (
          <div key={product.id} style={{ padding: 14, background: "var(--surface-strong)", borderRadius: 16 }}>
            <div style={{ fontWeight: 700, color: "#FFFFFF", marginBottom: 6 }}>{product.title}</div>
            <div style={{ color: "#60A5FA", fontWeight: 700 }}>{product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
