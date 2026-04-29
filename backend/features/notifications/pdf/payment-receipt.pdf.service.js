import PDFDocument from 'pdfkit';
import {
  PAYMENT_RECEIPT_PDF_LAYOUT as LAYOUT,
  PAYMENT_RECEIPT_PDF_STYLES as STYLES,
  PAYMENT_RECEIPT_STRINGS as STRINGS,
} from '../notifications.constants.js';

function dibujarDivider(doc) {
  const x = LAYOUT.MARGIN;
  const width = doc.page.width - LAYOUT.MARGIN * 2;
  const y = doc.y + LAYOUT.DIVIDER_MARGIN_V;

  doc
    .moveTo(x, y)
    .lineTo(x + width, y)
    .strokeColor(STYLES.COLOR_DIVIDER)
    .stroke();

  doc.y = y + LAYOUT.DIVIDER_MARGIN_V;
}

function dibujarEncabezado(doc, { brandName, orderId }) {
  const pageWidth = doc.page.width;
  const textWidth = pageWidth - LAYOUT.MARGIN * 2;

  doc.rect(0, 0, pageWidth, LAYOUT.HEADER_HEIGHT).fill(STYLES.COLOR_HEADER_BG);

  doc
    .fillColor(STYLES.COLOR_HEADER_TEXT)
    .fontSize(STYLES.FONT_SIZE_BRAND)
    .font(STYLES.FONT_BOLD)
    .text(brandName, LAYOUT.MARGIN, LAYOUT.HEADER_PADDING_TOP, {
      width: textWidth,
      align: 'center',
    });

  doc
    .fontSize(STYLES.FONT_SIZE_TITLE)
    .font(STYLES.FONT_BOLD)
    .text(STRINGS.TITLE, { width: textWidth, align: 'center' });

  doc
    .fontSize(STYLES.FONT_SIZE_SUBTITLE)
    .font(STYLES.FONT_REGULAR)
    .text(STRINGS.SUBTITLE(orderId), { width: textWidth, align: 'center' });

  doc.moveDown(1.5);
}

function dibujarCliente(doc, { clientName }) {
  doc
    .fillColor(STYLES.COLOR_LABEL)
    .fontSize(STYLES.FONT_SIZE_LABEL)
    .font(STYLES.FONT_REGULAR)
    .text(STRINGS.LABEL_CLIENT);

  doc
    .fillColor(STYLES.COLOR_VALUE)
    .fontSize(STYLES.FONT_SIZE_VALUE)
    .font(STYLES.FONT_BOLD)
    .text(clientName);

  doc.moveDown(0.5);
}

function dibujarSeccion(doc, titulo) {
  doc.moveDown(0.5);
  doc
    .fillColor(STYLES.COLOR_SECTION)
    .fontSize(STYLES.FONT_SIZE_SECTION)
    .font(STYLES.FONT_BOLD)
    .text(titulo.toUpperCase());

  doc
    .moveTo(LAYOUT.MARGIN, doc.y + 4)
    .lineTo(LAYOUT.MARGIN + 160, doc.y + 4)
    .strokeColor(STYLES.COLOR_SECTION)
    .stroke();

  doc.y += 12;
}

function dibujarCampo(doc, { label, value }) {
  doc
    .fillColor(STYLES.COLOR_LABEL)
    .fontSize(STYLES.FONT_SIZE_LABEL)
    .font(STYLES.FONT_REGULAR)
    .text(label);

  doc
    .fillColor(STYLES.COLOR_VALUE)
    .fontSize(STYLES.FONT_SIZE_VALUE)
    .font(STYLES.FONT_REGULAR)
    .text(value);

  doc.moveDown(0.4);
}

function dibujarPie(doc, { brandName, generatedAtLabel }) {
  dibujarDivider(doc);

  doc
    .fillColor(STYLES.COLOR_LABEL)
    .fontSize(STYLES.FONT_SIZE_FOOTER)
    .font(STYLES.FONT_REGULAR)
    .text(STRINGS.FOOTER(brandName), { align: 'center' })
    .text(STRINGS.GENERATED_AT(generatedAtLabel), { align: 'center' });
}

export function generarComprobantePagoPDF(datos) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: LAYOUT.MARGIN, size: LAYOUT.PAGE_SIZE });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    dibujarEncabezado(doc, { brandName: datos.brandName, orderId: datos.orderData.idLabel });
    dibujarCliente(doc, { clientName: datos.clientName });
    dibujarDivider(doc);

    dibujarSeccion(doc, STRINGS.SECTION_PAYMENT);
    dibujarCampo(doc, { label: STRINGS.LABEL_AMOUNT, value: datos.paymentData.amountLabel });
    dibujarCampo(doc, { label: STRINGS.LABEL_METHOD, value: datos.paymentData.methodLabel });
    dibujarCampo(doc, { label: STRINGS.LABEL_REFERENCE, value: datos.paymentData.reference });
    dibujarCampo(doc, { label: STRINGS.LABEL_DATE, value: datos.paymentData.chargedAtLabel });

    dibujarDivider(doc);

    dibujarSeccion(doc, STRINGS.SECTION_ORDER);
    dibujarCampo(doc, { label: STRINGS.LABEL_ORDER_ID, value: `#${datos.orderData.idLabel}` });
    dibujarCampo(doc, { label: STRINGS.LABEL_ORDER_DATE, value: datos.orderData.createdAtLabel });
    dibujarCampo(doc, { label: STRINGS.LABEL_TOTAL, value: datos.orderData.totalLabel });

    dibujarPie(doc, {
      brandName: datos.brandName,
      generatedAtLabel: datos.generatedAtLabel,
    });

    doc.end();
  });
}
