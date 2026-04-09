export const AUTH_MESSAGES = {
  REGISTRO_EXITOSO: 'Registro exitoso',
  CORREO_YA_REGISTRADO: 'Este correo electrónico ya está registrado',
  ERROR_AL_REGISTRAR: 'Error al registrar el usuario',
  INICIO_SESION_EXITOSO: 'Inicio de sesión exitoso',
  CREDENCIALES_INVALIDAS: 'Correo electrónico o contraseña incorrectos',
  CUENTA_INACTIVA: 'Tu cuenta está inactiva. Contacta al soporte.',
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
