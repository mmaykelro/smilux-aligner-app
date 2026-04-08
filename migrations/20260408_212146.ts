import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pre_payments_status" AS ENUM('created', 'paid');
  CREATE TABLE "pre_payments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_id" integer NOT NULL,
  	"request_id" integer,
  	"status" "enum_pre_payments_status" DEFAULT 'created' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pre_payments_id" integer;
  ALTER TABLE "pre_payments" ADD CONSTRAINT "pre_payments_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pre_payments" ADD CONSTRAINT "pre_payments_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pre_payments_customer_idx" ON "pre_payments" USING btree ("customer_id");
  CREATE INDEX "pre_payments_request_idx" ON "pre_payments" USING btree ("request_id");
  CREATE INDEX "pre_payments_updated_at_idx" ON "pre_payments" USING btree ("updated_at");
  CREATE INDEX "pre_payments_created_at_idx" ON "pre_payments" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pre_payments_fk" FOREIGN KEY ("pre_payments_id") REFERENCES "public"."pre_payments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_pre_payments_id_idx" ON "payload_locked_documents_rels" USING btree ("pre_payments_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pre_payments" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pre_payments" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pre_payments_fk";
  
  DROP INDEX "payload_locked_documents_rels_pre_payments_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pre_payments_id";
  DROP TYPE "public"."enum_pre_payments_status";`)
}
