import type {
  DateFilter,
  HelpfulFilter,
  ProductReviewFilters,
  ProductReviewsState,
  RatingFilter,
  ReviewDeleteReasonCode,
} from '../types/product-reviews.types';

export const PRODUCT_REVIEW_STRINGS = {
  sectionTitle: 'Reseñas del producto',
  averageLabel: 'Promedio',
  reviewsCountLabel: (count: number) =>
    `${count} ${count === 1 ? 'reseña' : 'reseñas'}`,
  noReviews: 'Este producto aún no tiene reseñas.',
  noReviewsForFilter: 'No hay reseñas que coincidan con los filtros seleccionados.',
  loading: 'Cargando reseñas...',
  loadError: 'No se pudieron cargar las reseñas. Intenta de nuevo.',
  editedTag: 'editada',
  filterLabel: 'Filtrar por',
  filters: {
    date: {
      label: 'Fecha',
      recent: 'Más recientes',
      oldest: 'Más antiguas',
    },
    rating: {
      label: 'Calificación',
      all: 'Todas',
      '5': '5 estrellas',
      '4': '4 estrellas',
      '3': '3 estrellas',
      '2': '2 estrellas',
      '1': '1 estrella',
    },
    helpful: {
      label: 'Utilidad',
      none: 'Sin ordenar',
      most_helpful: 'Más útiles',
    },
  },
  starsLabel: (n: number) => `${n} ${n === 1 ? 'estrella' : 'estrellas'}`,
  starsBarAriaLabel: (n: number, count: number, pct: number) =>
    `${n} ${n === 1 ? 'estrella' : 'estrellas'}: ${count} reseñas, ${pct}%`,
  reviewedOn: (fecha: string) => `Reseñado el ${fecha}`,
  response: {
    badge: 'Respuesta oficial de la tienda',
    respondedOn: (fecha: string) => `Respondido el ${fecha}`,
    editedTag: 'Editada',
    maxLength: 500,
    placeholder: 'Escribe la respuesta oficial de la tienda...',
    counter: (n: number, max: number) => `${n}/${max}`,
    actions: {
      respond: 'Responder',
      edit: 'Editar',
      delete: 'Eliminar',
      cancel: 'Cancelar',
      publish: 'Publicar respuesta',
      publishing: 'Publicando...',
      save: 'Guardar cambios',
      saving: 'Guardando...',
    },
    deleteConfirm: {
      title: 'Eliminar respuesta',
      message:
        '¿Seguro que deseas eliminar esta respuesta oficial? Esta acción no se puede deshacer.',
      confirm: 'Eliminar',
      cancel: 'Cancelar',
    },
  },
  // Moderación de reseñas: eliminación de la reseña de otro usuario (US-REV-006).
  moderation: {
    deleteAction: 'Eliminar reseña',
    deleting: 'Eliminando...',
    detailMaxLength: 500,
    remainingCounter: (remaining: number) =>
      `${remaining} ${remaining === 1 ? 'carácter restante' : 'caracteres restantes'}`,
    dialog: {
      title: 'Eliminar reseña',
      description:
        'Esta acción elimina la reseña de forma permanente, junto con sus votos y la respuesta del administrador. No se puede deshacer.',
      previewLabel: 'Reseña a eliminar',
      reasonLabel: 'Motivo de eliminación',
      reasonPlaceholder: 'Selecciona un motivo',
      detailLabel: 'Descripción adicional (opcional)',
      detailPlaceholder: 'Agrega detalles sobre el motivo de eliminación...',
      confirm: 'Eliminar reseña',
      cancel: 'Cancelar',
      genericError: 'No se pudo eliminar la reseña.',
    },
  },
} as const;

// Motivos predefinidos del diálogo de eliminación (US-REV-006).
export const REVIEW_DELETE_REASON_OPTIONS: {
  value: ReviewDeleteReasonCode;
  label: string;
}[] = [
  { value: 'contenido_ofensivo', label: 'Contenido ofensivo' },
  { value: 'spam', label: 'Spam' },
  { value: 'informacion_falsa', label: 'Información falsa' },
  { value: 'fuera_de_tema', label: 'Fuera de tema' },
  { value: 'otro', label: 'Otro' },
];

export const PRODUCT_REVIEW_DATE_FORMAT: {
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

export const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: 'recent', label: PRODUCT_REVIEW_STRINGS.filters.date.recent },
  { value: 'oldest', label: PRODUCT_REVIEW_STRINGS.filters.date.oldest },
];

export const RATING_OPTIONS: { value: RatingFilter; label: string }[] = [
  { value: 'all', label: PRODUCT_REVIEW_STRINGS.filters.rating.all },
  { value: '5', label: PRODUCT_REVIEW_STRINGS.filters.rating['5'] },
  { value: '4', label: PRODUCT_REVIEW_STRINGS.filters.rating['4'] },
  { value: '3', label: PRODUCT_REVIEW_STRINGS.filters.rating['3'] },
  { value: '2', label: PRODUCT_REVIEW_STRINGS.filters.rating['2'] },
  { value: '1', label: PRODUCT_REVIEW_STRINGS.filters.rating['1'] },
];

export const HELPFUL_OPTIONS: { value: HelpfulFilter; label: string }[] = [
  { value: 'none', label: PRODUCT_REVIEW_STRINGS.filters.helpful.none },
  { value: 'most_helpful', label: PRODUCT_REVIEW_STRINGS.filters.helpful.most_helpful },
];

export const SELECT_BASE =
  'rounded-md border border-foreground/15 bg-background px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50';

export const PRODUCT_REVIEWS_PAGE_SIZE = 5;

export const INITIAL_FILTERS: ProductReviewFilters = {
  date: 'recent',
  rating: 'all',
  helpful: 'none',
};

export const INITIAL_REVIEWS_STATE: ProductReviewsState = {
  reviews: [],
  summary: null,
  pagination: { page: 1, limit: PRODUCT_REVIEWS_PAGE_SIZE, total: 0 },
  myVotes: {},
  loading: false,
  error: null,
  filters: INITIAL_FILTERS,
};
