import { LOW_STOCK_ALERT, LOW_STOCK_LOG_PREFIXES } from './constants.js';
import { monitorearInventarioBajo } from './monitor.service.js';

export function iniciarMonitorInventarioBajo() {
  setInterval(async () => {
    try {
      await monitorearInventarioBajo();
    } catch (error) {
      console.error(LOW_STOCK_LOG_PREFIXES.SCHEDULER_ERROR, {
        errorMessage: error?.message,
      });
    }
  }, LOW_STOCK_ALERT.SCHEDULER_INTERVAL_MS);
}
