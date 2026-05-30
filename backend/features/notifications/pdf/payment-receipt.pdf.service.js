import PDFDocument from 'pdfkit';
import { PAYMENT_RECEIPT_PDF_LAYOUT as LAYOUT } from '../payment/receipt.constants.js';
import {
  registrarFuentes,
  dibujarHeader,
  dibujarInfoGrid,
  dibujarTablaHeader,
  dibujarFilaTabla,
  dibujarTotal,
  dibujarInfoPago,
  dibujarFooter,
} from './payment-receipt.pdf.sections.js';

export function generarComprobantePagoPDF(datos) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: LAYOUT.MARGIN, size: LAYOUT.PAGE_SIZE });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end',  () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    registrarFuentes(doc);

    dibujarHeader(doc, { brandName: datos.brandName, referenceId: datos.orderData.idLabel });

    dibujarInfoGrid(doc, {
      brandName:   datos.brandName,
      orderId:     datos.orderData.idLabel,
      paymentDate: datos.paymentData.chargedAtLabel,
      clientName:  datos.clientName,
    });

    dibujarTablaHeader(doc);

    const items = datos.orderData.items ?? [];
    if (items.length === 0) {
      dibujarFilaTabla(doc, {
        descripcion:    'Cobro por pedido',
        cantidad:       1,
        precioUnitario: datos.paymentData.amountLabel,
        importe:        datos.paymentData.amountLabel,
      }, true);
    } else {
      items.forEach((item, i) => dibujarFilaTabla(doc, item, i % 2 === 0));
    }

    dibujarTotal(doc,    { label: 'Total', value: datos.paymentData.amountLabel });
    dibujarInfoPago(doc, { methodLabel: datos.paymentData.methodLabel, reference: datos.paymentData.reference, chargedAtLabel: datos.paymentData.chargedAtLabel });
    dibujarFooter(doc,   { brandName: datos.brandName, generatedAtLabel: datos.generatedAtLabel });

    doc.end();
  });
}
