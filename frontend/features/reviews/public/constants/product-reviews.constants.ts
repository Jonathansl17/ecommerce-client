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
