import React from "react";

export default function Modal({ title, open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 18, right: 18, border: "none", background: "rgba(255,255,255,0.08)", color: "#FFFFFF", borderRadius: 12, width: 35, height: 35, cursor: "pointer" }}>×</button>
        {title && <div style={{ fontSize: 18, fontWeight: 800, color: "#FFFFFF", marginBottom: 14 }}>{title}</div>}
        {children}
      </div>
    </div>
  );
}
