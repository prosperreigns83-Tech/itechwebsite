import React from "react";

export default function ToggleMenu({ open, title, onClose, items, children }) {
  if (!open) return null;

  return (
    <div className="menu-panel-overlay">
      <div className="menu-panel">
        <div className="menu-panel-header">
          <div style={{ fontWeight: 800, color: "#FFFFFF" }}>{title}</div>
          <button type="button" className="chat-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="menu-panel-content">
          {children}
          {items?.map((item) => (
            <button
              key={item.label}
              type="button"
              className="menu-item"
              onClick={item.onClick}
              style={item.style}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
