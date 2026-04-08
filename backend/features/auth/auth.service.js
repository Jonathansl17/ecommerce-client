import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { AUTH_MESSAGES, AUTH_CONFIG, WELCOME_NOTIFICATION } from './auth.constants.js';
import { PRISMA_ERROR_CODES } from '../../shared/constants/app.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const normalizarEmail = (email) => email.toLowerCase().trim();

const hashearPassword = (password) => bcrypt.hash(password, AUTH_CONFIG.SALT_ROUNDS);

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
      throw crearError(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }
    throw error;
  }
};

const generarToken = (usuario) =>
  jwt.sign(
    { sub: usuario.id.toString(), email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: AUTH_CONFIG.JWT_EXPIRES_IN }
  );

const crearNotificacionBienvenida = (clientUserId) =>
  prisma.clientNotification.create({
    data: {
      clientUserId,
      type: 'internal',
      title: WELCOME_NOTIFICATION.TITLE,
      content: WELCOME_NOTIFICATION.CONTENT,
      entityType: WELCOME_NOTIFICATION.ENTITY_TYPE,
      entityId: 0n,
      sentAt: new Date(),
    },
  });

const esPrimerLogin = async (clientUserId) => {
  const notificacionBienvenida = await prisma.clientNotification.findFirst({
    where: {
      clientUserId,
      entityType: WELCOME_NOTIFICATION.ENTITY_TYPE,
    },
    select: { id: true },
  });
  return notificacionBienvenida === null;
};

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
    },
  });

  if (!usuario) {
    throw crearError(AUTH_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  if (usuario.accountStatus !== 'active') {
    throw crearError(AUTH_MESSAGES.ACCOUNT_INACTIVE, HTTP_STATUS.UNAUTHORIZED);
  }

  const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
  if (!passwordValida) {
    throw crearError(AUTH_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  const primerLogin = await esPrimerLogin(usuario.id);
  if (primerLogin) {
    await crearNotificacionBienvenida(usuario.id);
  }

  const [token, notificaciones] = await Promise.all([
    Promise.resolve(generarToken(usuario)),
    obtenerNotificacionesNoLeidas(usuario.id),
  ]);

  return {
    token,
    usuario: {
      id: usuario.id.toString(),
      email: usuario.email,
      fullName: usuario.fullName,
    },
    notificaciones: notificaciones.map((n) => ({
      ...n,
      id: n.id.toString(),
    })),
  };
};
