import bcrypt from 'bcrypt';
import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { AUTH_MESSAGES, AUTH_CONFIG, WELCOME_NOTIFICATION } from './auth.constants.js';
import {
  emitirPar,
  buscarRefreshPorRaw,
  marcarRefreshRotado,
  revocarRefreshsActivosDelUsuario,
  revocarRefreshPorRaw,
  revocarAccessJti,
} from './auth.tokens.service.js';
import { PRISMA_ERROR_CODES } from '../../shared/constants/app.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const normalizarEmail = (email) => email.toLowerCase().trim();

const hashearPassword = (password) => bcrypt.hash(password, AUTH_CONFIG.SALT_ROUNDS);

const serializarUsuario = (usuario) => ({
  id: usuario.id.toString(),
  email: usuario.email,
  fullName: usuario.fullName,
  accountStatus: usuario.accountStatus,
  createdAt: usuario.createdAt?.toISOString(),
  isAdmin: usuario.admin?.admin === true,
});

const obtenerNotificacionesNoLeidas = (clientUserId) =>
  prisma.clientNotification.findMany({
    where: { clientUserId, type: 'internal', read: false },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      content: true,
      entityType: true,
      read: true,
      sentAt: true,
      createdAt: true,
    },
  });

export const registrar = async ({ fullName, email, password }) => {
  const emailNormalizado = normalizarEmail(email);
  const passwordHash = await hashearPassword(password);

  try {
    await prisma.clientUser.create({
      data: {
        fullName: fullName.trim(),
        email: emailNormalizado,
        passwordHash,
      },
    });
  } catch (error) {
    if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT) {
      throw crearError(AUTH_MESSAGES.CORREO_YA_REGISTRADO, HTTP_STATUS.CONFLICT);
    }
    throw error;
  }
};

export const iniciarSesion = async ({ email, password }) => {
  const emailNormalizado = normalizarEmail(email);

  const usuario = await prisma.clientUser.findUnique({
    where: { email: emailNormalizado },
    select: {
      id: true,
      email: true,
      fullName: true,
      passwordHash: true,
      accountStatus: true,
      createdAt: true,
      admin: { select: { admin: true } },
    },
  });

  if (!usuario) {
    throw crearError(AUTH_MESSAGES.CREDENCIALES_INVALIDAS, HTTP_STATUS.UNAUTHORIZED);
  }

  if (usuario.accountStatus !== 'active') {
    throw crearError(AUTH_MESSAGES.CUENTA_INACTIVA, HTTP_STATUS.UNAUTHORIZED);
  }

  const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
  if (!passwordValida) {
    throw crearError(AUTH_MESSAGES.CREDENCIALES_INVALIDAS, HTTP_STATUS.UNAUTHORIZED);
  }

  await prisma.$transaction(
    async (tx) => {
      const notificacionExistente = await tx.clientNotification.findFirst({
        where: { clientUserId: usuario.id, entityType: WELCOME_NOTIFICATION.ENTITY_TYPE },
        select: { id: true },
      });
      if (!notificacionExistente) {
        await tx.clientNotification.create({
          data: {
            clientUserId: usuario.id,
            type: 'internal',
            title: WELCOME_NOTIFICATION.TITLE,
            content: WELCOME_NOTIFICATION.CONTENT,
            entityType: WELCOME_NOTIFICATION.ENTITY_TYPE,
            entityId: 0n,
            sentAt: new Date(),
          },
        });
      }
    },
    { isolationLevel: 'Serializable' }
  );

  const [par, notificaciones] = await Promise.all([
    emitirPar(usuario),
    obtenerNotificacionesNoLeidas(usuario.id),
  ]);

  return {
    ...par,
    usuario: serializarUsuario(usuario),
    notificaciones: notificaciones.map((n) => ({ ...n, id: n.id.toString() })),
  };
};

export const rotarRefresh = async (rawRefresh) => {
  if (!rawRefresh) {
    throw crearError(AUTH_MESSAGES.SESION_EXPIRADA, HTTP_STATUS.UNAUTHORIZED);
  }

  const registro = await buscarRefreshPorRaw(rawRefresh);
  if (!registro || registro.revokedAt || registro.rotatedAt || registro.expiresAt < new Date()) {
    if (registro && !registro.revokedAt) {
      await revocarRefreshsActivosDelUsuario(registro.userId);
    }
    throw crearError(AUTH_MESSAGES.SESION_EXPIRADA, HTTP_STATUS.UNAUTHORIZED);
  }

  const usuario = await prisma.clientUser.findUnique({
    where: { id: registro.userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      accountStatus: true,
      createdAt: true,
      admin: { select: { admin: true } },
    },
  });

  if (!usuario || usuario.accountStatus !== 'active') {
    throw crearError(AUTH_MESSAGES.SESION_EXPIRADA, HTTP_STATUS.UNAUTHORIZED);
  }

  const par = await emitirPar(usuario);
  await marcarRefreshRotado(registro.id);

  return { ...par, usuario: serializarUsuario(usuario) };
};

export const revocarSesion = async ({ rawRefresh, accessJti, accessExp }) => {
  await Promise.all([
    revocarRefreshPorRaw(rawRefresh),
    accessJti ? revocarAccessJti(accessJti, new Date(accessExp * 1000)) : Promise.resolve(),
  ]);
};

export const obtenerUsuarioActivo = async (id) => {
  const usuario = await prisma.clientUser.findUnique({
    where: { id: BigInt(id) },
    select: {
      id: true,
      email: true,
      fullName: true,
      accountStatus: true,
      createdAt: true,
      admin: { select: { admin: true } },
    },
  });
  if (!usuario || usuario.accountStatus !== 'active') return null;
  return serializarUsuario(usuario);
};
