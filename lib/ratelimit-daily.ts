/**
 * Daily usage tracking per device via Vercel Blob.
 *
 * Each device has one JSON file: ratelimit/{date}/{deviceId}.json
 * containing { count: number } — no cookies, no personal data.
 *
 * Falls back to in-memory when Blob is not configured.
 */

const BLOB_PREFIX = "ratelimit";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // "2026-06-29"
}

// In-memory fallback (resets on deploy)
const memCounters = new Map<string, number>();
let memLastDate = "";

/**
 * Return how many messages this device has sent today.
 */
export async function checkDailyLimit(deviceId: string): Promise<number> {
  // In-memory (always works — no network dependency)
  const date = todayKey();
  if (memLastDate !== date) {
    memCounters.clear();
    memLastDate = date;
  }
  return memCounters.get(deviceId) ?? 0;
}

/**
 * Increment usage count for this device.
 * Also persists to Vercel Blob when token is configured (best-effort).
 */
export async function recordDailyUsage(deviceId: string): Promise<void> {
  const date = todayKey();

  // In-memory (always works)
  if (memLastDate !== date) {
    memCounters.clear();
    memLastDate = date;
  }
  const current = memCounters.get(deviceId) ?? 0;
  memCounters.set(deviceId, current + 1);

  // Persistent storage (best-effort via Blob)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const path = `${BLOB_PREFIX}/${date}/${deviceId}.json`;
      await put(path, JSON.stringify({ count: current + 1 }), {
        contentType: "application/json",
        access: "private",
        addRandomSuffix: false,
      });
    } catch (err) {
      console.error("[ratelimit] Blob save failed:", err);
      // Non-blocking — in-memory still works
    }
  }
}
