export function serializarOrderStatusNotification(registro) {
  return {
    id: registro.id.toString(),
    orderId: registro.orderId.toString(),
    clientUserId: registro.clientUserId.toString(),
    previousStatus: registro.previousStatus,
    newStatus: registro.newStatus,
    changedAt: registro.changedAt,
    internalNotificationId: registro.internalNotificationId?.toString() ?? null,
    deliveryStatus: registro.deliveryStatus,
    deliveryAttempts: registro.deliveryAttempts,
    deliveryLastError: registro.deliveryLastError,
    deliveredAt: registro.deliveredAt,
    createdAt: registro.createdAt,
  };
}
