const NOTIFICATIONS_KEY = 'itechNotifications';

function loadNotifications() {
  try {
    return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
  } catch (err) {
    return [];
  }
}

function saveNotifications(notifications) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  window.dispatchEvent(new Event('notifications-updated'));
}

function generateId(prefix = 'notif') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 90000 + 10000)}`;
}

function getNotificationsForUser(userId) {
  const all = loadNotifications();
  if (!userId) {
    return all.filter((notification) => notification.userId === 'all' || notification.userId === null);
  }
  return all.filter((notification) => notification.userId === 'all' || notification.userId === userId);
}

function addNotificationForUser(userId, notification) {
  const currentUser = userId || 'all';
  const now = new Date().toISOString();
  const item = {
    id: generateId('notif'),
    userId: currentUser,
    title: notification.title || 'Notification',
    message: notification.message || '',
    type: notification.type || 'info',
    read: notification.read || false,
    timestamp: notification.timestamp || now,
    createdAt: now,
  };
  const existing = loadNotifications();
  saveNotifications([item, ...existing]);
  return item;
}

function markNotificationRead(userId, notificationId) {
  const notifications = loadNotifications();
  const next = notifications.map((item) => {
    if (item.id !== notificationId) return item;
    if (item.userId !== 'all' && userId && item.userId !== userId) return item;
    return { ...item, read: true };
  });
  saveNotifications(next);
  return next.find((item) => item.id === notificationId) || null;
}

function markAllNotificationsRead(userId) {
  const notifications = loadNotifications();
  const next = notifications.map((item) => {
    if (item.userId !== 'all' && userId && item.userId !== userId) return item;
    return { ...item, read: true };
  });
  saveNotifications(next);
  return next;
}

function deleteNotification(userId, notificationId) {
  const notifications = loadNotifications();
  const next = notifications.filter((item) => {
    if (item.id !== notificationId) return true;
    if (item.userId === 'all') return true;
    if (userId && item.userId !== userId) return true;
    return false;
  });
  saveNotifications(next);
  return next;
}

function clearNotificationsForUser(userId) {
  const notifications = loadNotifications();
  const next = notifications.filter((item) => item.userId !== userId);
  saveNotifications(next);
  return next;
}

export {
  getNotificationsForUser,
  addNotificationForUser,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearNotificationsForUser,
};
