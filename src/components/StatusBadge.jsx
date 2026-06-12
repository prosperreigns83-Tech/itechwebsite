import React from "react";
import { getOrderStatusMeta, getPaymentStatusMeta } from "../utils/orderStatus";

export default function StatusBadge({ status, type = "order" }) {
  const meta = type === "payment" ? getPaymentStatusMeta(status) : getOrderStatusMeta(status);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        color: "#FFFFFF",
        background: `${meta.color}22`,
        border: `1px solid ${meta.color}33`,
      }}
    >
      <span>{meta.icon}</span>
      {meta.label}
    </span>
  );
}
