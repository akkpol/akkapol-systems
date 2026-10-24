POST /api/chat
==============

Streams a response from Lyra and, after completion, stores the private chat
record and any structured lead data. Browser requests must be same-origin.

### Request

Content type: `application/json`

```json
{
  "messages": [
    {
      "id": "message-id",
      "role": "user",
      "parts": [{ "type": "text", "text": "สนใจระบบ workflow" }]
    }
  ],
  "deviceId": "random-browser-device-id",
  "sessionId": "server-issued-session-id",
  "sessionToken": "server-issued-session-token"
}
```

- `messages` is required and accepts 1–20 messages.
- The browser client sends the most recent 16 messages and stays within the
  12,000-character budget; the server still enforces 20 messages as a hard cap.
- Only `user` and `assistant` roles with plain-text parts are accepted.
- Each text part is limited to 2,000 characters; all parts together are limited
  to 12,000 characters.
- The complete request body is limited to 64 KiB using the bytes read from the
  request stream, independent of `Content-Length`.
- `deviceId` is optional and is used only when the hosting platform does not
  provide a trusted client IP.
- `sessionId` and `sessionToken` are optional on the first request. The client
  must reuse the values issued in the response headers; caller-selected session
  IDs are not trusted without a valid server signature.

### Success response

- `200 OK`
- Body: AI SDK UI message stream (`text/event-stream`)
- `X-Chat-Session-Id`: server-issued chat session ID
- `X-Chat-Session-Token`: signed session capability. Production requires
  `CHAT_SESSION_SECRET`; when it is missing the endpoint returns `503`.

### Error responses

- `400 Bad Request`: malformed JSON, invalid fields, unsupported roles, or
  non-text message parts.
- `403 Forbidden`: browser `Origin` does not match the request host.
- `413 Payload Too Large`: request, message count, or text limits are exceeded.
- `429 Too Many Requests`: per-client limit of 30 requests per day or global
  budget of 500 requests per day is exhausted.
- `503 Service Unavailable`: the AI provider is not configured, the production
  session secret is missing, or the Neon Postgres rate-limit store is
  unavailable.

Errors use a JSON body shaped as `{ "error": "user-safe message" }`. Provider
stream errors are converted to a generic user-safe message and do not expose
upstream details.

### Stored transcript

After the stream finishes, the server appends one row to the private
`chat_transcripts` table in Neon Postgres. The row contains the latest request
window, finish reason, and token usage. Rows are append-only, so earlier
requests remain available for review. Transcripts created in Vercel Blob before
the Neon cutover are not imported. Structured lead fields are written to Google
Sheets separately.

### Production requirements

- `DEEPSEEK_API_KEY`
- `DATABASE_URL` (injected by the Neon Vercel integration)
- `CHAT_SESSION_SECRET` (generate a long random value and keep it server-side)
- Optional Google Sheets variables listed in [`.env.example`](../.env.example)

Remote file downloads are disabled. Raw transcripts remain private in Neon
Postgres; only structured lead fields are sent to Google Sheets when configured.
