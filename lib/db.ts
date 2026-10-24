import { attachDatabasePool } from "@vercel/functions";
import { Pool } from "pg";

import { resolveDatabaseUrl } from "./database-url.ts";

type GlobalWithPool = typeof globalThis & {
  __lyraPgPool?: Pool;
};

const globalForDb = globalThis as GlobalWithPool;

export function getPool(): Pool {
  const connectionString = resolveDatabaseUrl();

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalForDb.__lyraPgPool) {
    const pool = new Pool({
      connectionString,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
    });

    pool.on("error", (error) => {
      console.error("[db] Idle PostgreSQL client error:", error.message);
    });

    if (process.env.VERCEL) {
      attachDatabasePool(pool);
    }

    globalForDb.__lyraPgPool = pool;
  }

  return globalForDb.__lyraPgPool;
}
