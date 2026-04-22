import type { AuthUser } from '@/features/auth/types/auth.types';
import type { ProductReview } from '../types/reviews.types';

export const REVIEWS_MOCK = {
  enabled: true,
  user: {
    id: 'mock-user-demo',
    fullName: 'Usuario Demo',
    email: 'demo@ecommerce.local',
    accountStatus: 'active',
  } satisfies AuthUser,
} as const;

export const MOCK_SEEDED_REVIEWS: ProductReview[] = [
  {
    id: 'rev-mock-prod-001',
    productId: 'prod-001',
    clientUserId: REVIEWS_MOCK.user.id,
    clientUserName: REVIEWS_MOCK.user.fullName,
    rating: 5,
    comment:
      'Excelente calidad del cuero, el acabado es impecable y el tamaño es perfecto para usar todos los días. Totalmente recomendado.',
    status: 'approved',
    edited: false,
    helpfulVotes: 12,
    unhelpfulVotes: 1,
    createdAt: '2026-03-18T14:30:00.000Z',
    updatedAt: '2026-03-18T14:30:00.000Z',
  },
  {
    id: 'rev-mock-prod-003',
    productId: 'prod-003',
    clientUserId: REVIEWS_MOCK.user.id,
    clientUserName: REVIEWS_MOCK.user.fullName,
    rating: 4,
    comment:
      'Muy bonito el collar, las piedras tienen un tono natural muy atractivo. El cierre podría ser un poco más firme, pero la calidad general es buena.',
    status: 'approved',
    edited: false,
    helpfulVotes: 5,
    unhelpfulVotes: 0,
    createdAt: '2026-01-15T10:12:00.000Z',
    updatedAt: '2026-01-15T10:12:00.000Z',
  },
];
