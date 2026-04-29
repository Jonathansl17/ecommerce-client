import { ProductReviewsSection } from '@/features/reviews/public/components/ProductReviewsSection';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <ProductReviewsSection productId={id} />
    </main>
  );
}
