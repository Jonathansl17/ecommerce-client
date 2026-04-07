import bcrypt from 'bcrypt';
import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { AUTH_MESSAGES, AUTH_CONFIG } from './auth.constants.js';
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
