export const REVIEW_LIMITS = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  MIN_COMMENT: 10,
  MAX_COMMENT: 1000,
} as const;

export const PURCHASED_PRODUCTS_PAGE_SIZE = 5;

export const REVIEW_STRINGS = {
  pageTitle: 'Mis reseñas',
  pageSubtitle:
    'Comparte tu experiencia con los productos que has comprado y ayuda a otros usuarios a decidir.',
  loading: 'Cargando tus productos comprados...',
  loadError: 'No se pudieron cargar tus productos comprados',
  empty: 'Aún no tienes productos comprados para reseñar.',
  profileEmpty: 'Aún no has publicado ninguna reseña.',
  verifiedBadge: 'Compra verificada',
  editedTag: 'editada',
  pendingModeration: 'Pendiente de moderación',
  helpfulLabel: 'Útil',
  unhelpfulLabel: 'No útil',
  helpfulAriaLabel: (count: number) =>
    `${count} ${count === 1 ? 'voto útil' : 'votos útiles'}`,
  unhelpfulAriaLabel: (count: number) =>
    `${count} ${count === 1 ? 'voto no útil' : 'votos no útiles'}`,
  writeReview: 'Escribir reseña',
  editReview: 'Editar reseña',
  deleteReview: 'Eliminar reseña',
  deleting: 'Eliminando...',
  deleteDialogTitle: 'Eliminar reseña',
  deleteDialogMessage:
    '¿Estás seguro que deseas eliminar esta reseña? Esta acción no se puede deshacer.',
  deleteDialogConfirm: 'Eliminar',
  deleteDialogCancel: 'Cancelar',
  successDeleted: 'Tu reseña fue eliminada correctamente.',
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
    deleteFailed: 'No se pudo eliminar tu reseña. Intenta de nuevo.',
    deleteNotFound: 'La reseña ya no existe.',
    notOwner: 'No puedes modificar una reseña que no te pertenece.',
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
