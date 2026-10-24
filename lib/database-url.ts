export type DatabaseEnv = {
  DATABASE_URL?: string;
  POSTGRES_URL?: string;
  [key: string]: string | undefined;
};

export function resolveDatabaseUrl(env: DatabaseEnv = process.env): string | undefined {
  return env.DATABASE_URL || env.POSTGRES_URL || undefined;
}
