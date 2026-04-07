import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { CLIENTS_MESSAGES } from './clients.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const CAMPOS_PUBLICOS = {
  id: true,
  fullName: true,
  email: true,
  accountStatus: true,
  createdAt: true,
  updatedAt: true,
};

export const obtenerTodos = async () => {
  return prisma.clientUser.findMany({
    select: CAMPOS_PUBLICOS,
  });
};

export const obtenerPorId = async (id) => {
  const cliente = await prisma.clientUser.findUnique({
    where: { id: BigInt(id) },
    select: CAMPOS_PUBLICOS,
  });

  if (!cliente) {
    throw crearError(CLIENTS_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return cliente;
};

export const actualizar = async (id, datos) => {
  const { fullName, accountStatus } = datos;

  const cliente = await prisma.clientUser.update({
    where: { id: BigInt(id) },
    data: { fullName, accountStatus },
    select: CAMPOS_PUBLICOS,
  });

  return cliente;
};

export const eliminar = async (id) => {
  return prisma.clientUser.delete({
    where: { id: BigInt(id) },
    select: CAMPOS_PUBLICOS,
  });
};
