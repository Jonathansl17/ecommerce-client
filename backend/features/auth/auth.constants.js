export const AUTH_MESSAGES = {
  REGISTER_SUCCESS: 'Registro exitoso',
  EMAIL_ALREADY_EXISTS: 'Este correo electrónico ya está registrado',
  REGISTRATION_FAILED: 'Error al registrar el usuario',
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  INVALID_CREDENTIALS: 'Correo electrónico o contraseña incorrectos',
  ACCOUNT_INACTIVE: 'Tu cuenta está inactiva. Contacta al soporte.',
};

export const AUTH_CONFIG = {
  SALT_ROUNDS: 10,
  JWT_EXPIRES_IN: '7d',
};

export const WELCOME_NOTIFICATION = {
  TITLE: '¡Bienvenido a la plataforma!',
  CONTENT:
    'Te damos la bienvenida. Te recomendamos explorar nuestro catálogo de productos y configurar tus preferencias de notificaciones para recibir las mejores ofertas.',
  ENTITY_TYPE: 'onboarding',
};
