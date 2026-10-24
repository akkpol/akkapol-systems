import { resolveDatabaseUrl, type DatabaseEnv } from "./database-url.ts";

type ChatConfigEnv = DatabaseEnv & {
  DEEPSEEK_API_KEY?: string;
  CHAT_SESSION_SECRET?: string;
  NODE_ENV?: string;
};

/**
 * Production chat requires the provider key, a stable session secret, and a
 * database connection for transcripts and rate limiting. Outside production we
 * allow missing secrets/DB so local development can use the memory fallback.
 */
export function isChatConfigured(env: ChatConfigEnv = process.env): boolean {
  if (!env.DEEPSEEK_API_KEY) return false;
  if (env.NODE_ENV === "production" && !env.CHAT_SESSION_SECRET) return false;
  if (env.NODE_ENV === "production" && !resolveDatabaseUrl(env)) return false;
  return true;
}
