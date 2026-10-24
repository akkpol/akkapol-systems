type ChatConfigEnv = {
  DEEPSEEK_API_KEY?: string;
  CHAT_SESSION_SECRET?: string;
  NODE_ENV?: string;
};

/**
 * Production chat requires a stable session secret so signed sessions and lead
 * deduplication keep working. Outside production we allow a missing secret so
 * local development can run without a full environment.
 */
export function isChatConfigured(env: ChatConfigEnv = process.env): boolean {
  if (!env.DEEPSEEK_API_KEY) return false;
  if (env.NODE_ENV === "production" && !env.CHAT_SESSION_SECRET) return false;
  return true;
}
