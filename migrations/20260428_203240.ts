import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_containments_status" AS ENUM('created', 'in_progress', 'completed');
  CREATE TYPE "public"."enum_containments_payment_status" AS ENUM('not_paid', 'paid');
  CREATE TYPE "public"."enum_containments_tracking_status" AS ENUM('not_sent', 'preparing', 'sent', 'delivered');
  ALTER TABLE "containments" ADD COLUMN "patient" varchar;
  ALTER TABLE "containments" ADD COLUMN "order_id" numeric;
  ALTER TABLE "containments" ADD COLUMN "completion_date" timestamp(3) with time zone;
  ALTER TABLE "containments" ADD COLUMN "status" "enum_containments_status" DEFAULT 'created' NOT NULL;
  ALTER TABLE "containments" ADD COLUMN "payment_status" "enum_containments_payment_status" DEFAULT 'not_paid' NOT NULL;
  ALTER TABLE "containments" ADD COLUMN "payment_pix_url" varchar;
  ALTER TABLE "containments" ADD COLUMN "payment_card_url" varchar;
  ALTER TABLE "containments" ADD COLUMN "tracking_status" "enum_containments_tracking_status" DEFAULT 'not_sent' NOT NULL;
  ALTER TABLE "containments" ADD COLUMN "tracking_carrier" varchar;
  ALTER TABLE "containments" ADD COLUMN "tracking_tracking_code" varchar;
  ALTER TABLE "containments" ADD COLUMN "tracking_tracking_url" varchar;
  ALTER TABLE "containments" ADD COLUMN "tracking_sent_date" timestamp(3) with time zone;
  ALTER TABLE "containments" ADD COLUMN "tracking_estimated_arrival" timestamp(3) with time zone;
  CREATE UNIQUE INDEX "containments_order_id_idx" ON "containments" USING btree ("order_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "containments_order_id_idx";
  ALTER TABLE "containments" DROP COLUMN "patient";
  ALTER TABLE "containments" DROP COLUMN "order_id";
  ALTER TABLE "containments" DROP COLUMN "completion_date";
  ALTER TABLE "containments" DROP COLUMN "status";
  ALTER TABLE "containments" DROP COLUMN "payment_status";
  ALTER TABLE "containments" DROP COLUMN "payment_pix_url";
  ALTER TABLE "containments" DROP COLUMN "payment_card_url";
  ALTER TABLE "containments" DROP COLUMN "tracking_status";
  ALTER TABLE "containments" DROP COLUMN "tracking_carrier";
  ALTER TABLE "containments" DROP COLUMN "tracking_tracking_code";
  ALTER TABLE "containments" DROP COLUMN "tracking_tracking_url";
  ALTER TABLE "containments" DROP COLUMN "tracking_sent_date";
  ALTER TABLE "containments" DROP COLUMN "tracking_estimated_arrival";
  DROP TYPE "public"."enum_containments_status";
  DROP TYPE "public"."enum_containments_payment_status";
  DROP TYPE "public"."enum_containments_tracking_status";`)
}
