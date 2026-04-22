-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'customization_in_progress';

-- CreateEnum
CREATE TYPE "OrderStatusNotificationDeliveryStatus" AS ENUM ('pending', 'sent', 'failed');

-- CreateTable
CREATE TABLE "order_status_notifications" (
    "id" BIGSERIAL NOT NULL,
    "order_id" BIGINT NOT NULL,
    "client_user_id" BIGINT NOT NULL,
    "previous_status" "OrderStatus",
    "new_status" "OrderStatus" NOT NULL,
    "changed_at" TIMESTAMP NOT NULL,
    "internal_notification_id" BIGINT,
    "delivery_status" "OrderStatusNotificationDeliveryStatus" NOT NULL DEFAULT 'pending',
    "delivery_attempts" SMALLINT NOT NULL DEFAULT 0,
    "delivery_last_error" TEXT,
    "delivered_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_status_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "order_status_notifications_order_id_changed_at_idx"
ON "order_status_notifications"("order_id", "changed_at");

-- CreateIndex
CREATE INDEX "order_status_notifications_client_user_id_changed_at_idx"
ON "order_status_notifications"("client_user_id", "changed_at");

-- AddForeignKey
ALTER TABLE "order_status_notifications"
ADD CONSTRAINT "order_status_notifications_order_id_fkey"
FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_status_notifications"
ADD CONSTRAINT "order_status_notifications_client_user_id_fkey"
FOREIGN KEY ("client_user_id") REFERENCES "client_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
