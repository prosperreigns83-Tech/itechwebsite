import React, { useState } from "react";
import BottomNav from "./BottomNav";
import { useNotifications } from "../context/NotificationsContext";

export default function Notifications({ onNavigate, profileData }) {
  const { notifications, addNotification, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newType, setNewType] = useState("info");
  const [showForm, setShowForm] = useState(false);

  const handleAddNotification = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) {
      alert("Title and message are required");
      return;
    }
    addNotification({
      title: newTitle,
      message: newMessage,
      type: newType
    });
    setNewTitle("");
    setNewMessage("");
    setNewType("info");
    setShowForm(false);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "success": return "#10B981";
      case "error": return "#EF4444";
      case "warning": return "#F59E0B";
      case "info":
      default:
        return "#60A5FA";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "success": return "✓";
      case "error": return "✕";
      case "warning": return "⚠";
      case "info":
      default:
        return "ℹ";
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

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
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--muted)" }}>
            Notifications
          </div>
          <div style={{ width: 24 }} />
        </div>

        {/* Notifications List */}
        <div style={{ padding: "14px 18px" }}>
          {/* Action Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: "12px",
                background: "linear-gradient(135deg,#3B82F6,#2563EB)",
                border: "none",
                borderRadius: 10,
                color: "#FFFFFF",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 13
              }}
            >
              {showForm ? "Cancel" : "+ Add Notification"}
            </button>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (notifications.some(n => !n.read)) {
                    markAllAsRead();
                  } else {
                    clearAll();
                  }
                }}
                style={{
                  padding: "12px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  color: "var(--text)",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: 13
                }}
              >
                {notifications.some(n => !n.read) ? "Mark All Read" : "Clear All"}
              </button>
            )}
          </div>

          {/* Add Notification Form */}
          {showForm && (
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                padding: 14,
                marginBottom: 16,
                display: "grid",
                gap: 10
              }}
            >
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Notification title"
                className="login-input"
                style={{ marginBottom: 8 }}
              />
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Notification message"
                className="login-input"
                rows={3}
                style={{ resize: "vertical", marginBottom: 8 }}
              />
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="login-input"
                style={{ marginBottom: 8 }}
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
              <button
                type="button"
                onClick={handleAddNotification}
                style={{
                  padding: "10px",
                  background: "linear-gradient(135deg,#10B981,#059669)",
                  border: "none",
                  borderRadius: 10,
                  color: "#FFFFFF",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Send Notification
              </button>
            </div>
          )}

          {/* Notifications */}
          {notifications.length > 0 ? (
            <div style={{ display: "grid", gap: 10 }}>
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  style={{
                    background: notif.read
                      ? "rgba(255,255,255,0.02)"
                      : "linear-gradient(135deg,rgba(59,130,246,0.12),rgba(37,99,255,0.08))",
                    border: notif.read
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid rgba(59,130,246,0.25)",
                    borderRadius: 12,
                    padding: 14,
                    cursor: "pointer",
                    transition: "all 200ms ease",
                    opacity: notif.read ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!notif.read) {
                      e.currentTarget.style.background = "linear-gradient(135deg,rgba(59,130,246,0.15),rgba(37,99,255,0.1))";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!notif.read) {
                      e.currentTarget.style.background = "linear-gradient(135deg,rgba(59,130,246,0.12),rgba(37,99,255,0.08))";
                    }
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: `${getTypeColor(notif.type)}20`,
                        border: `1px solid ${getTypeColor(notif.type)}40`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: getTypeColor(notif.type),
                        fontSize: 18,
                        flexShrink: 0
                      }}
                    >
                      {getTypeIcon(notif.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 6 }}>
                        <div style={{ fontWeight: 700, color: "#FFFFFF", fontSize: 14 }}>
                          {notif.title}
                        </div>
                        {!notif.read && (
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: "#60A5FA",
                              flexShrink: 0
                            }}
                          />
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8, lineHeight: 1.4 }}>
                        {notif.message}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>
                          {formatDate(notif.timestamp)}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--muted)",
                            fontSize: 16,
                            cursor: "pointer",
                            padding: 0
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "var(--muted)",
                background: "rgba(255,255,255,0.03)",
                borderRadius: 16,
                border: "1px dashed rgba(255,255,255,0.06)"
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>🔔</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>No notifications yet</div>
              <div style={{ fontSize: 12 }}>Add your first notification using the button above</div>
            </div>
          )}
        </div>
      </div>

      <BottomNav active="profile" onNavigate={onNavigate} />
    </div>
  );
}
