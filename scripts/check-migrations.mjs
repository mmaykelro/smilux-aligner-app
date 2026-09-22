// Fails the build if `payload migrate` silently skipped pending migrations.
//
// `payload migrate` prompts interactively when it finds a `batch = -1` row in
// `payload_migrations` (left over from dev-mode `push`). In CI there's no TTY
// to answer that prompt, so it exits 0 without applying anything — the build
// goes green while the database schema stays out of date. This script checks
// that every migration file actually has a matching row in the DB and fails
// loudly (non-zero exit) if not, instead of deploying silently against a
// stale schema.
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pg from 'pg'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const migrationsDir = path.resolve(dirname, '../migrations')

const migrationNames = readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
  .map((file) => file.replace(/\.ts$/, ''))

const client = new pg.Client({ connectionString: process.env.POSTGRES_URL })
await client.connect()

const { rows } = await client.query('SELECT name, batch FROM payload_migrations')
await client.end()

const appliedNames = new Set(rows.map((row) => row.name))
const missing = migrationNames.filter((name) => !appliedNames.has(name))
const devPushMarker = rows.find((row) => Number(row.batch) === -1)

if (missing.length > 0) {
  console.error(
    `\n[check-migrations] ${missing.length} migration(s) were NOT applied to the database:\n` +
      missing.map((name) => `  - ${name}`).join('\n') +
      (devPushMarker
        ? '\n\nA `batch = -1` row (dev-mode push marker) is present in payload_migrations. ' +
          '`payload migrate` prompts interactively when it sees this, which silently no-ops in CI. ' +
          'Run `npx payload migrate` by hand from an interactive terminal against this database, ' +
          'confirm the prompt, then delete that row: DELETE FROM payload_migrations WHERE batch = -1;'
        : '') +
      '\n',
  )
  process.exit(1)
}

console.log(`[check-migrations] All ${migrationNames.length} migrations are applied.`)
