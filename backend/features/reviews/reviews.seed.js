import 'dotenv/config';
import bcrypt from 'bcrypt';
import pkg from '@prisma/client';
import { COMPLETED_ORDER_STATUS, REVIEW_STATUS } from './reviews.constants.js';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// ─── Configuración del escenario de prueba ──────────────────────────────────

const TEST_USER = {
  fullName: 'Usuario de Pruebas',
  email: 'tester@reviews.local',
  passwordPlain: 'Reviews1234!',
};

const TEST_CATEGORY = 'Pruebas (US-REV-001 / US-REV-004)';

// Reviewers auxiliares para que la sección pública no luzca vacía.
const EXTRA_REVIEWERS = [
  { fullName: 'Ana Martínez', email: 'ana.martinez@example.com' },
  { fullName: 'José Calderón', email: 'jose.calderon@example.com' },
];

const SHIPPING_ADDRESS = 'Av. Pruebas 123, San José, Costa Rica';

// 3 productos nuevos. `purchased: true` => se crea orden delivered para el test user.
const NEW_PRODUCTS = [
  {
    name: 'Reloj minimalista de madera',
    description:
      'Reloj de pulsera con esfera de madera de cedro y correa de cuero genuino. Movimiento japonés.',
    imageUrl: 'https://placehold.co/600x600?text=Reloj',
    variant: {
      color: 'Marrón natural',
      size: 'Único',
      price: 32000,
      currentStock: 18,
      minThreshold: 4,
      reservedStock: 0,
    },
    purchased: true,
    seedReviews: [
      {
        reviewerEmail: 'ana.martinez@example.com',
        rating: 5,
        comment:
          'Reloj precioso, la madera tiene un acabado muy fino y se ve elegante con cualquier outfit. Recomendado.',
        edited: false,
        helpfulVotes: 12,
        unhelpfulVotes: 0,
        createdAt: '2026-04-18T11:00:00.000Z',
        updatedAt: '2026-04-18T11:00:00.000Z',
      },
      {
        reviewerEmail: 'jose.calderon@example.com',
        rating: 4,
        comment:
          'Buena calidad por el precio. La correa de cuero se siente sólida y el peso es adecuado.',
        edited: false,
        helpfulVotes: 7,
        unhelpfulVotes: 1,
        createdAt: '2026-04-05T15:30:00.000Z',
        updatedAt: '2026-04-05T15:30:00.000Z',
      },
    ],
  },
  {
    name: 'Cinturón de cuero trenzado',
    description:
      'Cinturón artesanal de cuero trenzado con hebilla metálica. Trabajo a mano de un solo cuero.',
    imageUrl: 'https://placehold.co/600x600?text=Cinturón',
    variant: {
      color: 'Negro',
      size: '90 cm',
      price: 18500,
      currentStock: 22,
      minThreshold: 5,
      reservedStock: 0,
    },
    purchased: true,
    seedReviews: [
      {
        reviewerEmail: 'ana.martinez@example.com',
        rating: 5,
        comment:
          'Cinturón hermoso, el trenzado es perfecto y el cuero huele muy bien. Vale cada colón.',
        edited: false,
        helpfulVotes: 10,
        unhelpfulVotes: 0,
        createdAt: '2026-03-30T09:45:00.000Z',
        updatedAt: '2026-03-30T09:45:00.000Z',
      },
    ],
  },
  {
    name: 'Sombrero artesanal de fibra natural',
    description:
      'Sombrero de ala ancha tejido a mano con fibras naturales. Perfecto para días soleados.',
    imageUrl: 'https://placehold.co/600x600?text=Sombrero',
    variant: {
      color: 'Beige',
      size: 'M',
      price: 14000,
      currentStock: 15,
      minThreshold: 3,
      reservedStock: 0,
    },
    purchased: false, // <── el test user NO compró este: probará el flujo "NOT_PURCHASED"
    seedReviews: [
      {
        reviewerEmail: 'jose.calderon@example.com',
        rating: 4,
        comment:
          'Sombrero ligero y muy cómodo. El tejido se ve cuidadoso, tarda en deformarse con el uso.',
        edited: false,
        helpfulVotes: 5,
        unhelpfulVotes: 0,
        createdAt: '2026-04-20T13:15:00.000Z',
        updatedAt: '2026-04-20T13:15:00.000Z',
      },
    ],
  },
];

// ─── Helpers SRP ────────────────────────────────────────────────────────────

async function ensureCategory(name) {
  const existente = await prisma.category.findUnique({ where: { name } });
  if (existente) return existente;
  return prisma.category.create({ data: { name } });
}

async function ensureUser({ fullName, email, passwordHash }) {
  return prisma.clientUser.upsert({
    where: { email: email.toLowerCase().trim() },
    update: {},
    create: {
      fullName,
      email: email.toLowerCase().trim(),
      passwordHash,
      accountStatus: 'active',
    },
  });
}

async function ensureReviewer({ fullName, email }) {
  // Reviewers auxiliares con hash placeholder (no son cuentas para login).
  const placeholderHash =
    '$2b$10$CwTycUXWue0Thq9StjUM0uJ8yjQ8zL4bC6F0n1rXqQyJZJ3F5mZTm';
  return ensureUser({ fullName, email, passwordHash: placeholderHash });
}

async function ensureProductWithVariant(categoryId, seedProduct) {
  const itemExistente = await prisma.item.findFirst({
    where: { name: seedProduct.name, itemType: 'product' },
    include: { product: { include: { variants: true } } },
  });

  if (itemExistente?.product) {
    return {
      product: itemExistente.product,
      variant: itemExistente.product.variants[0],
    };
  }

  const item = itemExistente
    ? itemExistente
    : await prisma.item.create({
        data: { name: seedProduct.name, itemType: 'product', status: 'active' },
      });

  const product = await prisma.product.create({
    data: {
      itemId: item.id,
      categoryId,
      description: seedProduct.description,
      imageUrl: seedProduct.imageUrl,
      type: 'standard',
      variants: { create: seedProduct.variant },
    },
    include: { variants: true },
  });

  return { product, variant: product.variants[0] };
}

async function ensureSeedReview(productId, reviewerId, seedReview) {
  const existente = await prisma.review.findFirst({
    where: { productId, clientUserId: reviewerId },
    select: { id: true },
  });
  if (existente) return false;

  await prisma.review.create({
    data: {
      productId,
      clientUserId: reviewerId,
      rating: seedReview.rating,
      comment: seedReview.comment,
      status: REVIEW_STATUS.APPROVED,
      edited: seedReview.edited,
      helpfulVotes: seedReview.helpfulVotes,
      unhelpfulVotes: seedReview.unhelpfulVotes,
      createdAt: new Date(seedReview.createdAt),
      updatedAt: new Date(seedReview.updatedAt),
    },
  });
  return true;
}

// Crea cart + order (status='delivered') + orderItem para la variante del producto.
// Idempotente: si ya existe una orden delivered del usuario con esta variante, no hace nada.
async function ensureDeliveredOrder(userId, variant, productName) {
  const ordenExistente = await prisma.order.findFirst({
    where: {
      clientUserId: userId,
      status: COMPLETED_ORDER_STATUS,
      orderItems: { some: { variantId: variant.id } },
    },
    select: { id: true },
  });
  if (ordenExistente) return false;

  const subtotal = Number(variant.price);
  const taxes = Number((subtotal * 0.13).toFixed(2));
  const totalAmount = Number((subtotal + taxes).toFixed(2));

  await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.create({
      data: { clientUserId: userId, status: 'converted' },
    });
    const order = await tx.order.create({
      data: {
        clientUserId: userId,
        cartId: cart.id,
        status: COMPLETED_ORDER_STATUS,
        subtotal,
        taxes,
        totalAmount,
        shippingAddress: SHIPPING_ADDRESS,
      },
    });
    await tx.orderItem.create({
      data: {
        orderId: order.id,
        variantId: variant.id,
        quantity: 1,
        unitPriceSnap: subtotal,
      },
    });
  });

  console.log(`  ✓ Orden 'delivered' creada para "${productName}"`);
  return true;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('Sembrando escenario de pruebas para US-REV-001 / US-REV-004...\n');

  const passwordHash = await bcrypt.hash(TEST_USER.passwordPlain, 10);
  const testUser = await ensureUser({
    fullName: TEST_USER.fullName,
    email: TEST_USER.email,
    passwordHash,
  });

  const reviewers = {};
  for (const r of EXTRA_REVIEWERS) {
    const created = await ensureReviewer(r);
    reviewers[r.email] = created;
  }

  const category = await ensureCategory(TEST_CATEGORY);

  for (const seedProduct of NEW_PRODUCTS) {
    console.log(`\n→ Producto: "${seedProduct.name}"`);
    const { product, variant } = await ensureProductWithVariant(
      category.id,
      seedProduct,
    );
    console.log(`  id=${product.itemId.toString()}  variantId=${variant.id.toString()}`);

    let inserted = 0;
    for (const seedReview of seedProduct.seedReviews ?? []) {
      const reviewer = reviewers[seedReview.reviewerEmail];
      if (!reviewer) continue;
      if (await ensureSeedReview(product.itemId, reviewer.id, seedReview)) {
        inserted += 1;
      }
    }
    console.log(`  Reseñas pre-cargadas: ${inserted}`);

    if (seedProduct.purchased) {
      await ensureDeliveredOrder(testUser.id, variant, seedProduct.name);
    } else {
      console.log(`  ✗ SIN orden delivered (probar flujo NOT_PURCHASED)`);
    }
  }

  console.log('\n────────────────────────────────────────────');
  console.log('Credenciales del usuario de prueba:');
  console.log(`  email:    ${TEST_USER.email}`);
  console.log(`  password: ${TEST_USER.passwordPlain}`);
  console.log('────────────────────────────────────────────');
  console.log('Productos sembrados:');
  for (const sp of NEW_PRODUCTS) {
    const item = await prisma.item.findFirst({
      where: { name: sp.name, itemType: 'product' },
      select: { id: true },
    });
    const flag = sp.purchased ? '✓ comprado' : '✗ NO comprado';
    console.log(`  [${flag}] /productos/${item.id.toString()}  →  ${sp.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
