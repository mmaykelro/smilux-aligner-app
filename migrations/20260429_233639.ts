import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "containments" ADD COLUMN "public_id" varchar;
  CREATE UNIQUE INDEX "containments_public_id_idx" ON "containments" USING btree ("public_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "containments_public_id_idx";
  ALTER TABLE "containments" DROP COLUMN "public_id";`)
}
