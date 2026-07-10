import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_refinements_upper_jaw_movement_restriction" AS ENUM('11', '12', '13', '14', '15', '16', '17', '18', '21', '22', '23', '24', '25', '26', '27');
  CREATE TYPE "public"."enum_refinements_lower_jaw_movement_restriction" AS ENUM('31', '32', '33', '34', '35', '36', '37', '38', '41', '42', '43', '44', '45', '46', '47');
  CREATE TYPE "public"."enum_refinements_upper_jaw_no_attachments" AS ENUM('11', '12', '13', '14', '15', '16', '17', '18', '21', '22', '23', '24', '25', '26', '27');
  CREATE TYPE "public"."enum_refinements_lower_jaw_no_attachments" AS ENUM('31', '32', '33', '34', '35', '36', '37', '38', '41', '42', '43', '44', '45', '46', '47');
  CREATE TYPE "public"."enum_refinements_arch_to_treat" AS ENUM('none', 'both', 'upper', 'lower');
  CREATE TYPE "public"."enum_refinements_ap_relation_upper" AS ENUM('improve_canine', 'improve_canine_and_molar', 'improve_molar', 'none');
  CREATE TYPE "public"."enum_refinements_ap_relation_lower" AS ENUM('improve_canine', 'improve_canine_and_molar', 'improve_molar', 'none');
  CREATE TYPE "public"."enum_refinements_elastic_cutouts_canine_elastic" AS ENUM('right', 'left', 'both', 'none');
  CREATE TYPE "public"."enum_refinements_elastic_cutouts_canine_button" AS ENUM('right', 'left', 'both', 'none');
  CREATE TYPE "public"."enum_refinements_elastic_cutouts_molar_elastic" AS ENUM('right', 'left', 'both', 'none');
  CREATE TYPE "public"."enum_refinements_elastic_cutouts_molar_button" AS ENUM('right', 'left', 'both', 'none');
  CREATE TYPE "public"."enum_refinements_use_attachments" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_refinements_perform_i_p_r" AS ENUM('yes', 'no', 'detail_below');
  CREATE TYPE "public"."enum_refinements_status" AS ENUM('documentation_check', 'in_progress', 'completed');
  CREATE TYPE "public"."enum_refinements_payment_status" AS ENUM('not_paid', 'paid');
  CREATE TYPE "public"."enum_refinements_tracking_status" AS ENUM('not_sent', 'preparing', 'sent', 'delivered');
  CREATE TABLE "refinements_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"document_name" varchar NOT NULL,
  	"document_file_id" integer NOT NULL
  );
  
  CREATE TABLE "refinements_upper_jaw_movement_restriction" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_refinements_upper_jaw_movement_restriction",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "refinements_lower_jaw_movement_restriction" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_refinements_lower_jaw_movement_restriction",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "refinements_upper_jaw_no_attachments" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_refinements_upper_jaw_no_attachments",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "refinements_lower_jaw_no_attachments" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_refinements_lower_jaw_no_attachments",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "refinements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"public_id" varchar,
  	"title_for_list" varchar,
  	"order_id" numeric,
  	"completion_date" timestamp(3) with time zone,
  	"customer_id" integer NOT NULL,
  	"request_id" integer NOT NULL,
  	"patient" varchar NOT NULL,
  	"additional_info" varchar,
  	"arch_to_treat" "enum_refinements_arch_to_treat" NOT NULL,
  	"ap_relation_upper" "enum_refinements_ap_relation_upper" DEFAULT 'none',
  	"ap_relation_lower" "enum_refinements_ap_relation_lower" DEFAULT 'none',
  	"distalization_instructions" varchar,
  	"elastic_cutouts_canine_elastic" "enum_refinements_elastic_cutouts_canine_elastic" DEFAULT 'none',
  	"elastic_cutouts_canine_button" "enum_refinements_elastic_cutouts_canine_button" DEFAULT 'none',
  	"elastic_cutouts_molar_elastic" "enum_refinements_elastic_cutouts_molar_elastic" DEFAULT 'none',
  	"elastic_cutouts_molar_button" "enum_refinements_elastic_cutouts_molar_button" DEFAULT 'none',
  	"elastic_cutout_instructions" varchar,
  	"use_attachments" "enum_refinements_use_attachments" NOT NULL,
  	"perform_i_p_r" "enum_refinements_perform_i_p_r" NOT NULL,
  	"ipr_details" varchar,
  	"diastema_instructions" varchar,
  	"general_instructions" varchar,
  	"status" "enum_refinements_status" DEFAULT 'documentation_check' NOT NULL,
  	"tracking_link" varchar,
  	"payment_status" "enum_refinements_payment_status" DEFAULT 'not_paid' NOT NULL,
  	"payment_pix_url" varchar,
  	"payment_card_url" varchar,
  	"tracking_status" "enum_refinements_tracking_status" DEFAULT 'not_sent' NOT NULL,
  	"tracking_carrier" varchar,
  	"tracking_tracking_code" varchar,
  	"tracking_tracking_url" varchar,
  	"tracking_sent_date" timestamp(3) with time zone,
  	"tracking_estimated_arrival" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "requests_pre_payments" ADD COLUMN "refinement_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "refinements_id" integer;
  ALTER TABLE "refinements_documents" ADD CONSTRAINT "refinements_documents_document_file_id_media_id_fk" FOREIGN KEY ("document_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "refinements_documents" ADD CONSTRAINT "refinements_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."refinements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "refinements_upper_jaw_movement_restriction" ADD CONSTRAINT "refinements_upper_jaw_movement_restriction_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."refinements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "refinements_lower_jaw_movement_restriction" ADD CONSTRAINT "refinements_lower_jaw_movement_restriction_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."refinements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "refinements_upper_jaw_no_attachments" ADD CONSTRAINT "refinements_upper_jaw_no_attachments_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."refinements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "refinements_lower_jaw_no_attachments" ADD CONSTRAINT "refinements_lower_jaw_no_attachments_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."refinements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "refinements" ADD CONSTRAINT "refinements_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "refinements" ADD CONSTRAINT "refinements_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "refinements_documents_order_idx" ON "refinements_documents" USING btree ("_order");
  CREATE INDEX "refinements_documents_parent_id_idx" ON "refinements_documents" USING btree ("_parent_id");
  CREATE INDEX "refinements_documents_document_file_idx" ON "refinements_documents" USING btree ("document_file_id");
  CREATE INDEX "refinements_upper_jaw_movement_restriction_order_idx" ON "refinements_upper_jaw_movement_restriction" USING btree ("order");
  CREATE INDEX "refinements_upper_jaw_movement_restriction_parent_idx" ON "refinements_upper_jaw_movement_restriction" USING btree ("parent_id");
  CREATE INDEX "refinements_lower_jaw_movement_restriction_order_idx" ON "refinements_lower_jaw_movement_restriction" USING btree ("order");
  CREATE INDEX "refinements_lower_jaw_movement_restriction_parent_idx" ON "refinements_lower_jaw_movement_restriction" USING btree ("parent_id");
  CREATE INDEX "refinements_upper_jaw_no_attachments_order_idx" ON "refinements_upper_jaw_no_attachments" USING btree ("order");
  CREATE INDEX "refinements_upper_jaw_no_attachments_parent_idx" ON "refinements_upper_jaw_no_attachments" USING btree ("parent_id");
  CREATE INDEX "refinements_lower_jaw_no_attachments_order_idx" ON "refinements_lower_jaw_no_attachments" USING btree ("order");
  CREATE INDEX "refinements_lower_jaw_no_attachments_parent_idx" ON "refinements_lower_jaw_no_attachments" USING btree ("parent_id");
  CREATE UNIQUE INDEX "refinements_public_id_idx" ON "refinements" USING btree ("public_id");
  CREATE UNIQUE INDEX "refinements_order_id_idx" ON "refinements" USING btree ("order_id");
  CREATE INDEX "refinements_customer_idx" ON "refinements" USING btree ("customer_id");
  CREATE INDEX "refinements_request_idx" ON "refinements" USING btree ("request_id");
  CREATE INDEX "refinements_updated_at_idx" ON "refinements" USING btree ("updated_at");
  CREATE INDEX "refinements_created_at_idx" ON "refinements" USING btree ("created_at");
  ALTER TABLE "requests_pre_payments" ADD CONSTRAINT "requests_pre_payments_refinement_id_refinements_id_fk" FOREIGN KEY ("refinement_id") REFERENCES "public"."refinements"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_refinements_fk" FOREIGN KEY ("refinements_id") REFERENCES "public"."refinements"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "requests_pre_payments_refinement_idx" ON "requests_pre_payments" USING btree ("refinement_id");
  CREATE INDEX "payload_locked_documents_rels_refinements_id_idx" ON "payload_locked_documents_rels" USING btree ("refinements_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "refinements_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "refinements_upper_jaw_movement_restriction" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "refinements_lower_jaw_movement_restriction" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "refinements_upper_jaw_no_attachments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "refinements_lower_jaw_no_attachments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "refinements" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "refinements_documents" CASCADE;
  DROP TABLE "refinements_upper_jaw_movement_restriction" CASCADE;
  DROP TABLE "refinements_lower_jaw_movement_restriction" CASCADE;
  DROP TABLE "refinements_upper_jaw_no_attachments" CASCADE;
  DROP TABLE "refinements_lower_jaw_no_attachments" CASCADE;
  DROP TABLE "refinements" CASCADE;
  ALTER TABLE "requests_pre_payments" DROP CONSTRAINT "requests_pre_payments_refinement_id_refinements_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_refinements_fk";
  
  DROP INDEX "requests_pre_payments_refinement_idx";
  DROP INDEX "payload_locked_documents_rels_refinements_id_idx";
  ALTER TABLE "requests_pre_payments" DROP COLUMN "refinement_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "refinements_id";
  DROP TYPE "public"."enum_refinements_upper_jaw_movement_restriction";
  DROP TYPE "public"."enum_refinements_lower_jaw_movement_restriction";
  DROP TYPE "public"."enum_refinements_upper_jaw_no_attachments";
  DROP TYPE "public"."enum_refinements_lower_jaw_no_attachments";
  DROP TYPE "public"."enum_refinements_arch_to_treat";
  DROP TYPE "public"."enum_refinements_ap_relation_upper";
  DROP TYPE "public"."enum_refinements_ap_relation_lower";
  DROP TYPE "public"."enum_refinements_elastic_cutouts_canine_elastic";
  DROP TYPE "public"."enum_refinements_elastic_cutouts_canine_button";
  DROP TYPE "public"."enum_refinements_elastic_cutouts_molar_elastic";
  DROP TYPE "public"."enum_refinements_elastic_cutouts_molar_button";
  DROP TYPE "public"."enum_refinements_use_attachments";
  DROP TYPE "public"."enum_refinements_perform_i_p_r";
  DROP TYPE "public"."enum_refinements_status";
  DROP TYPE "public"."enum_refinements_payment_status";
  DROP TYPE "public"."enum_refinements_tracking_status";`)
}
