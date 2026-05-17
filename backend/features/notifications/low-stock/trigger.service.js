import {
  LOW_STOCK_ALERT,
  LOW_STOCK_LOG_PREFIXES,
  LOW_STOCK_MESSAGES,
} from './constants.js';
import { enviarAlertaInventarioBajo } from './enviar.service.js';

export function triggerAlertaInventarioBajo(variante) {
  void Promise.race([
    enviarAlertaInventarioBajo(variante),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(LOW_STOCK_MESSAGES.TIMEOUT_ERROR)),
        LOW_STOCK_ALERT.TRIGGER_DEADLINE_MS,
      ),
    ),
  ]).catch((error) => {
    console.error(LOW_STOCK_LOG_PREFIXES.TRIGGER_ERROR, {
      variantId: variante?.id?.toString(),
      errorMessage: error?.message,
    });
  });
}
