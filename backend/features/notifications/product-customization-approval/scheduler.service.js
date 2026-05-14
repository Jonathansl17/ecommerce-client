/**
 * PLACEHOLDER — US-NOTIF-008
 *
 * Requiere infraestructura de scheduler (node-cron, bull, pg-boss, o setInterval).
 *
 * Integración sugerida en server.js:
 *   import { iniciarSchedulerAprobaciones } from './features/notifications/product-customization-approval-scheduler.service.js';
 *   iniciarSchedulerAprobaciones();
 *
 * Intervalo sugerido: cada 15 minutos (PRODUCT_CUSTOMIZATION_APPROVAL_SCHEDULER.CHECK_INTERVAL_MS)
 */
import {
  PRODUCT_CUSTOMIZATION_APPROVAL_LOG_PREFIXES,
  PRODUCT_CUSTOMIZATION_APPROVAL_SCHEDULER,
} from './constants.js';
import { obtenerAprobacionesPendientesVencidas } from './obtener/vencidas.service.js';
import { marcarComoAutoAprobado } from './marcar/auto-aprobado.service.js';
import { triggerAutoAprobado } from './triggers/auto.service.js';

export async function procesarAutoAprobacionesVencidas() {
  const vencidas = await obtenerAprobacionesPendientesVencidas();

  for (const aprobacion of vencidas) {
    try {
      await marcarComoAutoAprobado({ approvalId: aprobacion.id });
      console.log(
        PRODUCT_CUSTOMIZATION_APPROVAL_LOG_PREFIXES.SCHEDULER_AUTO_APPROVED(aprobacion.orderId),
      );
      triggerAutoAprobado({ orderId: aprobacion.orderId, clientUserId: aprobacion.clientUserId });
    } catch (error) {
      console.error(PRODUCT_CUSTOMIZATION_APPROVAL_LOG_PREFIXES.SCHEDULER_ERROR, {
        approvalId: aprobacion.id.toString(),
        errorMessage: error?.message,
      });
    }
  }
}

export function iniciarSchedulerAprobaciones() {
  // TODO(scheduler): reemplazar setInterval por node-cron o bull cuando exista la infraestructura.
  setInterval(async () => {
    try {
      await procesarAutoAprobacionesVencidas();
    } catch (error) {
      console.error(PRODUCT_CUSTOMIZATION_APPROVAL_LOG_PREFIXES.SCHEDULER_ERROR, {
        errorMessage: error?.message,
      });
    }
  }, PRODUCT_CUSTOMIZATION_APPROVAL_SCHEDULER.CHECK_INTERVAL_MS);
}
