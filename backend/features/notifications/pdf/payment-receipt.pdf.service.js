import PDFDocument from 'pdfkit';
import {
  PAYMENT_RECEIPT_PDF_FONTS as FONTS,
  PAYMENT_RECEIPT_PDF_LAYOUT as LAYOUT,
  PAYMENT_RECEIPT_PDF_STYLES as STYLES,
  PAYMENT_RECEIPT_STRINGS as STRINGS,
} from '../payment/receipt.constants.js';

const PAGE_W = 595.28; // A4 points
const COL2_X = PAGE_W / 2 + 10;

function registrarFuentes(doc) {
  doc.registerFont(FONTS.REGULAR, FONTS.REGULAR_PATH);
  doc.registerFont(FONTS.BOLD, FONTS.BOLD_PATH);
}

// ── Header: título izq + marca der ──────────────────────────────────────────

function dibujarHeader(doc, { brandName, referenceId }) {
  const innerW = PAGE_W - LAYOUT.MARGIN * 2;

  // Título doc grande izquierda
  doc
    .fillColor(STYLES.COLOR_VALUE)
    .fontSize(28)
    .font(STYLES.FONT_BOLD)
    .text('Comprobante', LAYOUT.MARGIN, LAYOUT.MARGIN, { lineBreak: false });

  // Marca derecha — alineada al borde derecho
  doc
    .fontSize(11)
    .font(STYLES.FONT_BOLD)
    .fillColor(STYLES.COLOR_VALUE)
    .text(brandName, LAYOUT.MARGIN, LAYOUT.MARGIN + 4, {
      width: innerW,
      align: 'right',
      lineBreak: false,
    });

  // Subtítulo "de pago"
  doc
    .fontSize(14)
    .font(STYLES.FONT_REGULAR)
    .fillColor(STYLES.COLOR_LABEL)
    .text('de pago', LAYOUT.MARGIN, LAYOUT.MARGIN + 34, { lineBreak: false });

  // Referencia bajo la marca
  doc
    .fontSize(9)
    .font(STYLES.FONT_REGULAR)
    .fillColor(STYLES.COLOR_LABEL)
    .text(`N° ${referenceId}`, LAYOUT.MARGIN, LAYOUT.MARGIN + 22, {
      width: innerW,
      align: 'right',
      lineBreak: false,
    });

  doc.y = LAYOUT.MARGIN + 68;

  // Línea divisora
  doc
    .moveTo(LAYOUT.MARGIN, doc.y)
    .lineTo(PAGE_W - LAYOUT.MARGIN, doc.y)
    .strokeColor(STYLES.COLOR_VALUE)
    .lineWidth(1)
    .stroke();

  doc.y += 20;
}

// ── Info grid: DE / N° DE PEDIDO / FECHA / COBRADO A ────────────────────────

function infoLabel(doc, text, x, y) {
  doc
    .fontSize(8)
    .font(STYLES.FONT_BOLD)
    .fillColor(STYLES.COLOR_LABEL)
    .text(text.toUpperCase(), x, y, { lineBreak: false });
}

function infoValue(doc, text, x, y, opts = {}) {
  doc
    .fontSize(10)
    .font(STYLES.FONT_REGULAR)
    .fillColor(STYLES.COLOR_VALUE)
    .text(text, x, y + 11, { lineBreak: false, ...opts });
}

function dibujarInfoGrid(doc, { brandName, orderId, paymentDate, clientName }) {
  const y = doc.y;
  const innerW = PAGE_W - LAYOUT.MARGIN * 2;
  const col = innerW / 3;
  const c1 = LAYOUT.MARGIN;
  const c2 = LAYOUT.MARGIN + col;
  const c3 = LAYOUT.MARGIN + col * 2;

  infoLabel(doc, 'De', c1, y);
  infoValue(doc, brandName, c1, y);

  infoLabel(doc, 'N° de pedido', c2, y);
  infoValue(doc, `#${orderId}`, c2, y);

  infoLabel(doc, 'Fecha', c3, y);
  infoValue(doc, paymentDate, c3, y);

  doc.y = y + 36;

  infoLabel(doc, 'Cobrado a', c1, doc.y);
  infoValue(doc, clientName, c1, doc.y);

  doc.y += 44;

  doc
    .moveTo(LAYOUT.MARGIN, doc.y)
    .lineTo(PAGE_W - LAYOUT.MARGIN, doc.y)
    .strokeColor(STYLES.COLOR_DIVIDER)
    .lineWidth(0.5)
    .stroke();

  doc.y += 20;
}

// ── Tabla de datos ───────────────────────────────────────────────────────────

const COL_CANT_W = 48;
const COL_PRECIO_W = 95;
const COL_IMPORTE_W = 90;

function colDescW() {
  return PAGE_W - LAYOUT.MARGIN * 2 - COL_CANT_W - COL_PRECIO_W - COL_IMPORTE_W;
}

const TABLA_ROW_H = 26;
const TABLA_HEADER_H = 22;

function dibujarLineasVerticalesTabla(doc, y, h) {
  const descW = colDescW();
  const cols = [
    LAYOUT.MARGIN + COL_CANT_W,
    LAYOUT.MARGIN + COL_CANT_W + descW,
    LAYOUT.MARGIN + COL_CANT_W + descW + COL_PRECIO_W,
  ];
  doc.strokeColor(STYLES.COLOR_VALUE).lineWidth(0.5);
  for (const x of cols) {
    doc.moveTo(x, y).lineTo(x, y + h).stroke();
  }
}

function dibujarTablaHeader(doc) {
  const y = doc.y;
  const innerW = PAGE_W - LAYOUT.MARGIN * 2;
  const descW = colDescW();
  const precioX = LAYOUT.MARGIN + COL_CANT_W + descW;
  const importeX = precioX + COL_PRECIO_W;

  doc.rect(LAYOUT.MARGIN, y, innerW, TABLA_HEADER_H).fill(STYLES.COLOR_VALUE);

  doc.fillColor('#FFFFFF').fontSize(8).font(STYLES.FONT_BOLD);
  doc.text('CANT.',        LAYOUT.MARGIN + 6,       y + 7, { width: COL_CANT_W - 6,  lineBreak: false });
  doc.text('DESCRIPCIÓN',  LAYOUT.MARGIN + COL_CANT_W + 8, y + 7, { width: descW - 16, lineBreak: false });
  doc.text('PRECIO UNIT.', precioX + 4,              y + 7, { width: COL_PRECIO_W - 8,  align: 'right', lineBreak: false });
  doc.text('IMPORTE',      importeX + 4,             y + 7, { width: COL_IMPORTE_W - 8, align: 'right', lineBreak: false });

  // Líneas verticales blancas en el header
  dibujarLineasVerticalesTabla(doc, y, TABLA_HEADER_H);
  doc.strokeColor('#FFFFFF');

  doc.y = y + TABLA_HEADER_H;
}

function dibujarFilaTabla(doc, { descripcion, cantidad, precioUnitario, importe }, isOdd) {
  const y = doc.y;
  const innerW = PAGE_W - LAYOUT.MARGIN * 2;
  const descW = colDescW();
  const precioX = LAYOUT.MARGIN + COL_CANT_W + descW;
  const importeX = precioX + COL_PRECIO_W;

  if (isOdd) {
    doc.rect(LAYOUT.MARGIN, y, innerW, TABLA_ROW_H).fill('#F9FAFB');
  }

  doc.fillColor(STYLES.COLOR_VALUE).fontSize(10).font(STYLES.FONT_REGULAR);
  doc.text(String(cantidad),  LAYOUT.MARGIN + 6,            y + 8, { width: COL_CANT_W - 6,          lineBreak: false });
  doc.text(descripcion,       LAYOUT.MARGIN + COL_CANT_W + 8, y + 8, { width: descW - 16,              lineBreak: false });
  doc.text(precioUnitario,    precioX + 4,                  y + 8, { width: COL_PRECIO_W - 8,  align: 'right', lineBreak: false });
  doc.text(importe,           importeX + 4,                 y + 8, { width: COL_IMPORTE_W - 8, align: 'right', lineBreak: false });

  // Líneas verticales negras entre columnas
  dibujarLineasVerticalesTabla(doc, y, TABLA_ROW_H);

  // Línea horizontal inferior
  doc
    .moveTo(LAYOUT.MARGIN, y + TABLA_ROW_H)
    .lineTo(LAYOUT.MARGIN + innerW, y + TABLA_ROW_H)
    .strokeColor(STYLES.COLOR_DIVIDER)
    .lineWidth(0.5)
    .stroke();

  doc.y = y + TABLA_ROW_H;
}

function dibujarFilaSubtotal(doc, { label, value, bold = false, large = false }) {
  const y = doc.y;
  const innerW = PAGE_W - LAYOUT.MARGIN * 2;
  const labelX = LAYOUT.MARGIN + innerW * 0.55;
  const labelW = innerW * 0.25;
  const valueX = labelX + labelW;
  const valueW = innerW * 0.2;

  doc
    .fillColor(bold ? STYLES.COLOR_VALUE : STYLES.COLOR_LABEL)
    .fontSize(large ? 11 : 9)
    .font(bold ? STYLES.FONT_BOLD : STYLES.FONT_REGULAR)
    .text(label, labelX, y, { width: labelW, lineBreak: false })
    .text(value, valueX, y, { width: valueW, align: 'right', lineBreak: false });

  doc.y = y + (large ? 18 : 16);
}

// ── Total box ────────────────────────────────────────────────────────────────

function dibujarTotal(doc, { label, value }) {
  const innerW = PAGE_W - LAYOUT.MARGIN * 2;
  const boxH = 36;
  const y = doc.y + 8;

  doc
    .moveTo(LAYOUT.MARGIN, y)
    .lineTo(PAGE_W - LAYOUT.MARGIN, y)
    .strokeColor(STYLES.COLOR_VALUE)
    .lineWidth(1)
    .stroke();

  doc
    .fillColor(STYLES.COLOR_VALUE)
    .fontSize(12)
    .font(STYLES.FONT_BOLD)
    .text(label.toUpperCase(), LAYOUT.MARGIN, y + 10, {
      width: innerW * 0.6,
      lineBreak: false,
    });

  doc
    .fontSize(16)
    .font(STYLES.FONT_BOLD)
    .text(value, LAYOUT.MARGIN, y + 8, {
      width: innerW,
      align: 'right',
      lineBreak: false,
    });

  doc.y = y + boxH;

  doc
    .moveTo(LAYOUT.MARGIN, doc.y)
    .lineTo(PAGE_W - LAYOUT.MARGIN, doc.y)
    .strokeColor(STYLES.COLOR_VALUE)
    .lineWidth(2)
    .stroke();

  doc.y += 28;
}

// ── Info de pago adicional ───────────────────────────────────────────────────

function dibujarInfoPago(doc, { methodLabel, reference, chargedAtLabel }) {
  const y = doc.y;

  doc
    .fontSize(9)
    .font(STYLES.FONT_BOLD)
    .fillColor(STYLES.COLOR_VALUE)
    .text('MÉTODO DE PAGO', LAYOUT.MARGIN, y);

  doc.y += 14;

  const items = [
    { label: 'Forma de pago', value: methodLabel },
    { label: 'Referencia', value: reference },
    { label: 'Fecha del cargo', value: chargedAtLabel },
  ];

  for (const { label, value } of items) {
    doc
      .fontSize(9)
      .font(STYLES.FONT_REGULAR)
      .fillColor(STYLES.COLOR_LABEL)
      .text(`${label}: `, LAYOUT.MARGIN, doc.y, { continued: true, lineBreak: false })
      .fillColor(STYLES.COLOR_VALUE)
      .text(value, { lineBreak: false });
    doc.y += 13;
  }

  doc.y += 16;
}

// ── Footer ───────────────────────────────────────────────────────────────────

function dibujarFooter(doc, { brandName, generatedAtLabel }) {
  const innerW = PAGE_W - LAYOUT.MARGIN * 2;

  doc
    .moveTo(LAYOUT.MARGIN, doc.y)
    .lineTo(PAGE_W - LAYOUT.MARGIN, doc.y)
    .strokeColor(STYLES.COLOR_DIVIDER)
    .lineWidth(0.5)
    .stroke();

  doc.y += 12;

  doc
    .fontSize(8)
    .font(STYLES.FONT_REGULAR)
    .fillColor(STYLES.COLOR_LABEL)
    .text(
      `${STRINGS.FOOTER(brandName)}  ·  ${STRINGS.GENERATED_AT(generatedAtLabel)}`,
      LAYOUT.MARGIN,
      doc.y,
      { width: innerW, align: 'center', lineBreak: false },
    );
}

// ── Export ───────────────────────────────────────────────────────────────────

export function generarComprobantePagoPDF(datos) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: LAYOUT.MARGIN, size: LAYOUT.PAGE_SIZE });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    registrarFuentes(doc);

    dibujarHeader(doc, {
      brandName: datos.brandName,
      referenceId: datos.orderData.idLabel,
    });

    dibujarInfoGrid(doc, {
      brandName: datos.brandName,
      orderId: datos.orderData.idLabel,
      paymentDate: datos.paymentData.chargedAtLabel,
      clientName: datos.clientName,
    });

    dibujarTablaHeader(doc);
    const items = datos.orderData.items ?? [];
    if (items.length === 0) {
      dibujarFilaTabla(doc, { descripcion: 'Cobro por pedido', cantidad: 1, precioUnitario: datos.paymentData.amountLabel, importe: datos.paymentData.amountLabel }, true);
    } else {
      items.forEach((item, i) => dibujarFilaTabla(doc, item, i % 2 === 0));
    }

    doc.y += 12;

    dibujarTotal(doc, {
      label: 'Total',
      value: datos.paymentData.amountLabel,
    });

    dibujarInfoPago(doc, {
      methodLabel: datos.paymentData.methodLabel,
      reference: datos.paymentData.reference,
      chargedAtLabel: datos.paymentData.chargedAtLabel,
    });

    dibujarFooter(doc, {
      brandName: datos.brandName,
      generatedAtLabel: datos.generatedAtLabel,
    });

    doc.end();
  });
}
