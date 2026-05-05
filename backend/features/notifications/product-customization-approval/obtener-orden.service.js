import prisma from '../../../shared/db/prisma.js';

export async function obtenerOrdenConClienteAprobacion(orderId) {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    select: {
      id: true,
      clientUser: { select: { id: true, fullName: true, email: true } },
    },
  });
  return { order, clientUser: order.clientUser };
}
