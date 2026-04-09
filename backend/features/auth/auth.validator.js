import { z } from 'zod/v4';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export const registerSchema = z
  .object({
    fullName: z
      .string({ required_error: 'El nombre completo es requerido' })
      .min(2, 'El nombre completo debe tener al menos 2 caracteres')
      .max(100, 'El nombre completo no puede superar los 100 caracteres')
      .trim(),
    email: z
      .string({ required_error: 'El correo electrónico es requerido' })
      .email('Debe ingresar un correo electrónico válido')
      .max(150, 'El correo electrónico no puede superar los 150 caracteres'),
    password: z
      .string({ required_error: 'La contraseña es requerida' })
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
      .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
      .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
    confirmPassword: z.string({ required_error: 'La confirmación de contraseña es requerida' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export const validateRegister = (req, res, next) => {
  const resultado = registerSchema.safeParse(req.body);

  if (!resultado.success) {
    const errores = resultado.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errores });
  }

  req.body = resultado.data;
  next();
};
