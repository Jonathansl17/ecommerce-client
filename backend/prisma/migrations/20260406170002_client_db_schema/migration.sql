/*
  Warnings:

  - The primary key for the `products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `client_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `clients` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `products` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('active', 'inactive', 'deleted');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('internal', 'email', 'both');

-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('active', 'abandoned', 'converted');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending_payment', 'confirmed', 'in_preparation', 'ready_shipment', 'shipped', 'in_transit', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('SINPE', 'cash', 'card', 'other');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'approved', 'rejected', 'voided');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('product');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('standard', 'custom');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('helpful', 'unhelpful');

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_client_id_fkey";

-- AlterTable
ALTER TABLE "products" DROP CONSTRAINT "products_pkey",
DROP COLUMN "client_id",
DROP COLUMN "created_at",
DROP COLUMN "id",
DROP COLUMN "name",
DROP COLUMN "price",
DROP COLUMN "stock",
DROP COLUMN "updated_at",
ADD COLUMN     "category_id" BIGINT NOT NULL,
ADD COLUMN     "image_url" VARCHAR(300) NOT NULL,
ADD COLUMN     "item_id" BIGINT NOT NULL,
ADD COLUMN     "type" "ProductType" NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ADD CONSTRAINT "products_pkey" PRIMARY KEY ("item_id");

-- DropTable
DROP TABLE "clients";

-- CreateTable
CREATE TABLE "client_users" (
    "id" BIGSERIAL NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "account_status" "AccountStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "client_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_recovery_tokens" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,
    "used_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_recovery_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_notifications" (
    "id" BIGSERIAL NOT NULL,
    "client_user_id" BIGINT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" BIGINT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "sent_at" TIMESTAMP,
    "send_attempts" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" BIGSERIAL NOT NULL,
    "client_user_id" BIGINT NOT NULL,
    "status" "CartStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" BIGSERIAL NOT NULL,
    "client_user_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" BIGSERIAL NOT NULL,
    "cart_id" BIGINT NOT NULL,
    "variant_id" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price_snap" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" BIGSERIAL NOT NULL,
    "client_user_id" BIGINT NOT NULL,
    "cart_id" BIGINT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending_payment',
    "subtotal" DECIMAL(10,2) NOT NULL,
    "taxes" DECIMAL(10,2) NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "shipping_address" VARCHAR(300) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" BIGSERIAL NOT NULL,
    "order_id" BIGINT NOT NULL,
    "variant_id" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price_snap" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" BIGSERIAL NOT NULL,
    "order_id" BIGINT NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "external_reference" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(80) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "item_type" "ItemType" NOT NULL,
    "status" "ItemStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "color" VARCHAR(50) NOT NULL,
    "size" VARCHAR(30) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "current_stock" INTEGER NOT NULL,
    "min_threshold" INTEGER NOT NULL,
    "reserved_stock" INTEGER NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings_summaries" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "average" DECIMAL(3,1) NOT NULL,
    "total_reviews" INTEGER NOT NULL,
    "stars_1" INTEGER NOT NULL,
    "stars_2" INTEGER NOT NULL,
    "stars_3" INTEGER NOT NULL,
    "stars_4" INTEGER NOT NULL,
    "stars_5" INTEGER NOT NULL,

    CONSTRAINT "ratings_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "client_user_id" BIGINT NOT NULL,
    "rating" SMALLINT NOT NULL,
    "comment" TEXT NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'pending',
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "helpful_votes" INTEGER NOT NULL DEFAULT 0,
    "unhelpful_votes" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_votes" (
    "id" BIGSERIAL NOT NULL,
    "review_id" BIGINT NOT NULL,
    "client_user_id" BIGINT NOT NULL,
    "vote_type" "VoteType" NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_users_email_key" ON "client_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_client_user_id_product_id_key" ON "favorites"("client_user_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_cart_id_key" ON "orders"("cart_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_summaries_product_id_key" ON "ratings_summaries"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_votes_review_id_client_user_id_key" ON "review_votes"("review_id", "client_user_id");

-- AddForeignKey
ALTER TABLE "client_recovery_tokens" ADD CONSTRAINT "client_recovery_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "client_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_notifications" ADD CONSTRAINT "client_notifications_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "client_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "client_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "client_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "client_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings_summaries" ADD CONSTRAINT "ratings_summaries_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "client_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_votes" ADD CONSTRAINT "review_votes_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_votes" ADD CONSTRAINT "review_votes_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "client_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
