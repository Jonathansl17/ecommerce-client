-- AddUniqueConstraint: prevent duplicate reviews per user per product (TOCTOU fix)
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_client_user_id_product_id_key" UNIQUE ("client_user_id", "product_id");
