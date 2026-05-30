import { Check, XCircle } from 'lucide-react';
import { ORDER_STATUS_PROGRESS, getProgressIndex } from '../../utils/order-status-style.utils';
import { ORDER_STATUS_NOTIFICATION_STATUS_LABELS } from '../../constants/order-status-notification.constants';
import type { OrderStatusNotificationStatus } from '../../types/order-status-notification.types';

const STATUS_DESCRIPTIONS: Record<OrderStatusNotificationStatus, string> = {
  pending_payment:           'Esperando confirmación del pago.',
  confirmed:                 'Pago recibido. El pedido está confirmado.',
  in_preparation:            'El equipo está preparando tu pedido.',
  customization_in_progress: 'Se está personalizando tu producto.',
  ready_shipment:            'Tu pedido está listo para ser enviado.',
  shipped:                   'El paquete salió de nuestras instalaciones.',
  in_transit:                'El paquete está en camino hacia ti.',
  delivered:                 'Pedido entregado exitosamente.',
  cancelled:                 'Este pedido fue cancelado.',
};

interface OrderStatusStepperProps {
  status: OrderStatusNotificationStatus;
}

export function OrderStatusStepper({ status }: OrderStatusStepperProps) {
  if (status === 'cancelled') {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2.5">
          <XCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold text-foreground">Pedido cancelado</p>
            <p className="text-xs text-muted-foreground">{STATUS_DESCRIPTIONS.cancelled}</p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = getProgressIndex(status);
  const total = ORDER_STATUS_PROGRESS.length;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Summary header */}
      <div className="flex items-start justify-between gap-4 px-4 py-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Estado del pedido
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {ORDER_STATUS_NOTIFICATION_STATUS_LABELS[status]}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {STATUS_DESCRIPTIONS[status]}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          Paso {currentIndex + 1} de {total}
        </span>
      </div>

      {/* Circles row */}
      <div className="border-t border-border px-4 pb-3 pt-2.5">
        <div className="flex items-start justify-between overflow-x-auto">
          {ORDER_STATUS_PROGRESS.map((step, i) => {
            const done    = i < currentIndex;
            const active  = i === currentIndex;

            return (
              <div key={step} className="flex flex-1 flex-col items-center gap-1 min-w-[40px]">
                {/* Connector + circle */}
                <div className="flex w-full items-center">
                  <div className={`h-0.5 flex-1 ${i === 0 ? 'invisible' : done || active ? 'bg-foreground' : 'bg-muted-foreground/20'}`} />
                  <div className={`z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                    done   ? 'bg-foreground text-background' :
                    active ? 'bg-foreground text-background ring-4 ring-foreground/10' :
                             'bg-muted text-muted-foreground'
                  }`}>
                    {done ? <Check className="h-2.5 w-2.5" /> : i + 1}
                  </div>
                  <div className={`h-0.5 flex-1 ${i === total - 1 ? 'invisible' : done ? 'bg-foreground' : 'bg-muted-foreground/20'}`} />
                </div>
                {/* Short label only on active */}
                {active && (
                  <p className="text-center text-[9px] font-semibold leading-tight text-foreground max-w-[52px]">
                    {ORDER_STATUS_NOTIFICATION_STATUS_LABELS[step]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
