import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { CLIENTS_MESSAGES } from './clients.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { AUTH_CONFIG } from '../auth/auth.constants.js';

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

export const obtenerPerfil = async (userId) => {
  const cliente = await prisma.clientUser.findUnique({
    where: { id: BigInt(userId) },
    select: CAMPOS_PUBLICOS,
  });

  if (!cliente) {
    throw crearError(CLIENTS_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return cliente;
};

export const actualizarPerfilUsuario = async (userId, { fullName, email, password }) => {
  const usuario = await prisma.clientUser.findUnique({
    where: { id: BigInt(userId) },
    select: {
      ...CAMPOS_PUBLICOS,
      passwordHash: true,
    },
  });

  if (!usuario) {
    throw crearError(CLIENTS_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
  if (!passwordValida) {
    throw crearError(CLIENTS_MESSAGES.INVALID_PASSWORD, HTTP_STATUS.UNAUTHORIZED);
  }

  if (email && email.toLowerCase().trim() !== usuario.email) {
    const emailExistente = await prisma.clientUser.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true },
    });
    if (emailExistente) {
      throw crearError(CLIENTS_MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }
  }

  const clienteActualizado = await prisma.clientUser.update({
    where: { id: BigInt(userId) },
    data: {
      fullName: fullName || usuario.fullName,
      email: email ? email.toLowerCase().trim() : usuario.email,
    },
    select: CAMPOS_PUBLICOS,
  });

  return clienteActualizado;
};

export const cambiarContrasenaUsuario = async (userId, { currentPassword, newPassword }) => {
  const usuario = await prisma.clientUser.findUnique({
    where: { id: BigInt(userId) },
    select: { id: true, passwordHash: true, email: true, fullName: true },
  });

  if (!usuario) {
    throw crearError(CLIENTS_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const valid = await bcrypt.compare(currentPassword, usuario.passwordHash);
  if (!valid) {
    throw crearError(CLIENTS_MESSAGES.INVALID_PASSWORD, HTTP_STATUS.UNAUTHORIZED);
  }

  const newHash = await bcrypt.hash(newPassword, AUTH_CONFIG.SALT_ROUNDS);

  await prisma.clientUser.update({
    where: { id: BigInt(userId) },
    data: { passwordHash: newHash },
  });

  // Generar link de confirmación
  const confirmationToken = crypto.randomUUID();
  const confirmationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile?passwordChanged=true&token=${confirmationToken}`;
  
  // Mostrar en terminal para desarrollo
  console.log(`\n✅ Contraseña cambiada exitosamente para ${usuario.email}`);
  console.log(`Enlace de confirmación: ${confirmationLink}\n`);

  return { 
    message: CLIENTS_MESSAGES.PASSWORD_CHANGED_SUCCESS,
    confirmationLink,
  };
};