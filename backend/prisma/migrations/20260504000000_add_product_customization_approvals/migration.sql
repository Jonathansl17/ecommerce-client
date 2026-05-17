-- CreateEnum
CREATE TYPE "ProductCustomizationApprovalStatus" AS ENUM ('pending', 'approved', 'adjustments_requested', 'auto_approved');

-- CreateTable
CREATE TABLE "product_customization_approvals" (
    "id" BIGSERIAL NOT NULL,
    "order_id" BIGINT NOT NULL,
    "client_user_id" BIGINT NOT NULL,
    "status" "ProductCustomizationApprovalStatus" NOT NULL DEFAULT 'pending',
    "adjustment_notes" TEXT,
    "notified_at" TIMESTAMP NOT NULL,
    "responded_at" TIMESTAMP,
    "auto_approved_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "product_customization_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_customization_approvals_order_id_idx" ON "product_customization_approvals"("order_id");

-- CreateIndex
CREATE INDEX "product_customization_approvals_client_user_id_status_idx" ON "product_customization_approvals"("client_user_id", "status");

-- AddForeignKey
ALTER TABLE "product_customization_approvals" ADD CONSTRAINT "product_customization_approvals_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_customization_approvals" ADD CONSTRAINT "product_customization_approvals_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "client_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
