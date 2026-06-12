import React from "react";

export default function ErrorState({ title = "Something went wrong", description = "Please try again later." }) {
  return (
    <div style={{ textAlign: "center", padding: 30, borderRadius: 18, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#FCA5A5" }}>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{title}</div>
      <div>{description}</div>
    </div>
  );
}
