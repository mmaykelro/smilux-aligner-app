import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pre_payments_status" RENAME TO "enum_requests_pre_payments_status";
  ALTER TABLE "pre_payments" RENAME TO "requests_pre_payments";
  ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "pre_payments_id" TO "requests_pre_payments_id";
  ALTER TABLE "requests_pre_payments" DROP CONSTRAINT "pre_payments_customer_id_customers_id_fk";
  
  ALTER TABLE "requests_pre_payments" DROP CONSTRAINT "pre_payments_request_id_requests_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pre_payments_fk";
  
  DROP INDEX "pre_payments_customer_idx";
  DROP INDEX "pre_payments_request_idx";
  DROP INDEX "pre_payments_updated_at_idx";
  DROP INDEX "pre_payments_created_at_idx";
  DROP INDEX "payload_locked_documents_rels_pre_payments_id_idx";
  ALTER TABLE "requests_pre_payments" ADD CONSTRAINT "requests_pre_payments_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "requests_pre_payments" ADD CONSTRAINT "requests_pre_payments_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_requests_pre_payments_fk" FOREIGN KEY ("requests_pre_payments_id") REFERENCES "public"."requests_pre_payments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "requests_pre_payments_customer_idx" ON "requests_pre_payments" USING btree ("customer_id");
  CREATE INDEX "requests_pre_payments_request_idx" ON "requests_pre_payments" USING btree ("request_id");
  CREATE INDEX "requests_pre_payments_updated_at_idx" ON "requests_pre_payments" USING btree ("updated_at");
  CREATE INDEX "requests_pre_payments_created_at_idx" ON "requests_pre_payments" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_requests_pre_payments_id_idx" ON "payload_locked_documents_rels" USING btree ("requests_pre_payments_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_requests_pre_payments_status" RENAME TO "enum_pre_payments_status";
  ALTER TABLE "requests_pre_payments" RENAME TO "pre_payments";
  ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "requests_pre_payments_id" TO "pre_payments_id";
  ALTER TABLE "pre_payments" DROP CONSTRAINT "requests_pre_payments_customer_id_customers_id_fk";
  
  ALTER TABLE "pre_payments" DROP CONSTRAINT "requests_pre_payments_request_id_requests_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_requests_pre_payments_fk";
  
  DROP INDEX "requests_pre_payments_customer_idx";
  DROP INDEX "requests_pre_payments_request_idx";
  DROP INDEX "requests_pre_payments_updated_at_idx";
  DROP INDEX "requests_pre_payments_created_at_idx";
  DROP INDEX "payload_locked_documents_rels_requests_pre_payments_id_idx";
  ALTER TABLE "pre_payments" ADD CONSTRAINT "pre_payments_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pre_payments" ADD CONSTRAINT "pre_payments_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pre_payments_fk" FOREIGN KEY ("pre_payments_id") REFERENCES "public"."pre_payments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pre_payments_customer_idx" ON "pre_payments" USING btree ("customer_id");
  CREATE INDEX "pre_payments_request_idx" ON "pre_payments" USING btree ("request_id");
  CREATE INDEX "pre_payments_updated_at_idx" ON "pre_payments" USING btree ("updated_at");
  CREATE INDEX "pre_payments_created_at_idx" ON "pre_payments" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_pre_payments_id_idx" ON "payload_locked_documents_rels" USING btree ("pre_payments_id");`)
}
