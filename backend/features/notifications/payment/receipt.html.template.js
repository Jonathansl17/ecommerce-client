import { escaparHtml } from '../email/email-template.utils.js';

export function generarComprobanteHTML({
  brandName,
  clientName,
  paymentData,
  orderData,
  generatedAtLabel,
}) {
  const { amountLabel, methodLabel, reference, chargedAtLabel } = paymentData;
  const { idLabel, createdAtLabel, totalLabel } = orderData;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Comprobante de Pago — Pedido #${escaparHtml(idLabel)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f3f4f6;
      color: #111827;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      padding: 40px 16px;
    }

    .page {
      background: #fff;
      width: 100%;
      max-width: 680px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06);
    }

    /* Header */
    .header {
      background: #111827;
      color: #fff;
      padding: 32px 40px;
      text-align: center;
    }
    .header-brand {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.3px;
    }
    .header-title {
      font-size: 15px;
      font-weight: 600;
      margin-top: 4px;
    }
    .header-subtitle {
      font-size: 13px;
      color: #9ca3af;
      margin-top: 4px;
    }

    /* Body */
    .body { padding: 32px 40px; }

    /* Cliente row */
    .client-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 28px;
    }
    .client-label {
      font-size: 11px;
      color: #6b7280;
      margin-bottom: 4px;
    }
    .client-name {
      font-size: 16px;
      font-weight: 700;
    }

    /* Badge */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #d1fae5;
      color: #065f46;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.04em;
      padding: 5px 12px;
      border-radius: 4px;
      white-space: nowrap;
      margin-top: 4px;
    }
    .badge::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #059669;
      flex-shrink: 0;
    }

    /* Divider */
    .divider {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 0 0 28px 0;
    }

    /* Section */
    .section { margin-bottom: 28px; }
    .section-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #374151;
      text-transform: uppercase;
      padding-bottom: 8px;
      border-bottom: 2px solid #4f46e5;
      display: inline-block;
      margin-bottom: 20px;
    }

    /* Fields */
    .field { margin-bottom: 16px; }
    .field:last-child { margin-bottom: 0; }
    .field-label {
      font-size: 11px;
      color: #6b7280;
      margin-bottom: 3px;
    }
    .field-value {
      font-size: 14px;
      color: #111827;
    }
    .field-value.amount {
      font-size: 22px;
      font-weight: 700;
      color: #111827;
    }

    /* Footer */
    .footer {
      border-top: 1px solid #e5e7eb;
      padding: 20px 40px;
      text-align: center;
      font-size: 11px;
      color: #9ca3af;
      line-height: 1.6;
    }

    @media print {
      body { background: none; padding: 0; }
      .page { box-shadow: none; border-radius: 0; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="header-brand">${escaparHtml(brandName)}</div>
      <div class="header-title">Comprobante de Pago</div>
      <div class="header-subtitle">Pedido #${escaparHtml(idLabel)}</div>
    </div>

    <div class="body">
      <div class="client-row">
        <div>
          <div class="client-label">Cliente</div>
          <div class="client-name">${escaparHtml(clientName)}</div>
        </div>
        <span class="badge">PAGO APROBADO</span>
      </div>

      <hr class="divider" />

      <div class="section">
        <div class="section-title">Datos del Pago</div>

        <div class="field">
          <div class="field-label">Monto cobrado</div>
          <div class="field-value amount">${escaparHtml(amountLabel)}</div>
        </div>
        <div class="field">
          <div class="field-label">Método de pago</div>
          <div class="field-value">${escaparHtml(methodLabel)}</div>
        </div>
        <div class="field">
          <div class="field-label">Número de referencia</div>
          <div class="field-value">${escaparHtml(reference)}</div>
        </div>
        <div class="field">
          <div class="field-label">Fecha del cargo</div>
          <div class="field-value">${escaparHtml(chargedAtLabel)}</div>
        </div>
      </div>

      <hr class="divider" />

      <div class="section">
        <div class="section-title">Datos del Pedido</div>

        <div class="field">
          <div class="field-label">Número de pedido</div>
          <div class="field-value">#${escaparHtml(idLabel)}</div>
        </div>
        <div class="field">
          <div class="field-label">Fecha del pedido</div>
          <div class="field-value">${escaparHtml(createdAtLabel)}</div>
        </div>
        <div class="field">
          <div class="field-label">Total del pedido</div>
          <div class="field-value">${escaparHtml(totalLabel)}</div>
        </div>
      </div>
    </div>

    <div class="footer">
      Este documento fue generado automáticamente por ${escaparHtml(brandName)}.<br />
      Generado el: ${escaparHtml(generatedAtLabel)}
    </div>
  </div>
</body>
</html>`;
}
