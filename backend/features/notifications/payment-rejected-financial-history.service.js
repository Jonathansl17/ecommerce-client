/**
 * PLACEHOLDER — US-NOTIF-006
 *
 * El módulo de historial financiero del usuario no existe aún.
 * Esta función debe conectarse a ese módulo cuando sea implementado.
 *
 * Contrato esperado del caller:
 *   { order: { id: BigInt }, payment: { id: BigInt, amount: Decimal, method: PaymentMethod, updatedAt, createdAt }, clientUser: { id: BigInt } }
 *
 * Contrato esperado del módulo de destino:
 *   registrar evento de tipo 'payment_rejected' con:
 *     - clientUserId
 *     - orderId
 *     - paymentId
 *     - amount
 *     - method
 *     - status: 'rejected'
 *     - rejectedAt: payment.updatedAt ?? payment.createdAt
 */
export async function registrarEnHistorialFinanciero({ order, payment, clientUser }) {
  // TODO(financial-history): conectar con módulo de historial financiero cuando exista.
  void { order, payment, clientUser };
}
