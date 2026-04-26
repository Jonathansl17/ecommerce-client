export const PROFILE_STRINGS = {
  page: {
    title: 'Mi Perfil',
    subtitle: 'Información de tu cuenta',
    loadingText: 'Cargando...',
    loadingProfileText: 'Cargando perfil...',
    supportMessage: 'Para cambiar tu información personal o contraseña, utiliza los botones a continuación.',
  },
  sections: {
    email: {
      label: 'Correo electrónico',
    },
    createdAt: {
      label: 'Cuenta creada el',
    },
    userId: {
      label: 'ID de usuario',
    },
    status: {
      label: 'Estado',
    },
  },
  dropdown: {
    ariaLabel: 'Abrir menú de perfil',
    myProfile: 'Mi Perfil',
    logout: 'Cerrar sesión',
  },
  editButtons: {
    editProfile: 'Editar Perfil',
    changePassword: 'Cambiar Contraseña',
  },
  dangerZone: {
    title: 'Zona de peligro',
    description: 'Esta acción es irreversible. Tu cuenta quedará desactivada de forma inmediata.',
    deactivateButton: 'Desactivar cuenta',
  },
  deactivateDialog: {
    title: 'Desactivar cuenta',
    step1Title: '¿Desactivar tu cuenta?',
    step1Warning: 'Antes de continuar, ten en cuenta lo siguiente:',
    consequences: [
      'Tu sesión se cerrará inmediatamente.',
      'No podrás iniciar sesión hasta que un administrador reactive tu cuenta.',
      'Tu historial de pedidos e información se conservarán.',
    ],
    step2Title: 'Confirmar desactivación',
    step2Description: 'Ingresa tu contraseña para confirmar esta acción.',
    passwordLabel: 'Contraseña actual',
    passwordPlaceholder: '••••••••',
    cancel: 'Cancelar',
    back: 'Atrás',
    continue: 'Continuar',
    confirm: 'Desactivar mi cuenta',
    confirming: 'Desactivando...',
    successTitle: '¡Cuenta desactivada!',
    successMessage: 'Tu cuenta ha sido desactivada. Cerrando sesión...',
  },
  editDialog: {
    title: 'Editar Perfil',
    fullNameLabel: 'Nombre completo',
    emailLabel: 'Correo electrónico',
    passwordLabel: 'Contraseña actual (requerida)',
    passwordPlaceholder: '••••••••',
    passwordHint: 'Necesaria para confirmar cualquier cambio.',
    successMessage: 'Perfil actualizado correctamente',
    cancel: 'Cancelar',
    save: 'Guardar cambios',
    saving: 'Guardando...',
  },
  passwordDialog: {
    title: 'Cambiar Contraseña',
    currentPasswordLabel: 'Contraseña actual',
    newPasswordLabel: 'Nueva contraseña',
    confirmPasswordLabel: 'Confirmar nueva contraseña',
    passwordPlaceholder: '••••••••',
    cancel: 'Cancelar',
    change: 'Cambiar contraseña',
    changing: 'Cambiando...',
    passwordMismatch: 'Las contraseñas no coinciden',
    requirements: {
      minLength: 'Al menos 8 caracteres',
      uppercase: 'Al menos una letra mayúscula',
      lowercase: 'Al menos una letra minúscula',
      number: 'Al menos un número',
    },
  },
};

export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export const PROFILE_AVATAR_SIZE = {
  detail: {
    width: 16,
    height: 16,
    className: 'h-16 w-16 text-xl',
  },
  dropdown: {
    width: 9,
    height: 9,
    className: 'h-9 w-9 text-sm',
  },
};

export const UNAVAILABLE_TEXT = 'No disponible';
