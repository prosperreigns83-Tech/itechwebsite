const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'orders.json');

function loadOrders() {
  if (!fs.existsSync(filePath)) return [];
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('Failed to load orders database', err);
    return [];
  }
}

function saveOrders(orders) {
  fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), 'utf8');
}

module.exports = {
  createOrder(order) {
    const orders = loadOrders();
    const record = {
      orderId: order.orderId,
      referenceId: order.referenceId,
      status: order.status || 'created',
      data: order.data || {},
      timeline: order.timeline || [],
      createdAt: new Date().toISOString()
    };
    orders.push(record);
    saveOrders(orders);
    return { orderId: record.orderId, referenceId: record.referenceId };
  },
  getOrderByOrderId(orderId) {
    const orders = loadOrders();
    const row = orders.find((o) => o.orderId === orderId);
    return row || null;
  },
  getOrderByReference(referenceId) {
    const orders = loadOrders();
    const row = orders.find((o) => o.referenceId === referenceId);
    return row || null;
  },
  updateOrderTimelineAndStatus(referenceId, newStatus, timelineEvent) {
    const orders = loadOrders();
    const index = orders.findIndex((o) => o.referenceId === referenceId);
    if (index === -1) return null;
    const order = orders[index];
    order.status = newStatus;
    if (timelineEvent) {
      order.timeline = order.timeline || [];
      order.timeline.push(timelineEvent);
    }
    orders[index] = order;
    saveOrders(orders);
    return order;
  }
};
