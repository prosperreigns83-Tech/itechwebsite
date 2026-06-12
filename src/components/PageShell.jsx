import React from "react";

export default function PageShell({ title, description, children }) {
  return (
    <div className="content-wrapper">
      <div style={{ padding: "18px 18px 0", maxWidth: 1200, margin: "0 auto" }}>
        {title && <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)" }}>{title}</div>
            {description && <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 5 }}>{description}</div>}
          </div>
        </div>}
        {children}
      </div>
    </div>
  );
}
