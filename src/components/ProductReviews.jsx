import React from "react";

export default function ProductReviews({ reviews = [] }) {
  const sample = reviews.length ? reviews : [
    { id: 1, name: "Ari", rating: 5, comment: "Excellent quality and fast delivery." },
    { id: 2, name: "Riley", rating: 4, comment: "Good value for money. Highly recommend." },
    { id: 3, name: "Sam", rating: 4, comment: "Stylish product and perfect fit." }
  ];

  return (
    <div style={{ padding: 18, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, display: "grid", gap: 14 }}>
      <div style={{ fontWeight: 700, color: "#FFFFFF" }}>Customer Reviews</div>
      {sample.map((review) => (
        <div key={review.id} style={{ display: "grid", gap: 6, padding: 14, background: "var(--surface-strong)", borderRadius: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, color: "#FFFFFF" }}>{review.name}</span>
            <span style={{ fontSize: 12, color: "#60A5FA" }}>{'★'.repeat(review.rating)}</span>
          </div>
          <div style={{ color: "#94A3B8", fontSize: 13 }}>{review.comment}</div>
        </div>
      ))}
    </div>
  );
}
