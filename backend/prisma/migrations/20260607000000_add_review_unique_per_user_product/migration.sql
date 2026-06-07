-- Deduplicate first: keep the most recent review per (user, product) before adding the unique constraint.
-- Without this, the ALTER TABLE fails if any duplicate pairs exist in production data.
DELETE FROM reviews
WHERE id NOT IN (
  SELECT DISTINCT ON (client_user_id, product_id) id
  FROM reviews
  ORDER BY client_user_id, product_id, created_at DESC
);

-- AddUniqueConstraint: prevent duplicate reviews per user per product (TOCTOU fix)
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_client_user_id_product_id_key" UNIQUE ("client_user_id", "product_id");
