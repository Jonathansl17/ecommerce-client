// ──────────────────────────────────────────────────────────────────────────────
// Database seed — populates every table with realistic data for local development.
//
// Test credentials seeded by this script:
//   email:    cliente@gmail.com
//   password: Cliente12345
// ──────────────────────────────────────────────────────────────────────────────

import 'dotenv/config';
import bcrypt from 'bcrypt';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const TEST_USER = {
  email: 'cliente@gmail.com',
  password: 'Cliente12345',
  fullName: 'Usuario de Prueba',
};

const SALT_ROUNDS = 10;
const TAX_RATE = 0.13;
const RECORDS_PER_TABLE = 20;
const UNSPLASH_PHOTO_IDS = [
  '1548036328-c9fa89d128fa',
  '1584917865442-de89df76afd3',
  '1547949003-9792a18a2601',
  '1591561954557-26941169b49e',
  '1590874103328-eac38a683ce7',
  '1553062407-98eeb64c6a62',
  '1601924994987-69e26d50dc26',
  '1559563458-527698bf5295',
  '1566150905458-1bf1fc113f0d',
  '1622560480605-d83c853bc5c3',
  '1553545204-4f7d339aa06a',
  '1606522754091-a3bbf9ad4cb3',
  '1551488831-00ddcb6c6bd3',
  '1605733513597-a8f8341084e6',
  '1589782182703-2aaa69037b5b',
  '1597393353415-b3730f3719fe',
  '1605733160314-4fc7dac4bb16',
  '1595950653106-6c9ebd614d3a',
  '1620625515032-6ed0c1790c75',
  '1594223274512-ad4803739b7c',
];
const UNSPLASH_IMAGE_PARAMS = 'w=600&h=600&fit=crop&auto=format';
const productImageForIndex = (i) =>
  `https://images.unsplash.com/photo-${UNSPLASH_PHOTO_IDS[i % UNSPLASH_PHOTO_IDS.length]}?${UNSPLASH_IMAGE_PARAMS}`;

const CATEGORIES = [
  'Bolsos artesanales', 'Carteras de cuero', 'Mochilas', 'Riñoneras',
  'Bolsos de noche', 'Bandoleras', 'Tote bags', 'Bolsos de viaje',
  'Bolsos de mano', 'Bolsos de fiesta', 'Bolsos tejidos', 'Bolsos infantiles',
  'Bolsos deportivos', 'Bolsos minimalistas', 'Bolsos vintage',
  'Bolsos eco', 'Carteras de tela', 'Maletines', 'Bolsos clutch',
  'Bolsos de lona',
];

const PRODUCT_NAMES = [
  'Bolso artesanal de cuero café', 'Cartera elegante negra',
  'Mochila vintage marrón', 'Riñonera urbana azul',
  'Bolso de noche dorado', 'Bandolera de cuero camel',
  'Tote bag minimalista beige', 'Bolso de viaje verde oliva',
  'Cartera de mano gris perla', 'Bolso de fiesta plateado',
  'Bolso tejido natural', 'Mochila infantil rosa',
  'Bolso deportivo negro', 'Bolso minimalista blanco',
  'Bolso vintage rojo', 'Bolso eco de yute',
  'Cartera de tela floreada', 'Maletín de cuero negro',
  'Clutch metalizado', 'Bolso de lona crudo',
];

const COLORS = ['Café', 'Negro', 'Beige', 'Rojo', 'Azul', 'Verde', 'Blanco', 'Gris', 'Camel', 'Dorado'];
const SIZES = ['Pequeño', 'Mediano', 'Grande', 'Único'];
const PAYMENT_METHODS = ['SINPE', 'cash', 'card', 'other'];
const ORDER_STATUSES = [
  'pending_payment', 'confirmed', 'in_preparation', 'customization_in_progress',
  'ready_shipment', 'shipped', 'in_transit', 'delivered', 'cancelled',
];
const PAYMENT_STATUSES = ['pending', 'approved', 'rejected'];
const REVIEW_STATUSES = ['pending', 'approved', 'rejected'];
const VOTE_TYPES = ['helpful', 'unhelpful'];
const NOTIFICATION_TYPES = ['internal', 'email', 'both'];
const CUSTOMIZATION_STATUSES = ['pending', 'approved', 'adjustments_requested', 'auto_approved'];
const DELIVERY_STATUSES = ['pending', 'sent', 'failed'];

const REVIEW_COMMENTS = [
  'Excelente calidad, superó mis expectativas.',
  'El acabado es muy fino y elegante.',
  'Espacioso y cómodo, lo uso a diario.',
  'Llegó rápido y bien empacado.',
  'El cuero es suave y resistente.',
  'Diseño hermoso y original.',
  'Calidad-precio inmejorable.',
  'Combina con todo, me encanta.',
  'Las costuras son perfectas.',
  'Muy recomendado para regalo.',
  'Es un poco más pequeño de lo que esperaba pero hermoso.',
  'Buen producto pero la entrega tardó un poco.',
  'El color es más oscuro de lo que aparece en la foto.',
  'Diseño bonito pero la calidad es regular.',
  'Cumple bien pero el cierre se siente algo frágil.',
];

const FIRST_NAMES = ['Mariana', 'Carlos', 'Sofía', 'Andrés', 'Valentina', 'Luis', 'Ana', 'Diego', 'Laura', 'Mateo', 'Camila', 'Javier', 'Isabella', 'Sebastián', 'Fernanda', 'Daniel', 'Gabriela', 'Joaquín', 'Renata', 'Esteban'];
const LAST_NAMES = ['Solís', 'Rojas', 'Méndez', 'Vargas', 'Castro', 'Jiménez', 'Mora', 'Hernández', 'Quesada', 'Picado', 'Soto', 'Brenes', 'Calderón', 'Murillo', 'Salas', 'Arce', 'Chacón', 'Fonseca', 'Granados', 'Loría'];

const daysAgo = (n) => new Date(Date.now() - n * 86_400_000);

async function limpiarBaseDeDatos() {
  // Order matters: respect FK constraints.
  await prisma.reviewVote.deleteMany();
  await prisma.review.deleteMany();
  await prisma.ratingsSummary.deleteMany();
  await prisma.lowStockAlert.deleteMany();
  await prisma.orderStatusNotification.deleteMany();
  await prisma.productCustomizationApproval.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.clientNotification.deleteMany();
  await prisma.clientRecoveryToken.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.revokedToken.deleteMany();
  await prisma.clientUser.deleteMany();
}

async function sembrarCategorias() {
  const categorias = [];
  for (const name of CATEGORIES) {
    categorias.push(await prisma.category.create({ data: { name } }));
  }
  return categorias;
}

async function sembrarProductos(categorias) {
  const productos = [];
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const name = PRODUCT_NAMES[i];
    const item = await prisma.item.create({
      data: { name, itemType: 'product', status: i === 19 ? 'inactive' : 'active' },
    });
    const product = await prisma.product.create({
      data: {
        itemId: item.id,
        categoryId: categorias[i % categorias.length].id,
        description: `${name}. Pieza artesanal con acabados premium, hecha a mano en Costa Rica.`,
        imageUrl: productImageForIndex(i),
        type: i % 4 === 0 ? 'custom' : 'standard',
      },
    });

    const variantes = [];
    const numVariantes = 3;
    for (let v = 0; v < numVariantes; v++) {
      const variant = await prisma.productVariant.create({
        data: {
          productId: product.itemId,
          color: COLORS[(i + v) % COLORS.length],
          size: SIZES[v % SIZES.length],
          price: 15000 + i * 1500 + v * 2500,
          currentStock: 30 - v * 5,
          minThreshold: 5,
          reservedStock: 0,
        },
      });
      variantes.push(variant);
    }

    productos.push({ product, variantes });
  }
  return productos;
}

async function sembrarLowStockAlerts(productos) {
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const variant = productos[i].variantes[0];
    await prisma.lowStockAlert.create({
      data: {
        variantId: variant.id,
        alertSentAt: daysAgo(i + 1),
        stockAtAlert: 3,
      },
    });
  }
}

async function sembrarUsuarios() {
  const passwordHash = await bcrypt.hash(TEST_USER.password, SALT_ROUNDS);
  const usuarios = [];

  const principal = await prisma.clientUser.create({
    data: {
      fullName: TEST_USER.fullName,
      email: TEST_USER.email,
      passwordHash,
      accountStatus: 'active',
    },
  });
  usuarios.push(principal);

  for (let i = 0; i < RECORDS_PER_TABLE - 1; i++) {
    const fullName = `${FIRST_NAMES[i]} ${LAST_NAMES[i]}`;
    const email = `cliente${i + 1}@example.com`;
    const hash = await bcrypt.hash(`Cliente${i + 1}!`, SALT_ROUNDS);
    const status = i === RECORDS_PER_TABLE - 2 ? 'inactive' : 'active';
    usuarios.push(
      await prisma.clientUser.create({
        data: { fullName, email, passwordHash: hash, accountStatus: status },
      }),
    );
  }
  return usuarios;
}

async function sembrarRecoveryTokens(usuarios) {
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const user = usuarios[i];
    await prisma.clientRecoveryToken.create({
      data: {
        userId: user.id,
        tokenHash: `seed-recovery-token-hash-${i}-${user.id}`,
        expiresAt: new Date(Date.now() + 3600_000),
        usedAt: i % 3 === 0 ? daysAgo(i) : null,
      },
    });
  }
}

async function sembrarNotificaciones(usuarios) {
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const user = usuarios[i % usuarios.length];
    await prisma.clientNotification.create({
      data: {
        clientUserId: user.id,
        type: NOTIFICATION_TYPES[i % NOTIFICATION_TYPES.length],
        title: `Notificación de prueba #${i + 1}`,
        content: `Contenido de la notificación ${i + 1} para ${user.fullName}.`,
        entityType: i % 2 === 0 ? 'order' : 'product',
        entityId: BigInt(i + 1),
        read: i % 2 === 0,
        sentAt: daysAgo(i),
        sendAttempts: 1,
      },
    });
  }
}

async function sembrarFavoritos(usuarios, productos) {
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const user = usuarios[i];
    const producto = productos[(i * 3) % productos.length].product;
    await prisma.favorite.create({
      data: { clientUserId: user.id, productId: producto.itemId },
    });
  }
}

async function sembrarCarritoYPedidos(usuarios, productos) {
  // Active cart for the test user (no order yet, persisted for testing UX).
  const carritoTest = await prisma.cart.create({
    data: { clientUserId: usuarios[0].id, status: 'active' },
  });
  for (let v = 0; v < 3; v++) {
    const variant = productos[v].variantes[0];
    await prisma.cartItem.create({
      data: {
        cartId: carritoTest.id,
        variantId: variant.id,
        quantity: v + 1,
        unitPriceSnap: variant.price,
      },
    });
  }

  // 20 converted carts → orders (across all users).
  const ordenes = [];
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const user = usuarios[(i + 1) % usuarios.length];
    const cart = await prisma.cart.create({
      data: { clientUserId: user.id, status: 'converted', createdAt: daysAgo(i + 5) },
    });

    const itemsCart = [];
    const numItems = 1 + (i % 3);
    let subtotal = 0;
    for (let k = 0; k < numItems; k++) {
      const variant = productos[(i + k) % productos.length].variantes[k % 3];
      const quantity = 1 + (k % 2);
      const unitPriceSnap = variant.price;
      await prisma.cartItem.create({
        data: { cartId: cart.id, variantId: variant.id, quantity, unitPriceSnap },
      });
      itemsCart.push({ variant, quantity, unitPriceSnap });
      subtotal += Number(unitPriceSnap) * quantity;
    }

    const taxes = subtotal * TAX_RATE;
    const totalAmount = subtotal + taxes;
    const status = ORDER_STATUSES[i % ORDER_STATUSES.length];

    const orden = await prisma.order.create({
      data: {
        clientUserId: user.id,
        cartId: cart.id,
        status,
        subtotal,
        taxes,
        totalAmount,
        shippingAddress: `Dirección de envío del pedido ${i + 1}, San José, Costa Rica`,
        createdAt: daysAgo(i + 5),
      },
    });

    for (const item of itemsCart) {
      await prisma.orderItem.create({
        data: {
          orderId: orden.id,
          variantId: item.variant.id,
          quantity: item.quantity,
          unitPriceSnap: item.unitPriceSnap,
        },
      });
    }

    await prisma.payment.create({
      data: {
        orderId: orden.id,
        method: PAYMENT_METHODS[i % PAYMENT_METHODS.length],
        externalReference: `EXT-REF-${1000 + i}`,
        amount: totalAmount,
        status: PAYMENT_STATUSES[i % PAYMENT_STATUSES.length],
      },
    });

    ordenes.push({ orden, user });
  }
  return ordenes;
}

async function sembrarStatusNotifications(ordenes) {
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const { orden, user } = ordenes[i];
    await prisma.orderStatusNotification.create({
      data: {
        orderId: orden.id,
        clientUserId: user.id,
        previousStatus: 'pending_payment',
        newStatus: orden.status,
        changedAt: daysAgo(i + 3),
        deliveryStatus: DELIVERY_STATUSES[i % DELIVERY_STATUSES.length],
        deliveryAttempts: 1,
        deliveryLastError: i % 5 === 0 ? 'SMTP timeout' : null,
        deliveredAt: i % 3 === 0 ? daysAgo(i + 2) : null,
      },
    });
  }
}

async function sembrarCustomizationApprovals(ordenes) {
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const { orden, user } = ordenes[i];
    await prisma.productCustomizationApproval.create({
      data: {
        orderId: orden.id,
        clientUserId: user.id,
        status: CUSTOMIZATION_STATUSES[i % CUSTOMIZATION_STATUSES.length],
        adjustmentNotes: i % 2 === 0 ? `Ajuste solicitado: cambiar color principal del pedido ${i + 1}.` : null,
        notifiedAt: daysAgo(i + 2),
        respondedAt: i % 2 === 0 ? daysAgo(i + 1) : null,
        autoApprovedAt: i % 4 === 0 ? daysAgo(i) : null,
      },
    });
  }
}

const REVIEWS_PER_PRODUCT = 4;

async function sembrarReviewsYRatings(usuarios, productos) {
  const reviewsCreadas = [];
  for (let p = 0; p < productos.length; p++) {
    const product = productos[p].product;
    for (let r = 0; r < REVIEWS_PER_PRODUCT; r++) {
      const user = usuarios[(p + r + 3) % usuarios.length];
      const rating = 1 + ((p + r) % 5);
      const commentIndex = (p * REVIEWS_PER_PRODUCT + r) % REVIEW_COMMENTS.length;
      const review = await prisma.review.create({
        data: {
          productId: product.itemId,
          clientUserId: user.id,
          rating,
          comment: REVIEW_COMMENTS[commentIndex],
          status: 'approved',
          edited: (p + r) % 5 === 0,
          helpfulVotes: (p + r) * 2,
          unhelpfulVotes: r % 3,
        },
      });
      reviewsCreadas.push(review);
    }
  }

  for (let i = 0; i < productos.length; i++) {
    const product = productos[i].product;
    const distribution = [0, 0, 0, 0, 0];
    const total = 5 + (i % 6);
    for (let k = 0; k < total; k++) distribution[(i + k) % 5] += 1;
    const totalReviews = distribution.reduce((a, b) => a + b, 0);
    const weightedSum = distribution.reduce((acc, count, idx) => acc + count * (idx + 1), 0);
    const average = totalReviews === 0 ? 0 : weightedSum / totalReviews;
    await prisma.ratingsSummary.create({
      data: {
        productId: product.itemId,
        average: Number(average.toFixed(1)),
        totalReviews,
        stars1: distribution[0],
        stars2: distribution[1],
        stars3: distribution[2],
        stars4: distribution[3],
        stars5: distribution[4],
      },
    });
  }

  return reviewsCreadas;
}

async function sembrarReviewVotes(usuarios, reviews) {
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const review = reviews[i];
    const user = usuarios[(i + 7) % usuarios.length];
    if (user.id === review.clientUserId) continue;
    await prisma.reviewVote.create({
      data: {
        reviewId: review.id,
        clientUserId: user.id,
        voteType: VOTE_TYPES[i % VOTE_TYPES.length],
      },
    });
  }
}

async function sembrarAuthSecurity(usuarios) {
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const user = usuarios[i % usuarios.length];
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: `refresh-token-hash-${i}-${user.id}`.padEnd(64, '0').slice(0, 64),
        jti: `00000000-0000-0000-0000-${String(i).padStart(12, '0')}`,
        expiresAt: new Date(Date.now() + 7 * 86_400_000),
        lastUsedAt: i % 2 === 0 ? daysAgo(i) : null,
      },
    });

    await prisma.revokedToken.create({
      data: {
        jti: `revoked-${String(i).padStart(8, '0')}-0000-0000-0000-000000000000`.slice(0, 36),
        expiresAt: new Date(Date.now() + 86_400_000),
      },
    });
  }
}

async function main() {
  console.log('Iniciando seed del cliente...');

  await limpiarBaseDeDatos();
  console.log('- Base de datos limpia');

  const categorias = await sembrarCategorias();
  console.log(`- ${categorias.length} categorias`);

  const productos = await sembrarProductos(categorias);
  console.log(`- ${productos.length} productos con variantes`);

  await sembrarLowStockAlerts(productos);
  console.log('- Alertas de stock bajo');

  const usuarios = await sembrarUsuarios();
  console.log(`- ${usuarios.length} usuarios (incluye ${TEST_USER.email})`);

  await sembrarRecoveryTokens(usuarios);
  console.log('- Tokens de recuperacion');

  await sembrarNotificaciones(usuarios);
  console.log('- Notificaciones del cliente');

  await sembrarFavoritos(usuarios, productos);
  console.log('- Favoritos');

  const ordenes = await sembrarCarritoYPedidos(usuarios, productos);
  console.log(`- ${ordenes.length} pedidos con sus pagos`);

  await sembrarStatusNotifications(ordenes);
  console.log('- Historial de estados de pedidos');

  await sembrarCustomizationApprovals(ordenes);
  console.log('- Aprobaciones de personalizacion');

  const reviews = await sembrarReviewsYRatings(usuarios, productos);
  console.log(`- ${reviews.length} resenas + resumenes de calificacion`);

  await sembrarReviewVotes(usuarios, reviews);
  console.log('- Votos de resenas');

  await sembrarAuthSecurity(usuarios);
  console.log('- Tokens de seguridad');

  console.log(`\nSeed completado. Credenciales de prueba: ${TEST_USER.email} / ${TEST_USER.password}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error('Error al ejecutar el seed:', error);
    prisma.$disconnect();
    process.exit(1);
  });
