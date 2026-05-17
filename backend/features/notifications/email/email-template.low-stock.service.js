import { EMAIL_CONFIG } from '../notifications.constants.js';
import { LOW_STOCK_MESSAGES } from '../low-stock/constants.js';
import { obtenerBrandingEmail } from './email-template.utils.js';
import { renderEmailLayout } from './email-template.sections.js';
import { renderLowStockAlertContent } from './email-template.low-stock.sections.js';

function validarTemplateInventarioBajoInput({ variante }) {
  if (!variante) throw new Error(LOW_STOCK_MESSAGES.VARIANT_REQUIRED);
  if (variante.id == null) throw new Error(LOW_STOCK_MESSAGES.VARIANT_ID_REQUIRED);
}

export function construirPlantillaAlertaInventarioBajo({ variante, metricas }) {
  validarTemplateInventarioBajoInput({ variante });

  const { brandName } = obtenerBrandingEmail();
  const productName = variante.product?.item?.name ?? 'Producto';

  return renderEmailLayout({
    title: LOW_STOCK_MESSAGES.EMAIL_SUBJECT(productName, EMAIL_CONFIG.BRAND_NAME),
    previewText: LOW_STOCK_MESSAGES.EMAIL_PREVIEW(
      productName,
      variante.currentStock - variante.reservedStock,
    ),
    bodyContent: renderLowStockAlertContent({ variante, metricas, brandName }),
  });
}
