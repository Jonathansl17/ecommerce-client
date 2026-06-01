export const REVIEWS_MESSAGES = {
  GET_BY_PRODUCT_FAILED: 'Error al obtener las reseñas del producto',
  INVALID_PRODUCT_ID: 'El identificador del producto no es válido',
  INVALID_REVIEW_ID: 'El identificador de la reseña no es válido',
  CREATE_FAILED: 'Error al crear la reseña',
  UPDATE_FAILED: 'Error al actualizar la reseña',
  DELETE_FAILED: 'Error al eliminar la reseña',
  NOT_FOUND: 'Reseña no encontrada',
  ALREADY_EXISTS: 'Ya publicaste una reseña para este producto',
  NOT_PURCHASED: 'Solo compradores verificados pueden dejar reseñas',
  NOT_OWNER: 'No tienes permiso para modificar esta reseña',
  CREATED_SUCCESS: 'Reseña publicada correctamente',
  UPDATED_SUCCESS: 'Reseña actualizada correctamente',
  DELETED_SUCCESS: 'Reseña eliminada correctamente',
  MODERATION_DELETED_SUCCESS: 'Reseña eliminada por moderación',
  DELETE_REASON_REQUIRED: 'Debes seleccionar un motivo de eliminación',
  DELETE_DETAIL_TOO_LONG: 'La descripción no puede superar los 500 caracteres',
  VOTE_INVALID_TYPE: 'Tipo de voto inválido',
  VOTE_OWN_REVIEW: 'No puedes votar tu propia reseña',
  VOTE_NOT_FOUND: 'No tienes un voto registrado en esta reseña',
  VOTE_REGISTERED: 'Voto registrado',
  VOTE_REMOVED: 'Voto retirado',
  RESPONSE_ALREADY_EXISTS: 'Esta reseña ya tiene una respuesta del administrador',
  RESPONSE_NOT_FOUND: 'Esta reseña no tiene una respuesta del administrador',
  RESPONSE_CREATED: 'Respuesta publicada correctamente',
  RESPONSE_UPDATED: 'Respuesta actualizada correctamente',
  RESPONSE_DELETED: 'Respuesta eliminada correctamente',
};

export const REVIEW_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const VOTE_TYPES = {
  HELPFUL: 'helpful',
  UNHELPFUL: 'unhelpful',
};

// Estado de orden que habilita al cliente a reseñar el producto comprado.
export const COMPLETED_ORDER_STATUS = 'delivered';

export const REVIEW_LIMITS = {
  RATING_MIN: 1,
  RATING_MAX: 5,
  COMMENT_MIN: 10,
  COMMENT_MAX: 1000,
};

export const REVIEW_RESPONSE_LIMITS = {
  CONTENT_MIN: 1,
  CONTENT_MAX: 500,
};

// Motivos predefinidos que el moderador debe seleccionar al eliminar una reseña
// ajena (US-REV-006). 'otro' admite una descripción adicional opcional.
export const REVIEW_DELETE_REASON_CODES = [
  'contenido_ofensivo',
  'spam',
  'informacion_falsa',
  'fuera_de_tema',
  'otro',
];

export const REVIEW_DELETE_LIMITS = {
  DETAIL_MAX: 500,
};
