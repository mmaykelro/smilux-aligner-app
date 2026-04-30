import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "containments" ADD COLUMN "customer_id" integer NOT NULL;
  ALTER TABLE "containments" ADD CONSTRAINT "containments_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "containments_customer_idx" ON "containments" USING btree ("customer_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "containments" DROP CONSTRAINT "containments_customer_id_customers_id_fk";
  
  DROP INDEX "containments_customer_idx";
  ALTER TABLE "containments" DROP COLUMN "customer_id";`)
}
