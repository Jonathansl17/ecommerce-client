/*
  Warnings:

  - Made the column `admin_user_id` on table `review_responses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "review_responses" ALTER COLUMN "admin_user_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "admins" (
    "id" BIGSERIAL NOT NULL,
    "client_user_id" BIGINT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_client_user_id_key" ON "admins"("client_user_id");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "client_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_responses" ADD CONSTRAINT "review_responses_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "client_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
