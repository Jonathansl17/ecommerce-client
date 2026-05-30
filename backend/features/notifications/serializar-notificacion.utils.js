export function serializarNotificacion(n) {
  return {
    id: n.id.toString(),
    title: n.title,
    content: n.content,
    entityType: n.entityType,
    entityId: n.entityId?.toString() ?? null,
    read: n.read,
    dismissedAt: n.dismissedAt ?? null,
    sentAt: n.sentAt,
    createdAt: n.createdAt,
  };
}
