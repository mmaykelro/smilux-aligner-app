import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('ADMIN', 'CUSTOMER');
  CREATE TYPE "public"."enum_customers_clinical_preferences_elastic_positions" AS ENUM('18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28', '48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38');
  CREATE TYPE "public"."enum_customers_roles" AS ENUM('CUSTOMER');
  CREATE TYPE "public"."enum_customers_cro_state" AS ENUM('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO');
  CREATE TYPE "public"."enum_customers_address_state" AS ENUM('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO');
  CREATE TYPE "public"."enum_customers_clinical_preferences_passive_aligners" AS ENUM('sim_adicione', 'nao_mas_crie', 'nenhuma');
  CREATE TYPE "public"."enum_customers_clinical_preferences_delay_i_p_r_stage" AS ENUM('nao_atrase', 'estagio_1', 'estagio_2', 'estagio_3', 'estagio_4', 'estagio_5');
  CREATE TYPE "public"."enum_customers_clinical_preferences_delay_attachment_stage" AS ENUM('nao_atrase', 'estagio_1', 'estagio_2', 'estagio_3', 'estagio_4', 'estagio_5');
  CREATE TYPE "public"."enum_customers_clinical_preferences_incisal_leveling" AS ENUM('none', 'nivelar_borda', 'laterais_05mm', 'margem_gengival');
  CREATE TYPE "public"."enum_customers_clinical_preferences_elastic_chain" AS ENUM('nao', 'sim_3_3', 'sim_6_6');
  CREATE TYPE "public"."enum_customers_clinical_preferences_distalization_options" AS ENUM('sequencial_50', '2by2');
  CREATE TYPE "public"."enum_requests_upper_jaw_movement_restriction" AS ENUM('11', '12', '13', '14', '15', '16', '17', '18', '21', '22', '23', '24', '25', '26', '27');
  CREATE TYPE "public"."enum_requests_lower_jaw_movement_restriction" AS ENUM('31', '32', '33', '34', '35', '36', '37', '38', '41', '42', '43', '44', '45', '46', '47');
  CREATE TYPE "public"."enum_requests_upper_jaw_no_attachments" AS ENUM('11', '12', '13', '14', '15', '16', '17', '18', '21', '22', '23', '24', '25', '26', '27');
  CREATE TYPE "public"."enum_requests_lower_jaw_no_attachments" AS ENUM('31', '32', '33', '34', '35', '36', '37', '38', '41', '42', '43', '44', '45', '46', '47');
  CREATE TYPE "public"."enum_requests_arch_to_treat" AS ENUM('none', 'both', 'upper', 'lower');
  CREATE TYPE "public"."enum_requests_ap_relation_upper" AS ENUM('improve_canine', 'improve_canine_and_molar', 'improve_molar', 'none');
  CREATE TYPE "public"."enum_requests_ap_relation_lower" AS ENUM('improve_canine', 'improve_canine_and_molar', 'improve_molar', 'none');
  CREATE TYPE "public"."enum_requests_elastic_cutouts_canine_elastic" AS ENUM('right', 'left', 'both', 'none');
  CREATE TYPE "public"."enum_requests_elastic_cutouts_canine_button" AS ENUM('right', 'left', 'both', 'none');
  CREATE TYPE "public"."enum_requests_elastic_cutouts_molar_elastic" AS ENUM('right', 'left', 'both', 'none');
  CREATE TYPE "public"."enum_requests_elastic_cutouts_molar_button" AS ENUM('right', 'left', 'both', 'none');
  CREATE TYPE "public"."enum_requests_use_attachments" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_requests_perform_i_p_r" AS ENUM('yes', 'no', 'detail_below');
  CREATE TYPE "public"."enum_requests_status" AS ENUM('documentation_check', 'in_progress', 'completed');
  CREATE TYPE "public"."enum_requests_payment_status" AS ENUM('not_paid', 'paid');
  CREATE TYPE "public"."enum_requests_tracking_status" AS ENUM('not_sent', 'preparing', 'sent', 'delivered');
  CREATE TYPE "public"."enum_additional_aligners_aligner_type" AS ENUM('upper', 'lower');
  CREATE TYPE "public"."enum_additional_aligners_aligner_number" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26');
  CREATE TYPE "public"."enum_additional_aligners_status" AS ENUM('created', 'in_progress', 'completed');
  CREATE TYPE "public"."enum_additional_aligners_payment_status" AS ENUM('not_paid', 'paid');
  CREATE TYPE "public"."enum_additional_aligners_tracking_status" AS ENUM('not_sent', 'preparing', 'sent', 'delivered');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "customers_clinical_preferences_elastic_positions" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_customers_clinical_preferences_elastic_positions",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "customers_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_customers_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "customers_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"cpf" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"profile_image_id" integer,
  	"terms_acceptance_date" timestamp(3) with time zone,
  	"cro_number" varchar NOT NULL,
  	"cro_state" "enum_customers_cro_state" NOT NULL,
  	"address_postal_code" varchar NOT NULL,
  	"address_street" varchar NOT NULL,
  	"address_number" varchar NOT NULL,
  	"address_complement" varchar,
  	"address_neighborhood" varchar NOT NULL,
  	"address_city" varchar NOT NULL,
  	"address_state" "enum_customers_address_state" NOT NULL,
  	"clinical_preferences_passive_aligners" "enum_customers_clinical_preferences_passive_aligners",
  	"clinical_preferences_delay_i_p_r_stage" "enum_customers_clinical_preferences_delay_i_p_r_stage",
  	"clinical_preferences_max_i_p_r" varchar,
  	"clinical_preferences_delay_attachment_stage" "enum_customers_clinical_preferences_delay_attachment_stage",
  	"clinical_preferences_incisal_leveling" "enum_customers_clinical_preferences_incisal_leveling",
  	"clinical_preferences_elastic_chain" "enum_customers_clinical_preferences_elastic_chain",
  	"clinical_preferences_distalization_options" "enum_customers_clinical_preferences_distalization_options",
  	"clinical_preferences_special_instructions" varchar,
  	"is_active" boolean DEFAULT false,
  	"is_register_complete" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "customers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"requests_id" integer
  );
  
  CREATE TABLE "requests_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"document_name" varchar NOT NULL,
  	"document_file_id" integer NOT NULL
  );
  
  CREATE TABLE "requests_upper_jaw_movement_restriction" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_requests_upper_jaw_movement_restriction",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "requests_lower_jaw_movement_restriction" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_requests_lower_jaw_movement_restriction",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "requests_upper_jaw_no_attachments" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_requests_upper_jaw_no_attachments",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "requests_lower_jaw_no_attachments" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_requests_lower_jaw_no_attachments",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"public_id" varchar,
  	"title_for_list" varchar,
  	"order_id" numeric,
  	"completion_date" timestamp(3) with time zone,
  	"customer_id" integer NOT NULL,
  	"patient" varchar NOT NULL,
  	"additional_info" varchar,
  	"arch_to_treat" "enum_requests_arch_to_treat" NOT NULL,
  	"ap_relation_upper" "enum_requests_ap_relation_upper" DEFAULT 'none',
  	"ap_relation_lower" "enum_requests_ap_relation_lower" DEFAULT 'none',
  	"distalization_instructions" varchar,
  	"elastic_cutouts_canine_elastic" "enum_requests_elastic_cutouts_canine_elastic" DEFAULT 'none',
  	"elastic_cutouts_canine_button" "enum_requests_elastic_cutouts_canine_button" DEFAULT 'none',
  	"elastic_cutouts_molar_elastic" "enum_requests_elastic_cutouts_molar_elastic" DEFAULT 'none',
  	"elastic_cutouts_molar_button" "enum_requests_elastic_cutouts_molar_button" DEFAULT 'none',
  	"elastic_cutout_instructions" varchar,
  	"use_attachments" "enum_requests_use_attachments" NOT NULL,
  	"perform_i_p_r" "enum_requests_perform_i_p_r" NOT NULL,
  	"ipr_details" varchar,
  	"diastema_instructions" varchar,
  	"general_instructions" varchar,
  	"status" "enum_requests_status" DEFAULT 'documentation_check' NOT NULL,
  	"tracking_link" varchar,
  	"payment_status" "enum_requests_payment_status" DEFAULT 'not_paid' NOT NULL,
  	"payment_pix_url" varchar,
  	"payment_card_url" varchar,
  	"tracking_status" "enum_requests_tracking_status" DEFAULT 'not_sent' NOT NULL,
  	"tracking_carrier" varchar,
  	"tracking_tracking_code" varchar,
  	"tracking_tracking_url" varchar,
  	"tracking_sent_date" timestamp(3) with time zone,
  	"tracking_estimated_arrival" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "additional_aligners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"public_id" varchar,
  	"title_for_list" varchar,
  	"customer_id" integer NOT NULL,
  	"patient" varchar NOT NULL,
  	"aligner_type" "enum_additional_aligners_aligner_type" NOT NULL,
  	"aligner_number" "enum_additional_aligners_aligner_number",
  	"order_id" numeric,
  	"completion_date" timestamp(3) with time zone,
  	"status" "enum_additional_aligners_status" DEFAULT 'created' NOT NULL,
  	"payment_status" "enum_additional_aligners_payment_status" DEFAULT 'not_paid' NOT NULL,
  	"payment_pix_url" varchar,
  	"payment_card_url" varchar,
  	"tracking_status" "enum_additional_aligners_tracking_status" DEFAULT 'not_sent' NOT NULL,
  	"tracking_carrier" varchar,
  	"tracking_tracking_code" varchar,
  	"tracking_tracking_url" varchar,
  	"tracking_sent_date" timestamp(3) with time zone,
  	"tracking_estimated_arrival" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"customers_id" integer,
  	"requests_id" integer,
  	"additional_aligners_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"customers_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "terms_conditions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_terms" boolean DEFAULT false,
  	"content" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers_clinical_preferences_elastic_positions" ADD CONSTRAINT "customers_clinical_preferences_elastic_positions_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers_roles" ADD CONSTRAINT "customers_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers_sessions" ADD CONSTRAINT "customers_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers" ADD CONSTRAINT "customers_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customers_rels" ADD CONSTRAINT "customers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers_rels" ADD CONSTRAINT "customers_rels_requests_fk" FOREIGN KEY ("requests_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "requests_documents" ADD CONSTRAINT "requests_documents_document_file_id_media_id_fk" FOREIGN KEY ("document_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "requests_documents" ADD CONSTRAINT "requests_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "requests_upper_jaw_movement_restriction" ADD CONSTRAINT "requests_upper_jaw_movement_restriction_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "requests_lower_jaw_movement_restriction" ADD CONSTRAINT "requests_lower_jaw_movement_restriction_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "requests_upper_jaw_no_attachments" ADD CONSTRAINT "requests_upper_jaw_no_attachments_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "requests_lower_jaw_no_attachments" ADD CONSTRAINT "requests_lower_jaw_no_attachments_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "requests" ADD CONSTRAINT "requests_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "additional_aligners" ADD CONSTRAINT "additional_aligners_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_requests_fk" FOREIGN KEY ("requests_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_additional_aligners_fk" FOREIGN KEY ("additional_aligners_id") REFERENCES "public"."additional_aligners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "customers_clinical_preferences_elastic_positions_order_idx" ON "customers_clinical_preferences_elastic_positions" USING btree ("order");
  CREATE INDEX "customers_clinical_preferences_elastic_positions_parent_idx" ON "customers_clinical_preferences_elastic_positions" USING btree ("parent_id");
  CREATE INDEX "customers_roles_order_idx" ON "customers_roles" USING btree ("order");
  CREATE INDEX "customers_roles_parent_idx" ON "customers_roles" USING btree ("parent_id");
  CREATE INDEX "customers_sessions_order_idx" ON "customers_sessions" USING btree ("_order");
  CREATE INDEX "customers_sessions_parent_id_idx" ON "customers_sessions" USING btree ("_parent_id");
  CREATE INDEX "customers_profile_image_idx" ON "customers" USING btree ("profile_image_id");
  CREATE INDEX "customers_updated_at_idx" ON "customers" USING btree ("updated_at");
  CREATE INDEX "customers_created_at_idx" ON "customers" USING btree ("created_at");
  CREATE UNIQUE INDEX "customers_email_idx" ON "customers" USING btree ("email");
  CREATE INDEX "customers_rels_order_idx" ON "customers_rels" USING btree ("order");
  CREATE INDEX "customers_rels_parent_idx" ON "customers_rels" USING btree ("parent_id");
  CREATE INDEX "customers_rels_path_idx" ON "customers_rels" USING btree ("path");
  CREATE INDEX "customers_rels_requests_id_idx" ON "customers_rels" USING btree ("requests_id");
  CREATE INDEX "requests_documents_order_idx" ON "requests_documents" USING btree ("_order");
  CREATE INDEX "requests_documents_parent_id_idx" ON "requests_documents" USING btree ("_parent_id");
  CREATE INDEX "requests_documents_document_file_idx" ON "requests_documents" USING btree ("document_file_id");
  CREATE INDEX "requests_upper_jaw_movement_restriction_order_idx" ON "requests_upper_jaw_movement_restriction" USING btree ("order");
  CREATE INDEX "requests_upper_jaw_movement_restriction_parent_idx" ON "requests_upper_jaw_movement_restriction" USING btree ("parent_id");
  CREATE INDEX "requests_lower_jaw_movement_restriction_order_idx" ON "requests_lower_jaw_movement_restriction" USING btree ("order");
  CREATE INDEX "requests_lower_jaw_movement_restriction_parent_idx" ON "requests_lower_jaw_movement_restriction" USING btree ("parent_id");
  CREATE INDEX "requests_upper_jaw_no_attachments_order_idx" ON "requests_upper_jaw_no_attachments" USING btree ("order");
  CREATE INDEX "requests_upper_jaw_no_attachments_parent_idx" ON "requests_upper_jaw_no_attachments" USING btree ("parent_id");
  CREATE INDEX "requests_lower_jaw_no_attachments_order_idx" ON "requests_lower_jaw_no_attachments" USING btree ("order");
  CREATE INDEX "requests_lower_jaw_no_attachments_parent_idx" ON "requests_lower_jaw_no_attachments" USING btree ("parent_id");
  CREATE UNIQUE INDEX "requests_public_id_idx" ON "requests" USING btree ("public_id");
  CREATE UNIQUE INDEX "requests_order_id_idx" ON "requests" USING btree ("order_id");
  CREATE INDEX "requests_customer_idx" ON "requests" USING btree ("customer_id");
  CREATE INDEX "requests_updated_at_idx" ON "requests" USING btree ("updated_at");
  CREATE INDEX "requests_created_at_idx" ON "requests" USING btree ("created_at");
  CREATE UNIQUE INDEX "additional_aligners_public_id_idx" ON "additional_aligners" USING btree ("public_id");
  CREATE INDEX "additional_aligners_customer_idx" ON "additional_aligners" USING btree ("customer_id");
  CREATE UNIQUE INDEX "additional_aligners_order_id_idx" ON "additional_aligners" USING btree ("order_id");
  CREATE INDEX "additional_aligners_updated_at_idx" ON "additional_aligners" USING btree ("updated_at");
  CREATE INDEX "additional_aligners_created_at_idx" ON "additional_aligners" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("customers_id");
  CREATE INDEX "payload_locked_documents_rels_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("requests_id");
  CREATE INDEX "payload_locked_documents_rels_additional_aligners_id_idx" ON "payload_locked_documents_rels" USING btree ("additional_aligners_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_rels_customers_id_idx" ON "payload_preferences_rels" USING btree ("customers_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "customers_clinical_preferences_elastic_positions" CASCADE;
  DROP TABLE "customers_roles" CASCADE;
  DROP TABLE "customers_sessions" CASCADE;
  DROP TABLE "customers" CASCADE;
  DROP TABLE "customers_rels" CASCADE;
  DROP TABLE "requests_documents" CASCADE;
  DROP TABLE "requests_upper_jaw_movement_restriction" CASCADE;
  DROP TABLE "requests_lower_jaw_movement_restriction" CASCADE;
  DROP TABLE "requests_upper_jaw_no_attachments" CASCADE;
  DROP TABLE "requests_lower_jaw_no_attachments" CASCADE;
  DROP TABLE "requests" CASCADE;
  DROP TABLE "additional_aligners" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "terms_conditions" CASCADE;
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_customers_clinical_preferences_elastic_positions";
  DROP TYPE "public"."enum_customers_roles";
  DROP TYPE "public"."enum_customers_cro_state";
  DROP TYPE "public"."enum_customers_address_state";
  DROP TYPE "public"."enum_customers_clinical_preferences_passive_aligners";
  DROP TYPE "public"."enum_customers_clinical_preferences_delay_i_p_r_stage";
  DROP TYPE "public"."enum_customers_clinical_preferences_delay_attachment_stage";
  DROP TYPE "public"."enum_customers_clinical_preferences_incisal_leveling";
  DROP TYPE "public"."enum_customers_clinical_preferences_elastic_chain";
  DROP TYPE "public"."enum_customers_clinical_preferences_distalization_options";
  DROP TYPE "public"."enum_requests_upper_jaw_movement_restriction";
  DROP TYPE "public"."enum_requests_lower_jaw_movement_restriction";
  DROP TYPE "public"."enum_requests_upper_jaw_no_attachments";
  DROP TYPE "public"."enum_requests_lower_jaw_no_attachments";
  DROP TYPE "public"."enum_requests_arch_to_treat";
  DROP TYPE "public"."enum_requests_ap_relation_upper";
  DROP TYPE "public"."enum_requests_ap_relation_lower";
  DROP TYPE "public"."enum_requests_elastic_cutouts_canine_elastic";
  DROP TYPE "public"."enum_requests_elastic_cutouts_canine_button";
  DROP TYPE "public"."enum_requests_elastic_cutouts_molar_elastic";
  DROP TYPE "public"."enum_requests_elastic_cutouts_molar_button";
  DROP TYPE "public"."enum_requests_use_attachments";
  DROP TYPE "public"."enum_requests_perform_i_p_r";
  DROP TYPE "public"."enum_requests_status";
  DROP TYPE "public"."enum_requests_payment_status";
  DROP TYPE "public"."enum_requests_tracking_status";
  DROP TYPE "public"."enum_additional_aligners_aligner_type";
  DROP TYPE "public"."enum_additional_aligners_aligner_number";
  DROP TYPE "public"."enum_additional_aligners_status";
  DROP TYPE "public"."enum_additional_aligners_payment_status";
  DROP TYPE "public"."enum_additional_aligners_tracking_status";`)
}
