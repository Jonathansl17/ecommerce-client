-- CreateTable
CREATE TABLE "review_responses" (
    "id" BIGSERIAL NOT NULL,
    "review_id" BIGINT NOT NULL,
    "admin_user_id" BIGINT,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "review_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "review_responses_review_id_key" ON "review_responses"("review_id");

-- AddForeignKey
ALTER TABLE "review_responses" ADD CONSTRAINT "review_responses_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
