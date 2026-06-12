import React from "react";
import PageShell from "./PageShell";
import { useStore } from "../context/StoreContext";
import OrderTimeline from "./OrderTimeline";
import StatusBadge from "./StatusBadge";

export default function OrderTracking() {
  const { orders } = useStore();
  const latestOrder = orders[0] || null;

  if (!latestOrder) {
    return (
      <PageShell title="Order Tracking" description="Track delivery progress in real time.">
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 24, color: "#94A3B8" }}>
          No orders available yet. Place an order and return to track it in real time.
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Order Tracking" description="Track delivery progress in real time.">
      <div style={{ display: "grid", gap: 18 }}>
        <div style={{ background: "var(--surface-strong)", border: "1px solid var(--border)", borderRadius: 18, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 800, color: "#FFFFFF" }}>Order #{latestOrder.id}</div>
              <div style={{ color: "#94A3B8", marginTop: 4 }}>{new Date(latestOrder.createdAt).toLocaleString()}</div>
            </div>
            <div style={{ display: "grid", gap: 8, alignItems: "end" }}>
              <StatusBadge status={latestOrder.status} />
              <StatusBadge status={latestOrder.paymentStatus} type="payment" />
            </div>
          </div>
        </div>

        <div style={{ background: "var(--surface-strong)", border: "1px solid var(--border)", borderRadius: 18, padding: 20 }}>
          <div style={{ fontWeight: 700, color: "#FFFFFF", marginBottom: 12 }}>Delivery Progress</div>
          <OrderTimeline currentStatus={latestOrder.status} />
        </div>

        <div style={{ background: "var(--surface-strong)", border: "1px solid var(--border)", borderRadius: 18, padding: 20 }}>
          <div style={{ fontWeight: 700, color: "#FFFFFF", marginBottom: 12 }}>Order Summary</div>
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#94A3B8" }}>
              <span>Payment method</span>
              <span>{latestOrder.paymentMethod}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#94A3B8" }}>
              <span>Estimated delivery</span>
              <span>{new Date(latestOrder.estimatedDelivery).toLocaleDateString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#94A3B8" }}>
              <span>Total</span>
              <span>{latestOrder.total}</span>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
