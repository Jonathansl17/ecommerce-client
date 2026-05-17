import 'dotenv/config';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const SEED_CATEGORY_NAME = 'Bolsos artesanales';

// Hash bcrypt placeholder ($2b$10$...) — los usuarios sembrados son solo para mostrar
// reseñas, no para iniciar sesión. No representa una contraseña usable real.
const SEED_PASSWORD_HASH =
  '$2b$10$CwTycUXWue0Thq9StjUM0uJ8yjQ8zL4bC6F0n1rXqQyJZJ3F5mZTm';

const SEED_PRODUCTS = [
  {
    name: 'Bolso artesanal de cuero café',
    description:
      'Bolso artesanal hecho con cuero genuino. Trabajo manual con costuras reforzadas y herrajes metálicos.',
    imageUrl: 'https://placehold.co/600x600?text=Bolso+Cuero',
    variant: {
      color: 'Café',
      size: 'Único',
      price: 45000,
      currentStock: 25,
      minThreshold: 5,
      reservedStock: 0,
    },
    reviews: [
      {
        userName: 'Mariana Solís',
        userEmail: 'mariana.solis@example.com',
        rating: 5,
        comment:
          'Increíble bolso, el cuero es de una calidad excepcional. Lo uso todos los días y sigue viéndose como nuevo. El diseño artesanal se nota en cada detalle.',
        edited: false,
        helpfulVotes: 24,
        unhelpfulVotes: 1,
        createdAt: '2026-04-10T09:15:00.000Z',
        updatedAt: '2026-04-10T09:15:00.000Z',
      },
      {
        userName: 'Diego Montoya',
        userEmail: 'diego.montoya@example.com',
        rating: 4,
        comment:
          'Muy buen producto, el cuero es resistente y el acabado es prolijo. Le quito una estrella porque el envío tardó más de lo esperado, pero el bolso en sí es excelente.',
        edited: false,
        helpfulVotes: 18,
        unhelpfulVotes: 2,
        createdAt: '2026-03-28T14:40:00.000Z',
        updatedAt: '2026-03-28T14:40:00.000Z',
      },
      {
        userName: 'Valeria Cruz',
        userEmail: 'valeria.cruz@example.com',
        rating: 5,
        comment:
          'Superó todas mis expectativas. El color café es exactamente como en las fotos y el tamaño es perfecto para el día a día. Ya lo recomendé a varias amigas.',
        edited: true,
        helpfulVotes: 15,
        unhelpfulVotes: 0,
        createdAt: '2026-03-20T11:00:00.000Z',
        updatedAt: '2026-03-22T08:30:00.000Z',
      },
      {
        userName: 'Andrés Jiménez',
        userEmail: 'andres.jimenez@example.com',
        rating: 3,
        comment:
          'El bolso está bien hecho pero me parece un poco pequeño para lo que necesito. La calidad del cuero es buena, pero esperaba que las correas fueran más largas.',
        edited: false,
        helpfulVotes: 9,
        unhelpfulVotes: 3,
        createdAt: '2026-03-12T16:20:00.000Z',
        updatedAt: '2026-03-12T16:20:00.000Z',
      },
      {
        userName: 'Fernanda Arias',
        userEmail: 'fernanda.arias@example.com',
        rating: 5,
        comment:
          'Compré este bolso como regalo y la persona quedó encantada. La presentación es hermosa y el cuero tiene un olor característico muy agradable. Definitivamente volvería a comprar.',
        edited: false,
        helpfulVotes: 21,
        unhelpfulVotes: 0,
        createdAt: '2026-02-28T10:05:00.000Z',
        updatedAt: '2026-02-28T10:05:00.000Z',
      },
      {
        userName: 'Carlos Rojas',
        userEmail: 'carlos.rojas@example.com',
        rating: 4,
        comment:
          'Buen bolso artesanal. Se nota el trabajo manual en las costuras. El único detalle es que el interior podría tener más bolsillos, pero la capacidad general es suficiente.',
        edited: false,
        helpfulVotes: 11,
        unhelpfulVotes: 1,
        createdAt: '2026-02-15T13:30:00.000Z',
        updatedAt: '2026-02-15T13:30:00.000Z',
      },
      {
        userName: 'Lucía Vargas',
        userEmail: 'lucia.vargas@example.com',
        rating: 2,
        comment:
          'Esperaba más por el precio. El cuero es correcto pero la costura de una de las asas comenzó a despegarse al mes de uso. El servicio al cliente respondió rápido pero igual es un defecto que no debería tener.',
        edited: true,
        helpfulVotes: 7,
        unhelpfulVotes: 5,
        createdAt: '2026-02-03T08:45:00.000Z',
        updatedAt: '2026-02-10T09:00:00.000Z',
      },
      {
        userName: 'Roberto Méndez',
        userEmail: 'roberto.mendez@example.com',
        rating: 5,
        comment:
          'Producto de primera calidad. El artesano claramente pone mucho cuidado en cada pieza. El cuero es suave pero resistente, y los herrajes metálicos se ven sólidos.',
        edited: false,
        helpfulVotes: 19,
        unhelpfulVotes: 0,
        createdAt: '2026-01-25T17:00:00.000Z',
        updatedAt: '2026-01-25T17:00:00.000Z',
      },
      {
        userName: 'Camila Mora',
        userEmail: 'camila.mora@example.com',
        rating: 4,
        comment:
          'Muy linda la factura del bolso. Lo compré en color café y combina con todo. Las correas son cómodas incluso cuando va lleno. Le doy 4 estrellas porque tardó en llegar.',
        edited: false,
        helpfulVotes: 13,
        unhelpfulVotes: 2,
        createdAt: '2026-01-14T12:10:00.000Z',
        updatedAt: '2026-01-14T12:10:00.000Z',
      },
      {
        userName: 'Sofía Blanco',
        userEmail: 'sofia.blanco@example.com',
        rating: 1,
        comment:
          'Lamentablemente recibí el bolso con una mancha de fábrica en el frente que no salió con ningún producto de limpieza para cuero. El proceso de devolución fue tedioso y tardó semanas.',
        edited: false,
        helpfulVotes: 5,
        unhelpfulVotes: 8,
        createdAt: '2026-01-05T14:50:00.000Z',
        updatedAt: '2026-01-05T14:50:00.000Z',
      },
      {
        userName: 'Miguel Salas',
        userEmail: 'miguel.salas@example.com',
        rating: 5,
        comment:
          'Compré el bolso para mi esposa y quedó enamorada. La artesanía local es de altísimo nivel, se ve un trabajo cuidadoso en cada detalle. Vale cada colón pagado.',
        edited: false,
        helpfulVotes: 16,
        unhelpfulVotes: 0,
        createdAt: '2025-12-20T10:30:00.000Z',
        updatedAt: '2025-12-20T10:30:00.000Z',
      },
      {
        userName: 'Paola Hernández',
        userEmail: 'paola.hernandez@example.com',
        rating: 3,
        comment:
          'El bolso es bonito y la calidad del cuero parece buena, pero el cierre magnético no tiene suficiente fuerza y se abre con facilidad. Para el precio esperaría un cierre más robusto.',
        edited: false,
        helpfulVotes: 8,
        unhelpfulVotes: 4,
        createdAt: '2025-12-08T09:20:00.000Z',
        updatedAt: '2025-12-08T09:20:00.000Z',
      },
    ],
  },
  {
    name: 'Mochila urbana de lona encerada',
    description:
      'Mochila urbana resistente al agua, con lona encerada y forro interior acolchado para laptop de hasta 15 pulgadas.',
    imageUrl: 'https://placehold.co/600x600?text=Mochila+Urbana',
    variant: {
      color: 'Verde oliva',
      size: 'Mediana',
      price: 38000,
      currentStock: 40,
      minThreshold: 8,
      reservedStock: 0,
    },
    reviews: [
      {
        userName: 'Jorge Núñez',
        userEmail: 'jorge.nunez@example.com',
        rating: 5,
        comment:
          'La mejor mochila que he tenido. Aguantó dos semanas de viaje bajo lluvia constante y mi laptop quedó intacta. Las costuras son sólidas y los cierres son de buena calidad.',
        edited: false,
        helpfulVotes: 30,
        unhelpfulVotes: 0,
        createdAt: '2026-04-15T08:30:00.000Z',
        updatedAt: '2026-04-15T08:30:00.000Z',
      },
      {
        userName: 'Andrea Quesada',
        userEmail: 'andrea.quesada@example.com',
        rating: 4,
        comment:
          'Mochila muy cómoda y bien distribuida. Tiene compartimentos suficientes para todo. El único detalle es que el color verde oliva en persona es más oscuro que en la foto.',
        edited: false,
        helpfulVotes: 17,
        unhelpfulVotes: 2,
        createdAt: '2026-04-02T13:10:00.000Z',
        updatedAt: '2026-04-02T13:10:00.000Z',
      },
      {
        userName: 'Pablo Castro',
        userEmail: 'pablo.castro@example.com',
        rating: 5,
        comment:
          'Excelente para uso diario en bicicleta. La lona encerada repele el agua perfectamente y el respaldo acolchado evita que sude la espalda. Muy recomendada.',
        edited: false,
        helpfulVotes: 22,
        unhelpfulVotes: 1,
        createdAt: '2026-03-18T17:45:00.000Z',
        updatedAt: '2026-03-18T17:45:00.000Z',
      },
      {
        userName: 'Natalia Brenes',
        userEmail: 'natalia.brenes@example.com',
        rating: 3,
        comment:
          'La mochila está bien construida pero los tirantes son un poco delgados para el peso que aguanta. Después de un par de horas con la laptop empieza a incomodar el hombro.',
        edited: true,
        helpfulVotes: 12,
        unhelpfulVotes: 4,
        createdAt: '2026-03-05T10:20:00.000Z',
        updatedAt: '2026-03-08T09:00:00.000Z',
      },
      {
        userName: 'Esteban Ramírez',
        userEmail: 'esteban.ramirez@example.com',
        rating: 5,
        comment:
          'Calidad sobresaliente. Se siente que va a durar años. El compartimento para la laptop tiene buen acolchado y la apertura tipo clamshell facilita organizar todo.',
        edited: false,
        helpfulVotes: 14,
        unhelpfulVotes: 0,
        createdAt: '2026-02-22T15:00:00.000Z',
        updatedAt: '2026-02-22T15:00:00.000Z',
      },
      {
        userName: 'Daniela Picado',
        userEmail: 'daniela.picado@example.com',
        rating: 2,
        comment:
          'Me llegó con un cierre defectuoso del bolsillo frontal. La calidad general parece buena pero el control de calidad falló. Estoy gestionando el cambio.',
        edited: false,
        helpfulVotes: 6,
        unhelpfulVotes: 3,
        createdAt: '2026-02-10T11:30:00.000Z',
        updatedAt: '2026-02-10T11:30:00.000Z',
      },
      {
        userName: 'Luis Aguilar',
        userEmail: 'luis.aguilar@example.com',
        rating: 4,
        comment:
          'Buena relación calidad-precio. Cabe todo lo necesario para un día de oficina y la lona se ve elegante. Le falta un bolsillo lateral para botella de agua, eso lo mejoraría.',
        edited: false,
        helpfulVotes: 10,
        unhelpfulVotes: 1,
        createdAt: '2026-01-28T09:15:00.000Z',
        updatedAt: '2026-01-28T09:15:00.000Z',
      },
      {
        userName: 'Karla Vega',
        userEmail: 'karla.vega@example.com',
        rating: 5,
        comment:
          'Justo lo que buscaba. Diseño minimalista, materiales de calidad y muy práctica. La uso para la universidad y aguanta libros, laptop y tablet sin problema.',
        edited: false,
        helpfulVotes: 18,
        unhelpfulVotes: 0,
        createdAt: '2026-01-12T14:00:00.000Z',
        updatedAt: '2026-01-12T14:00:00.000Z',
      },
    ],
  },
];

async function ensureCategory() {
  const existing = await prisma.category.findUnique({
    where: { name: SEED_CATEGORY_NAME },
  });
  if (existing) return existing;
  return prisma.category.create({ data: { name: SEED_CATEGORY_NAME } });
}

async function ensureProduct(categoryId, seedProduct) {
  const existingItem = await prisma.item.findFirst({
    where: { name: seedProduct.name, itemType: 'product' },
  });
  if (existingItem) {
    const product = await prisma.product.findUnique({ where: { itemId: existingItem.id } });
    if (product) return product;
  }

  const item = existingItem
    ? existingItem
    : await prisma.item.create({
        data: { name: seedProduct.name, itemType: 'product', status: 'active' },
      });

  return prisma.product.create({
    data: {
      itemId: item.id,
      categoryId,
      description: seedProduct.description,
      imageUrl: seedProduct.imageUrl,
      type: 'standard',
      variants: { create: seedProduct.variant },
    },
  });
}

async function ensureUser(seedUser) {
  return prisma.clientUser.upsert({
    where: { email: seedUser.userEmail },
    update: {},
    create: {
      fullName: seedUser.userName,
      email: seedUser.userEmail,
      passwordHash: SEED_PASSWORD_HASH,
      accountStatus: 'active',
    },
  });
}

async function ensureReview(productId, userId, seedReview) {
  // No hay clave única natural — buscamos por (productId, userId) para idempotencia.
  const existing = await prisma.review.findFirst({
    where: { productId, clientUserId: userId },
  });
  if (existing) return { review: existing, created: false };

  const review = await prisma.review.create({
    data: {
      productId,
      clientUserId: userId,
      rating: seedReview.rating,
      comment: seedReview.comment,
      status: 'approved',
      edited: seedReview.edited,
      helpfulVotes: seedReview.helpfulVotes,
      unhelpfulVotes: seedReview.unhelpfulVotes,
      createdAt: new Date(seedReview.createdAt),
      updatedAt: new Date(seedReview.updatedAt),
    },
  });
  return { review, created: true };
}

async function main() {
  console.log('Sembrando datos de reseñas...');

  const category = await ensureCategory();

  for (const seedProduct of SEED_PRODUCTS) {
    const product = await ensureProduct(category.id, seedProduct);
    console.log(`\nProducto listo: "${seedProduct.name}" id=${product.itemId.toString()}`);

    let inserted = 0;
    for (const seedReview of seedProduct.reviews) {
      const user = await ensureUser(seedReview);
      const { created } = await ensureReview(product.itemId, user.id, seedReview);
      if (created) inserted += 1;
    }

    console.log(`  Reseñas creadas en esta corrida: ${inserted}`);
    console.log(
      `  URL de prueba: http://localhost:3001/api/reviews/product/${product.itemId.toString()}`,
    );
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
