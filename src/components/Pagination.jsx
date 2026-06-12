import React from "react";

export default function Pagination({ current, total, onPageChange }) {
  const pages = Array.from({ length: total }, (_, idx) => idx + 1);
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            minWidth: 40,
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.08)",
            background: current === page ? "linear-gradient(135deg,#3B82F6,#2563EB)" : "rgba(255,255,255,0.04)",
            color: "#FFFFFF",
            cursor: "pointer"
          }}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
