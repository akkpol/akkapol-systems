# Neon database

The Lyra chat stores new transcripts and daily rate-limit counters in Neon
Postgres. Existing data in Vercel Blob is not imported.

## Schema

Apply `db/schema.sql` to the Neon branch used by production:

~~~bash
npm run db:migrate
~~~

The script prefers `DATABASE_URL_UNPOOLED`, then `DATABASE_URL`, then
`POSTGRES_URL`. It is idempotent and safe to run again.

## Branches

- Production deployments use the Neon production branch.
- Preview deployments use a Neon branch created from the project's default
  branch. Apply the schema to the default/production branch before creating a
  preview deployment so its branch inherits the tables.
- If the production branch differs from the default branch, run the migration
  against both branches.

The local directory is linked through `.neon` and environment variables are
pulled into `.env`. Both files are local-only and must not be committed.

## No data migration

No Blob transcript is read or copied into these tables. The tables start empty,
and the old Blob objects are left untouched for manual cleanup.
