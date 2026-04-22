export const REVIEW_LIMITS = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  MIN_COMMENT: 10,
  MAX_COMMENT: 1000,
} as const;

export const REVIEW_STRINGS = {
  pageTitle: 'Mis reseñas',
  pageSubtitle:
    'Comparte tu experiencia con los productos que has comprado y ayuda a otros usuarios a decidir.',
  loading: 'Cargando tus productos comprados...',
  loadError: 'No se pudieron cargar tus productos comprados',
  empty: 'Aún no tienes productos comprados para reseñar.',
  verifiedBadge: 'Compra verificada',
  writeReview: 'Escribir reseña',
  editReview: 'Editar reseña',
  cancel: 'Cancelar',
  submit: 'Publicar reseña',
  submitting: 'Publicando...',
  update: 'Guardar cambios',
  updating: 'Guardando...',
  ratingLabel: 'Calificación',
  ratingAriaLabel: (value: number) => `${value} ${value === 1 ? 'estrella' : 'estrellas'}`,
  commentLabel: 'Comentario',
  commentPlaceholder: 'Cuéntanos tu experiencia con este producto...',
  purchasedOn: (fecha: string) => `Comprado el ${fecha}`,
  reviewedOn: (fecha: string) => `Reseñado el ${fecha}`,
  unverifiedBuyer:
    'Solo los compradores verificados pueden dejar reseñas de este producto.',
  successPublished: '¡Tu reseña se publicó correctamente!',
  successUpdated: '¡Tu reseña se actualizó correctamente!',
  closeToast: 'Cerrar notificación',
  counter: (actual: number, max: number) => `${actual}/${max}`,
  validation: {
    ratingRequired: 'Debes seleccionar una calificación.',
    commentRequired: 'El comentario es obligatorio.',
    commentMin: `El comentario debe tener al menos ${REVIEW_LIMITS.MIN_COMMENT} caracteres.`,
    commentMax: `El comentario no puede superar los ${REVIEW_LIMITS.MAX_COMMENT} caracteres.`,
  },
  errors: {
    submitFailed: 'No se pudo publicar tu reseña. Intenta de nuevo.',
    updateFailed: 'No se pudo actualizar tu reseña. Intenta de nuevo.',
  },
} as const;

export const REVIEW_DATE_FORMAT: {
  LOCALE: string;
  OPTIONS: Intl.DateTimeFormatOptions;
} = {
  LOCALE: 'es-CR',
  OPTIONS: {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
};

export const TOAST_AUTO_DISMISS_MS = 4000;
