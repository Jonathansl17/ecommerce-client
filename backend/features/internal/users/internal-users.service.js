import prisma from '../../../shared/db/prisma.js';

const USER_SELECT = {
  id: true,
  fullName: true,
  email: true,
  accountStatus: true,
  createdAt: true,
};

function serializarUsuario(usuario) {
  return {
    id: usuario.id.toString(),
    fullName: usuario.fullName,
    email: usuario.email,
    accountStatus: usuario.accountStatus,
    createdAt: usuario.createdAt,
  };
}

export const listarUsuarios = async ({ email, limit, offset }) => {
  const where = {};
  if (email) {
    where.email = { contains: email, mode: 'insensitive' };
  }

  const [total, usuarios] = await Promise.all([
    prisma.clientUser.count({ where }),
    prisma.clientUser.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: USER_SELECT,
    }),
  ]);

  return {
    total,
    items: usuarios.map(serializarUsuario),
  };
};
