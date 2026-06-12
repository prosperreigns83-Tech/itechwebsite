export const ORDER_STATUSES = [
  { id: "pending", label: "Pending", color: "#F59E0B", icon: "⏳" },
  { id: "confirmed", label: "Confirmed", color: "#3B82F6", icon: "✅" },
  { id: "processing", label: "Processing", color: "#A855F7", icon: "🔧" },
  { id: "shipped", label: "Shipped", color: "#38BDF8", icon: "🚚" },
  { id: "out_for_delivery", label: "Out for Delivery", color: "#60A5FA", icon: "📦" },
  { id: "delivered", label: "Delivered", color: "#22C55E", icon: "🏁" },
  { id: "cancelled", label: "Cancelled", color: "#EF4444", icon: "❌" },
  { id: "returned", label: "Returned", color: "#F97316", icon: "↩️" },
];

export const PAYMENT_STATUSES = [
  { id: "payment_pending", label: "Payment Pending", color: "#FBBF24", icon: "💳" },
  { id: "payment_received", label: "Payment Received", color: "#22C55E", icon: "✅" },
  { id: "payment_processing", label: "Payment Processing", color: "#6366F1", icon: "⏳" },
  { id: "payment_confirmed", label: "Payment Confirmed", color: "#14B8A6", icon: "✔️" },
  { id: "payment_failed", label: "Payment Failed", color: "#EF4444", icon: "❌" },
  { id: "payment_refunded", label: "Payment Refunded", color: "#F97316", icon: "💸" },
  { id: "cash_on_delivery", label: "Cash on Delivery", color: "#8B5CF6", icon: "💵" },
  { id: "pay_on_delivery", label: "Pay on Delivery", color: "#0EA5E9", icon: "🧾" },
  { id: "on_hold", label: "On Hold", color: "#F59E0B", icon: "⏸️" },
];

export function getOrderStatusMeta(statusId) {
  return ORDER_STATUSES.find((item) => item.id === statusId) || { label: statusId || "Unknown", color: "#94A3B8", icon: "❔" };
}

export function getPaymentStatusMeta(statusId) {
  return PAYMENT_STATUSES.find((item) => item.id === statusId) || { label: statusId || "Unknown", color: "#94A3B8", icon: "❔" };
}

export function getDefaultPaymentStatus(paymentMethod) {
  if (!paymentMethod) return "payment_pending";
  const normalized = paymentMethod.toLowerCase();
  if (normalized.includes("cash")) return "cash_on_delivery";
  if (normalized.includes("pay on delivery") || normalized.includes("pod")) return "pay_on_delivery";
  return "payment_pending";
}

export function getEstimatedDeliveryDate(createdAt) {
  const base = new Date(createdAt);
  base.setDate(base.getDate() + 5);
  return base.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
