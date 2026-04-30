import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "containments_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"document_name" varchar NOT NULL,
  	"document_file_id" integer NOT NULL
  );
  
  CREATE TABLE "containments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "containments_id" integer;
  ALTER TABLE "containments_documents" ADD CONSTRAINT "containments_documents_document_file_id_media_id_fk" FOREIGN KEY ("document_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "containments_documents" ADD CONSTRAINT "containments_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."containments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "containments_documents_order_idx" ON "containments_documents" USING btree ("_order");
  CREATE INDEX "containments_documents_parent_id_idx" ON "containments_documents" USING btree ("_parent_id");
  CREATE INDEX "containments_documents_document_file_idx" ON "containments_documents" USING btree ("document_file_id");
  CREATE INDEX "containments_updated_at_idx" ON "containments" USING btree ("updated_at");
  CREATE INDEX "containments_created_at_idx" ON "containments" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_containments_fk" FOREIGN KEY ("containments_id") REFERENCES "public"."containments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_containments_id_idx" ON "payload_locked_documents_rels" USING btree ("containments_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "containments_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "containments" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "containments_documents" CASCADE;
  DROP TABLE "containments" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_containments_fk";
  
  DROP INDEX "payload_locked_documents_rels_containments_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "containments_id";`)
}
