import type {
  DateFilter,
  HelpfulFilter,
  ProductReviewFilters,
  ProductReviewsState,
  RatingFilter,
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
} as const;

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

export const INITIAL_FILTERS: ProductReviewFilters = {
  date: 'recent',
  rating: 'all',
  helpful: 'none',
};

export const INITIAL_REVIEWS_STATE: ProductReviewsState = {
  rawReviews: [],
  loading: false,
  error: null,
  filters: INITIAL_FILTERS,
};
