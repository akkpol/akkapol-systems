import { readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const { Client } = pg;

const connectionString =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

if (!connectionString) {
  console.error(
    "DATABASE_URL_UNPOOLED, DATABASE_URL, or POSTGRES_URL is required to run the Neon migration.",
  );
  process.exit(1);
}

const schemaPath = join(process.cwd(), "db", "schema.sql");
const schema = readFileSync(schemaPath, "utf8");
const client = new Client({ connectionString });

try {
  await client.connect();
  await client.query(schema);
  const { rows } = await client.query(
    "select table_name from information_schema.tables " +
      "where table_schema = 'public' " +
      "and table_name in ('chat_transcripts', 'rate_limits') " +
      "order by table_name",
  );
  const names = rows.map((row) => row.table_name);
  console.log("Neon schema ready:", names.join(", "));
} catch (error) {
  console.error(
    "Neon migration failed:",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
