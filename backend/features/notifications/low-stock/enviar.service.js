import { EMAIL_RETRY, NOTIFICATION_MESSAGES } from '../notifications.constants.js';
import { enviarCorreoAlertaInventarioBajo } from '../email/email.service.js';
import { registrarAlertaInventarioBajo } from './crear-alerta.service.js';
import { calcularMetricasStock } from './calcular-metricas.service.js';
import {
  LOW_STOCK_LOG_PREFIXES,
  LOW_STOCK_MESSAGES,
} from './constants.js';

function obtenerEmailAdmin() {
  const email = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;

  if (!email) {
    throw new Error(LOW_STOCK_MESSAGES.ADMIN_EMAIL_MISSING);
  }

  return email;
}

function validarVariante(variante) {
  if (!variante) throw new Error(LOW_STOCK_MESSAGES.VARIANT_REQUIRED);
  if (variante.id == null) throw new Error(LOW_STOCK_MESSAGES.VARIANT_ID_REQUIRED);
}

async function intentarEnvioConReintentos(variante, metricas) {
  const adminEmail = obtenerEmailAdmin();
  let intentos = 0;

  while (intentos < EMAIL_RETRY.MAX_ATTEMPTS) {
    try {
      await enviarCorreoAlertaInventarioBajo({ variante, metricas, adminEmail });
      return true;
    } catch (error) {
      intentos += 1;

      console.warn(
        LOW_STOCK_LOG_PREFIXES.EMAIL_RETRY_ATTEMPT(intentos, EMAIL_RETRY.MAX_ATTEMPTS, variante.id),
        { errorMessage: error?.message },
      );

      if (intentos < EMAIL_RETRY.MAX_ATTEMPTS) {
        await new Promise((resolve) =>
          setTimeout(resolve, EMAIL_RETRY.RETRY_BASE_DELAY_MS * Math.pow(2, intentos - 1)),
        );
      }
    }
  }

  return false;
}

export async function enviarAlertaInventarioBajo(variante) {
  validarVariante(variante);

  const stockDisponible = variante.currentStock - variante.reservedStock;
  const metricas = await calcularMetricasStock(variante.id, stockDisponible);

  const enviado = await intentarEnvioConReintentos(variante, metricas);

  if (!enviado) {
    console.error(LOW_STOCK_LOG_PREFIXES.EMAIL_FAILURE, {
      variantId: variante.id.toString(),
      errorMessage: NOTIFICATION_MESSAGES.EMAIL_RETRY_EXHAUSTED,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  await registrarAlertaInventarioBajo(variante.id, stockDisponible);
}
