import React, { useState } from "react";
import BottomNav from "./BottomNav";

export default function ProfilePayment({ onNavigate, profileData, paymentMethods = [], onUpdatePayments }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newType, setNewType] = useState("");
  const [newDetail, setNewDetail] = useState("");

  const defaultPayments = [
    { type: "Visa", detail: "**** **** **** 4242", expiry: "12/27" },
    { type: "PayPal", detail: "you@mail.com" }
  ];

  const payments = paymentMethods.length > 0 ? paymentMethods : defaultPayments;

  const handleAddPayment = () => {
    if (newType.trim() && newDetail.trim()) {
      const updated = [...payments, { type: newType, detail: newDetail }];
      if (onUpdatePayments) onUpdatePayments(updated);
      setNewType("");
      setNewDetail("");
      setShowAddForm(false);
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
            Payment Methods
          </div>
          <div style={{ width: 24 }} />
        </div>

        {/* Payment Methods List */}
        <div style={{ padding: "14px 18px" }}>
          <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
            {payments.map((payment, index) => (
              <div
                key={index}
                style={{
                  background: "linear-gradient(135deg,rgba(59,130,246,0.12),rgba(37,99,255,0.08))",
                  border: "1px solid rgba(59,130,246,0.25)",
                  borderRadius: 12,
                  padding: 14,
                  backdropFilter: "blur(8px)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", marginBottom: 6 }}>
                      {payment.type}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{payment.detail}</div>
                    {payment.expiry && (
                      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                        Expires: {payment.expiry}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      borderRadius: 6,
                      color: "#FCA5A5",
                      padding: "6px 10px",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Payment Form */}
          {showAddForm ? (
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                padding: 14,
                display: "grid",
                gap: 10
              }}
            >
              <input
                type="text"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="Method type (Visa, PayPal)"
                className="login-input"
              />
              <input
                type="text"
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
                placeholder="Card number or account detail"
                className="login-input"
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={{
                    padding: "10px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    color: "var(--text)",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddPayment}
                  style={{
                    padding: "10px",
                    background: "linear-gradient(135deg,#3B82F6,#2563EB)",
                    border: "none",
                    borderRadius: 10,
                    color: "#FFFFFF",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Save Method
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              style={{
                width: "100%",
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
              + Add Payment Method
            </button>
          )}
        </div>
      </div>

      <BottomNav active="profile" onNavigate={onNavigate} />
    </div>
  );
}
