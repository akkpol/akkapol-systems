# Operations Runbook

## Before a release

1. Run `npm ci`, `npm run lint`, `npm run test:security`, `npm run build`,
   and `npm run test:metadata`. Run `npm run db:migrate` when the Neon schema
   changed.
2. Confirm the production environment contains `DEEPSEEK_API_KEY`,
   `DATABASE_URL`, and `CHAT_SESSION_SECRET`. A missing secret or database
   makes the chat endpoint return `503` instead of issuing unstable sessions.
3. If Google Sheets lead capture is enabled, confirm the spreadsheet is shared
   with the service account and all three Google variables are present.
4. Use a preview deployment to test the English and Thai home pages, `/cv`,
   `/privacy`, `/th/privacy`, and Lyra on desktop and mobile.
5. Do not promote the release if the chat endpoint returns `503`, CI is red, or
   the privacy links and CV download do not work.

## Lyra returns `503`

1. Check whether `DEEPSEEK_API_KEY`, `DATABASE_URL`, and
   `CHAT_SESSION_SECRET` are present in the affected Vercel environment.
2. Review function logs for `[ratelimit] Neon rate limit is unavailable`.
3. Check the Neon project status, branch, and connection limit without printing
   secrets.
4. Check the DeepSeek provider status and credentials without printing secrets.
5. Keep the email fallback visible while the chat is unavailable.

## Lyra returns `429`

1. Check whether the per-client daily limit or the global daily budget was hit.
2. Do not increase limits until usage and cost are reviewed.
3. The counters reset on the next UTC date.

## Leads do not appear in Google Sheets

1. Confirm the three Google environment variables are configured.
2. Confirm the service-account email still has Editor access to the sheet.
3. Review logs for Google authorization or Sheets request status errors.
4. Chat streaming should remain available; lead export failures are logged and
   do not interrupt the visitor response.

## Chat transcripts look incomplete

1. Each transcript is a rolling window of the most recent client request (up
   to 16 messages), stored as an append-only row in Neon `chat_transcripts`.
   Older messages are not appended to that row.
2. Confirm `DATABASE_URL` is set. A missing database skips transcript storage
   in development; in production the chat endpoint fails closed.
3. Review function logs for `[chat] Transcript save failed`.
4. Transcripts created in Vercel Blob before the Neon cutover are not imported;
   they remain in the old Blob store for manual cleanup.

## Rollback

Use Vercel deployment history to promote the last known-good deployment. Then
verify the main routes and Lyra fallback before closing the incident.
