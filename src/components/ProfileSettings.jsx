import React from "react";
import BottomNav from "./BottomNav";

export default function ProfileSettings({ onNavigate, theme = "dark", onThemeChange }) {
  return (
    <div className="app-shell">
      <div className="content-wrapper">
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.06)"
          }}
        >
          <button
            type="button"
            onClick={() => onNavigate("profile")}
            style={{
              background: "none",
              border: "none",
              color: "var(--text)",
              fontSize: "18px",
              cursor: "pointer"
            }}
          >
            ←
          </button>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--muted)" }}>Settings</div>
          <div style={{ width: 24 }} />
        </div>

        {/* Settings Content */}
        <div style={{ padding: "16px 18px" }}>
          {/* Theme Section */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#FFFFFF",
                marginBottom: 12
              }}
            >
              🎨 Appearance
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <button
                type="button"
                onClick={() => onThemeChange("dark")}
                style={{
                  padding: "14px",
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg,rgba(59,130,246,0.15),rgba(37,99,255,0.1))"
                      : "rgba(255,255,255,0.04)",
                  border:
                    theme === "dark"
                      ? "2px solid rgba(59,130,246,0.4)"
                      : "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  color: "#FFFFFF",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  transition: "all 200ms ease"
                }}
              >
                <span style={{ fontSize: 18 }}>🌙</span>
                <div style={{ textAlign: "left" }}>
                  <div>Dark Mode</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                    Easy on the eyes
                  </div>
                </div>
                {theme === "dark" && (
                  <span style={{ marginLeft: "auto", fontSize: 16 }}>✓</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onThemeChange("light")}
                style={{
                  padding: "14px",
                  background:
                    theme === "light"
                      ? "linear-gradient(135deg,rgba(59,130,246,0.15),rgba(37,99,255,0.1))"
                      : "rgba(255,255,255,0.04)",
                  border:
                    theme === "light"
                      ? "2px solid rgba(59,130,246,0.4)"
                      : "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  color: "#FFFFFF",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  transition: "all 200ms ease"
                }}
              >
                <span style={{ fontSize: 18 }}>☀️</span>
                <div style={{ textAlign: "left" }}>
                  <div>Light Mode</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                    Bright and clean
                  </div>
                </div>
                {theme === "light" && (
                  <span style={{ marginLeft: "auto", fontSize: 16 }}>✓</span>
                )}
              </button>
            </div>
          </div>

          {/* Other Settings */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", marginBottom: 12 }}>
              🔔 Notifications
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                padding: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <div style={{ color: "#FFFFFF", fontWeight: 600 }}>Order Updates</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                  Get notified about orders
                </div>
              </div>
              <input
                type="checkbox"
                defaultChecked
                style={{ cursor: "pointer", width: 20, height: 20 }}
              />
            </div>
          </div>

          {/* About Section */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", marginBottom: 12 }}>
              ℹ️ About
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                padding: 14,
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: 12, color: "var(--muted)" }}>itech Marketplace</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
                Version 1.0.0
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 12 }}>
                © 2026 itech. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="profile" onNavigate={onNavigate} />
    </div>
  );
}
