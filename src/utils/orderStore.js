const ORDERS_KEY = "itechOrders";

function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("orders-updated"));
}

export function getOrders() {
  return loadOrders();
}

export function getOrderById(orderId) {
  return loadOrders().find((order) => order.id === orderId) || null;
}

export function addOrder(order) {
  const orders = loadOrders();
  const createdAt = new Date().toISOString();
  const transactionRef = `TX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const toStore = {
    id: `order-${Date.now()}`,
    createdAt,
    updatedAt: createdAt,
    status: order.status || "pending",
    paymentStatus: order.paymentStatus || "payment_pending",
    paymentMethod: order.paymentMethod || "Online Payment",
    transactionRef,
    estimatedDelivery: order.estimatedDelivery || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    history: order.history || [
      {
        id: `evt-${Date.now()}-1`,
        timestamp: createdAt,
        type: "order_created",
        title: "Order received",
        message: "Your order has been placed and is awaiting confirmation.",
        status: "pending",
      },
    ],
    ...order,
  };
  orders.unshift(toStore);
  saveOrders(orders);
  return toStore;
}

export function updateOrder(orderId, updates) {
  const orders = loadOrders();
  let updated = null;
  const next = orders.map((order) => {
    if (order.id !== orderId) return order;
    updated = { ...order, ...updates, updatedAt: new Date().toISOString() };

    if (updates.status && updates.status !== order.status) {
      updated.history = [
        ...(order.history || []),
        {
          id: `evt-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          timestamp: new Date().toISOString(),
          type: "status_change",
          title: `Order ${updates.status.replace(/_/g, " ")}`,
          message: `Order moved to ${updates.status.replace(/_/g, " ")}.`,
          status: updates.status,
        },
      ];
    }

    if (updates.paymentStatus && updates.paymentStatus !== order.paymentStatus) {
      updated.history = [
        ...(updated.history || order.history || []),
        {
          id: `evt-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          timestamp: new Date().toISOString(),
          type: "payment_change",
          title: `Payment ${updates.paymentStatus.replace(/_/g, " ")}`,
          message: `Payment status updated to ${updates.paymentStatus.replace(/_/g, " ")}.`,
          status: updates.paymentStatus,
        },
      ];
    }

    return updated;
  });
  saveOrders(next);
  return updated;
}

export function changeOrderStatus(orderId, status) {
  return updateOrder(orderId, { status });
}

export function changePaymentStatus(orderId, paymentStatus) {
  return updateOrder(orderId, { paymentStatus });
}

export function getOrdersBySeller(sellerId) {
  return loadOrders().filter((o) => o.items.some((it) => it.sellerId === sellerId));
}

export function getSalesSummary(sellerId) {
  const orders = getOrdersBySeller(sellerId);
  let total = 0;
  let count = 0;
  for (const o of orders) {
    for (const it of o.items) {
      if (it.sellerId === sellerId) {
        const price = parseFloat((it.price || "0").toString().replace(/[^0-9.-]+/g, "")) || 0;
        total += price * (it.qty || 1);
        count += it.qty || 1;
      }
    }
  }
  return { total, count, orders };
}

export default { getOrders, getOrderById, addOrder, updateOrder, changeOrderStatus, changePaymentStatus, getOrdersBySeller, getSalesSummary };
