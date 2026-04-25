export const AUTH_MESSAGES = {
  REGISTRO_EXITOSO: 'Registro exitoso',
  CORREO_YA_REGISTRADO: 'Este correo electrónico ya está registrado',
  ERROR_AL_REGISTRAR: 'Error al registrar el usuario',
  INICIO_SESION_EXITOSO: 'Inicio de sesión exitoso',
  CREDENCIALES_INVALIDAS: 'Correo electrónico o contraseña incorrectos',
  CUENTA_INACTIVA: 'Tu cuenta está inactiva. Contacta al soporte.',
  SESION_CERRADA: 'Sesión cerrada exitosamente',
  TOKEN_REVOCADO: 'El token ha sido revocado',
  SESION_EXPIRADA: 'Sesión expirada, vuelve a iniciar sesión',
  SESION_RENOVADA: 'Sesión renovada',
};

export const AUTH_CONFIG = {
  SALT_ROUNDS: 10,
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  ACCESS_TOKEN_MAX_AGE_MS: 15 * 60 * 1000,
  REFRESH_TOKEN_EXPIRES_MS: 7 * 24 * 60 * 60 * 1000,
  REFRESH_TOKEN_BYTES: 48,
};

export const COOKIE_NAMES = {
  ACCESS: 'ec_access',
  REFRESH: 'ec_refresh',
};

export const buildCookieOptions = (maxAgeMs, { forRefresh = false } = {}) => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: forRefresh ? '/api/auth' : '/',
    maxAge: maxAgeMs,
  };
};

export const WELCOME_NOTIFICATION = {
  TITLE: '¡Bienvenido a la plataforma!',
  CONTENT:
    'Te damos la bienvenida. Te recomendamos explorar nuestro catálogo de productos y configurar tus preferencias de notificaciones para recibir las mejores ofertas.',
  ENTITY_TYPE: 'onboarding',
};
