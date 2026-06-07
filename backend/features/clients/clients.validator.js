import { z } from 'zod/v4';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .optional(),
  email: z
    .string()
    .trim()
    .email('Debe ingresar un correo electrónico válido')
    .optional(),
  password: z
    .string({ required_error: 'La contraseña actual es requerida' })
    .min(1, 'La contraseña actual es requerida'),
});

const changePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: 'La contraseña actual es requerida' })
    .min(1, 'La contraseña actual es requerida'),
  newPassword: z
    .string({ required_error: 'La nueva contraseña es requerida' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(72, 'La contraseña no puede exceder 72 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'La contraseña debe contener al menos un carácter especial'),
}).refine((data) => data.newPassword !== data.currentPassword, {
  message: 'La nueva contraseña debe ser diferente a la contraseña actual',
  path: ['newPassword'],
});

function responderErrores(res, resultado) {
  const errores = resultado.error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errores });
}

export const validateUpdateProfile = (req, res, next) => {
  const resultado = updateProfileSchema.safeParse(req.body);
  if (!resultado.success) {
    return responderErrores(res, resultado);
  }
  req.body = resultado.data;
  next();
};

export const validateChangePassword = (req, res, next) => {
  const resultado = changePasswordSchema.safeParse(req.body);
  if (!resultado.success) {
    return responderErrores(res, resultado);
  }
  req.body = resultado.data;
  next();
};

const deactivateAccountSchema = z.object({
  password: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(1, 'La contraseña es requerida'),
});

export const validateDeactivateAccount = (req, res, next) => {
  const resultado = deactivateAccountSchema.safeParse(req.body);
  if (!resultado.success) {
    return responderErrores(res, resultado);
  }
  req.body = resultado.data;
  next();
};

const reactivateAccountSchema = z.object({
  email: z
    .string({ required_error: 'El correo electrónico es requerido' })
    .trim()
    .email('Debe ingresar un correo electrónico válido'),
  password: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(1, 'La contraseña es requerida'),
});

export const validateReactivateAccount = (req, res, next) => {
  const resultado = reactivateAccountSchema.safeParse(req.body);
  if (!resultado.success) {
    return responderErrores(res, resultado);
  }
  req.body = resultado.data;
  next();
};
