import bcrypt from 'bcrypt';
import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { CLIENTS_MESSAGES } from './clients.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { AUTH_CONFIG } from '../auth/auth.constants.js';
import {
  enviarCorreoCambioContrasena,
  enviarCorreoCambioEmail,
} from '../notifications/email/email.service.js';

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

  const nuevoEmail = email ? email.toLowerCase().trim() : usuario.email;
  const emailCambio = nuevoEmail !== usuario.email;

  const clienteActualizado = await prisma.clientUser.update({
    where: { id: BigInt(userId) },
    data: {
      fullName: fullName || usuario.fullName,
      email: nuevoEmail,
    },
    select: CAMPOS_PUBLICOS,
  });

  if (emailCambio) {
    const changedAt = new Date();
    enviarCorreoCambioEmail({
      clientUser: { ...clienteActualizado, fullName: clienteActualizado.fullName },
      previousEmail: usuario.email,
      newEmail: nuevoEmail,
      changedAt,
    }).catch((err) => console.error(CLIENTS_MESSAGES.EMAIL_SEND_ERROR_EMAIL, err.message));
  }

  return clienteActualizado;
};

export const desactivarCuenta = async (userId, { password }) => {
  const usuario = await prisma.clientUser.findUnique({
    where: { id: BigInt(userId) },
    select: { id: true, passwordHash: true },
  });

  if (!usuario) {
    throw crearError(CLIENTS_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const valid = await bcrypt.compare(password, usuario.passwordHash);
  if (!valid) {
    throw crearError(CLIENTS_MESSAGES.INVALID_PASSWORD, HTTP_STATUS.UNAUTHORIZED);
  }

  await prisma.clientUser.update({
    where: { id: BigInt(userId) },
    data: { accountStatus: 'inactive' },
  });

  return { message: CLIENTS_MESSAGES.DEACTIVATE_SUCCESS };
};

export const reactivarCuenta = async (email, password) => {
  const usuario = await prisma.clientUser.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: { id: true, passwordHash: true, accountStatus: true },
  });

  const credencialesValidas = usuario && await bcrypt.compare(password, usuario.passwordHash);
  if (!credencialesValidas) {
    throw crearError(CLIENTS_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  if (usuario.accountStatus !== 'inactive') {
    throw crearError(CLIENTS_MESSAGES.ACCOUNT_NOT_INACTIVE, HTTP_STATUS.BAD_REQUEST);
  }

  await prisma.clientUser.update({
    where: { id: usuario.id },
    data: { accountStatus: 'active' },
  });

  return { message: CLIENTS_MESSAGES.REACTIVATE_SUCCESS };
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

  const changedAt = new Date();
  enviarCorreoCambioContrasena(
    { email: usuario.email, fullName: usuario.fullName },
    changedAt,
  ).catch((err) => console.error(CLIENTS_MESSAGES.EMAIL_SEND_ERROR_PASSWORD, err.message));

  return { message: CLIENTS_MESSAGES.PASSWORD_CHANGED_SUCCESS };
};