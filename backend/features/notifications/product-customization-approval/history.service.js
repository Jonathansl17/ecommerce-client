/**
 * PLACEHOLDER — US-NOTIF-008
 *
 * El módulo de historial de pedidos no existe aún.
 * Conectar cuando esté disponible.
 *
 * Contrato esperado del caller:
 *   { orderId: BigInt, event: string (ProductCustomizationApprovalEvents), data: object }
 *
 * Eventos que se deben registrar:
 *   - ProductReadyForApproval
 *   - ProductApprovedByClient
 *   - ProductAdjustmentRequested  { adjustmentNotes: string }
 *   - ProductAutoApproved
 */
export async function registrarAprobacionEnHistorial({ orderId, event, data }) {
  // TODO(order-history): conectar con módulo de historial de pedidos cuando exista.
  void { orderId, event, data };
}
