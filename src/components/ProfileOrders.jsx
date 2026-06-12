import React from "react";
import BottomNav from "./BottomNav";
import { useStore } from "../context/StoreContext";
import StatusBadge from "./StatusBadge";
import OrderTimeline from "./OrderTimeline";
import { getEstimatedDeliveryDate } from "../utils/orderStatus";

export default function ProfileOrders({ onNavigate }) {
  const { orders } = useStore();

  return (
    <div className="app-shell">
      <div className="content-wrapper">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.06)"
        }}>
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
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--muted)" }}>Order Tracking</div>
          <div style={{ width: 24 }} />
        </div>

        <div style={{ padding: "14px 18px", display: "grid", gap: 16 }}>
          <button
            type="button"
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => onNavigate("order-tracking")}
          >
            Track Latest Order
          </button>
          {orders.length === 0 ? (
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 24, color: "#94A3B8", textAlign: "center" }}>
              No orders yet. Complete a purchase to track your order status and payment progress.
            </div>
          ) : orders.map((order) => (
            <div key={order.id} style={{ background: "var(--surface-strong)", borderRadius: 18, border: "1px solid var(--border)", overflow: "hidden" }}>
              <div style={{ padding: 18, display: "grid", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 800, color: "#FFFFFF" }}>Order #{order.id}</div>
                    <div style={{ color: "#94A3B8", marginTop: 4 }}>{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                    <StatusBadge status={order.status} />
                    <StatusBadge status={order.paymentStatus} type="payment" />
                  </div>
                </div>

                <div style={{ display: "grid", gap: 12, padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#94A3B8" }}>Payment method</div>
                      <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{order.paymentMethod}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, color: "#94A3B8" }}>Estimate</div>
                      <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{getEstimatedDeliveryDate(order.createdAt)}</div>
                    </div>
                  </div>
                  <div style={{ color: "#94A3B8", fontSize: 13 }}>{order.orderNote || "No special instructions provided."}</div>
                </div>

                <div>
                  <div style={{ fontWeight: 700, color: "#FFFFFF", marginBottom: 10 }}>Delivery progress</div>
                  <OrderTimeline currentStatus={order.status} />
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  <div style={{ color: "#94A3B8", fontSize: 12 }}>Transaction reference</div>
                  <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{order.transactionRef}</div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 14 }}>
                  <div style={{ fontWeight: 700, color: "#FFFFFF", marginBottom: 10 }}>Order activity</div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {(order.history || []).slice(-4).reverse().map((event) => (
                      <div key={event.id} style={{ display: "grid", gap: 4 }}>
                        <div style={{ fontSize: 12, color: "#94A3B8" }}>{new Date(event.timestamp).toLocaleString()}</div>
                        <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{event.title}</div>
                        <div style={{ fontSize: 13, color: "#CBD5E1" }}>{event.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="profile" onNavigate={onNavigate} />
    </div>
  );
}
