import React from "react";
import PageShell from "./PageShell";
import { useStore } from "../context/StoreContext";
import StatusBadge from "./StatusBadge";

export default function OrderHistory() {
  const { orders } = useStore();

  return (
    <PageShell title="Order History" description="Track your past purchases and shipment status.">
      {orders.length === 0 ? (
        <div style={{ padding: 24, borderRadius: 18, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#94A3B8", textAlign: "center" }}>
          No orders yet. Place an order to see history here.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {orders.map((order) => (
            <div key={order.id} style={{ background: "var(--surface-strong)", borderRadius: 18, padding: 18, display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#FFFFFF" }}>Order #{order.id}</div>
                  <div style={{ color: "#94A3B8", fontSize: 13 }}>{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div style={{ color: "#60A5FA", fontWeight: 700 }}>{order.total}</div>
                <div style={{ color: "#94A3B8" }}>{order.paymentMethod}</div>
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                {order.items?.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", color: "#cfe9ff" }}>
                    <span>{item.title} × {item.qty}</span>
                    <span>{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
