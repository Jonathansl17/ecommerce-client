import {
  PAYMENT_RECEIPT_PDF_FONTS as FONTS,
  PAYMENT_RECEIPT_PDF_LAYOUT as LAYOUT,
  PAYMENT_RECEIPT_PDF_STYLES as STYLES,
  PAYMENT_RECEIPT_STRINGS as STRINGS,
} from '../payment/receipt.constants.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function colDescW(pageW) {
  return pageW - LAYOUT.MARGIN * 2 - LAYOUT.TABLE_COL_CANT_W - LAYOUT.TABLE_COL_PRECIO_W - LAYOUT.TABLE_COL_IMPORTE_W;
}

function lineaH(doc, y, color = STYLES.COLOR_VALUE, width = 1) {
  const pageW = doc.page.width;
  doc.moveTo(LAYOUT.MARGIN, y).lineTo(pageW - LAYOUT.MARGIN, y)
    .strokeColor(color).lineWidth(width).stroke();
}

function infoLabel(doc, text, x, y) {
  doc.fontSize(8).font(STYLES.FONT_BOLD).fillColor(STYLES.COLOR_LABEL)
    .text(text.toUpperCase(), x, y, { lineBreak: false });
}

function infoValue(doc, text, x, y) {
  doc.fontSize(10).font(STYLES.FONT_REGULAR).fillColor(STYLES.COLOR_VALUE)
    .text(text, x, y + 11, { lineBreak: false });
}

function lineasVerticalesTabla(doc, y, h, color) {
  const pageW = doc.page.width;
  const descW = colDescW(pageW);
  const xs = [
    LAYOUT.MARGIN + LAYOUT.TABLE_COL_CANT_W,
    LAYOUT.MARGIN + LAYOUT.TABLE_COL_CANT_W + descW,
    LAYOUT.MARGIN + LAYOUT.TABLE_COL_CANT_W + descW + LAYOUT.TABLE_COL_PRECIO_W,
  ];
  doc.strokeColor(color).lineWidth(0.5);
  for (const x of xs) doc.moveTo(x, y).lineTo(x, y + h).stroke();
}

// ── Secciones exportadas ─────────────────────────────────────────────────────

export function registrarFuentes(doc) {
  doc.registerFont(FONTS.REGULAR, FONTS.REGULAR_PATH);
  doc.registerFont(FONTS.BOLD, FONTS.BOLD_PATH);
}

export function dibujarHeader(doc, { brandName, referenceId }) {
  const pageW = doc.page.width;
  const innerW = pageW - LAYOUT.MARGIN * 2;

  doc.fillColor(STYLES.COLOR_VALUE).fontSize(28).font(STYLES.FONT_BOLD)
    .text('Comprobante', LAYOUT.MARGIN, LAYOUT.MARGIN, { lineBreak: false });

  doc.fontSize(11).font(STYLES.FONT_BOLD).fillColor(STYLES.COLOR_VALUE)
    .text(brandName, LAYOUT.MARGIN, LAYOUT.MARGIN + 4, { width: innerW, align: 'right', lineBreak: false });

  doc.fontSize(14).font(STYLES.FONT_REGULAR).fillColor(STYLES.COLOR_LABEL)
    .text('de pago', LAYOUT.MARGIN, LAYOUT.MARGIN + 34, { lineBreak: false });

  doc.fontSize(9).font(STYLES.FONT_REGULAR).fillColor(STYLES.COLOR_LABEL)
    .text(`N° ${referenceId}`, LAYOUT.MARGIN, LAYOUT.MARGIN + 22, { width: innerW, align: 'right', lineBreak: false });

  doc.y = LAYOUT.MARGIN + 68;
  lineaH(doc, doc.y, STYLES.COLOR_VALUE, 1);
  doc.y += LAYOUT.SECTION_GAP;
}

export function dibujarInfoGrid(doc, { brandName, orderId, paymentDate, clientName }) {
  const pageW = doc.page.width;
  const col = (pageW - LAYOUT.MARGIN * 2) / 3;
  const [c1, c2, c3] = [LAYOUT.MARGIN, LAYOUT.MARGIN + col, LAYOUT.MARGIN + col * 2];
  const y = doc.y;

  infoLabel(doc, 'De',           c1, y); infoValue(doc, brandName,     c1, y);
  infoLabel(doc, 'N° de pedido', c2, y); infoValue(doc, `#${orderId}`,  c2, y);
  infoLabel(doc, 'Fecha',        c3, y); infoValue(doc, paymentDate,    c3, y);

  doc.y = y + LAYOUT.INFO_ROW_H;
  infoLabel(doc, 'Cobrado a', c1, doc.y);
  infoValue(doc,  clientName, c1, doc.y);
  doc.y += LAYOUT.INFO_CLIENT_H;

  lineaH(doc, doc.y, STYLES.COLOR_DIVIDER, 0.5);
  doc.y += LAYOUT.SECTION_GAP;
}

export function dibujarTablaHeader(doc) {
  const pageW = doc.page.width;
  const innerW = pageW - LAYOUT.MARGIN * 2;
  const descW = colDescW(pageW);
  const precioX  = LAYOUT.MARGIN + LAYOUT.TABLE_COL_CANT_W + descW;
  const importeX = precioX + LAYOUT.TABLE_COL_PRECIO_W;
  const y = doc.y;

  doc.rect(LAYOUT.MARGIN, y, innerW, LAYOUT.TABLE_HEADER_H).fill(STYLES.COLOR_VALUE);
  doc.fillColor(STYLES.COLOR_WHITE).fontSize(8).font(STYLES.FONT_BOLD);
  doc.text('CANT.',        LAYOUT.MARGIN + 6,                    y + 7, { width: LAYOUT.TABLE_COL_CANT_W - 6,    lineBreak: false });
  doc.text('DESCRIPCIÓN',  LAYOUT.MARGIN + LAYOUT.TABLE_COL_CANT_W + 8, y + 7, { width: descW - 16,              lineBreak: false });
  doc.text('PRECIO UNIT.', precioX + 4,                          y + 7, { width: LAYOUT.TABLE_COL_PRECIO_W - 8,  align: 'right', lineBreak: false });
  doc.text('IMPORTE',      importeX + 4,                         y + 7, { width: LAYOUT.TABLE_COL_IMPORTE_W - 8, align: 'right', lineBreak: false });

  lineasVerticalesTabla(doc, y, LAYOUT.TABLE_HEADER_H, STYLES.COLOR_WHITE);
  doc.y = y + LAYOUT.TABLE_HEADER_H;
}

export function dibujarFilaTabla(doc, { descripcion, cantidad, precioUnitario, importe }, isOdd) {
  const pageW = doc.page.width;
  const innerW = pageW - LAYOUT.MARGIN * 2;
  const descW = colDescW(pageW);
  const precioX  = LAYOUT.MARGIN + LAYOUT.TABLE_COL_CANT_W + descW;
  const importeX = precioX + LAYOUT.TABLE_COL_PRECIO_W;
  const y = doc.y;

  if (isOdd) doc.rect(LAYOUT.MARGIN, y, innerW, LAYOUT.TABLE_ROW_H).fill(STYLES.COLOR_ROW_ALT);

  doc.fillColor(STYLES.COLOR_VALUE).fontSize(10).font(STYLES.FONT_REGULAR);
  doc.text(String(cantidad), LAYOUT.MARGIN + 6,                    y + 8, { width: LAYOUT.TABLE_COL_CANT_W - 6,          lineBreak: false });
  doc.text(descripcion,      LAYOUT.MARGIN + LAYOUT.TABLE_COL_CANT_W + 8, y + 8, { width: descW - 16,               lineBreak: false });
  doc.text(precioUnitario,   precioX + 4,                          y + 8, { width: LAYOUT.TABLE_COL_PRECIO_W - 8,  align: 'right', lineBreak: false });
  doc.text(importe,          importeX + 4,                         y + 8, { width: LAYOUT.TABLE_COL_IMPORTE_W - 8, align: 'right', lineBreak: false });

  lineasVerticalesTabla(doc, y, LAYOUT.TABLE_ROW_H, STYLES.COLOR_VALUE);
  lineaH(doc, y + LAYOUT.TABLE_ROW_H, STYLES.COLOR_DIVIDER, 0.5);
  doc.y = y + LAYOUT.TABLE_ROW_H;
}

export function dibujarTotal(doc, { label, value }) {
  const pageW = doc.page.width;
  const innerW = pageW - LAYOUT.MARGIN * 2;
  const y = doc.y + LAYOUT.TABLE_BOTTOM_GAP;

  lineaH(doc, y, STYLES.COLOR_VALUE, 1);

  doc.fillColor(STYLES.COLOR_VALUE).fontSize(12).font(STYLES.FONT_BOLD)
    .text(label.toUpperCase(), LAYOUT.MARGIN, y + 10, { width: innerW * 0.6, lineBreak: false });
  doc.fontSize(16).font(STYLES.FONT_BOLD)
    .text(value, LAYOUT.MARGIN, y + 8, { width: innerW, align: 'right', lineBreak: false });

  doc.y = y + LAYOUT.TOTAL_BOX_H;
  lineaH(doc, doc.y, STYLES.COLOR_VALUE, 2);
  doc.y += LAYOUT.TOTAL_BOTTOM_GAP;
}

export function dibujarInfoPago(doc, { methodLabel, reference, chargedAtLabel }) {
  doc.fontSize(9).font(STYLES.FONT_BOLD).fillColor(STYLES.COLOR_VALUE)
    .text('MÉTODO DE PAGO', LAYOUT.MARGIN, doc.y);
  doc.y += LAYOUT.PAYMENT_TITLE_GAP;

  for (const { label, value } of [
    { label: 'Forma de pago',  value: methodLabel },
    { label: 'Referencia',     value: reference },
    { label: 'Fecha del cargo', value: chargedAtLabel },
  ]) {
    doc.fontSize(9).font(STYLES.FONT_REGULAR).fillColor(STYLES.COLOR_LABEL)
      .text(`${label}: `, LAYOUT.MARGIN, doc.y, { continued: true, lineBreak: false })
      .fillColor(STYLES.COLOR_VALUE).text(value, { lineBreak: false });
    doc.y += LAYOUT.PAYMENT_LINE_H;
  }

  doc.y += LAYOUT.PAYMENT_SECTION_GAP;
}

export function dibujarFooter(doc, { brandName, generatedAtLabel }) {
  const pageW = doc.page.width;
  lineaH(doc, doc.y, STYLES.COLOR_DIVIDER, 0.5);
  doc.y += 12;
  doc.fontSize(8).font(STYLES.FONT_REGULAR).fillColor(STYLES.COLOR_LABEL)
    .text(
      `${STRINGS.FOOTER(brandName)}  ·  ${STRINGS.GENERATED_AT(generatedAtLabel)}`,
      LAYOUT.MARGIN, doc.y,
      { width: pageW - LAYOUT.MARGIN * 2, align: 'center', lineBreak: false },
    );
}
