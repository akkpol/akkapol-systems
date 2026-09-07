## Akkapol Systems

Personal systems portfolio for Akkapol Kumpapug, built with Next.js 16 and deployed on Vercel.

## Getting Started

Run the development server:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site locally.

Primary routes:

- `/` portfolio homepage
- `/cv` recruiter-ready CV view
- `/privacy` and `/th/privacy`
- `/api/chat` Lyra streaming chat endpoint
- `/robots.txt`
- `/sitemap.xml`

Production target: [https://akkapol-systems.vercel.app](https://akkapol-systems.vercel.app)

Before submitting changes, run:

```bash
npm run lint
npm run test:security
npm run build
```

GitHub Actions runs the same checks for pushes to `main` and pull requests.
See [Lyra Chat API](docs/chat-api.md) and the
[operations runbook](docs/operations-runbook.md) for request limits,
environment variables, release checks, and incident handling.

## AI Chat Leads in Google Sheets

Lyra keeps raw chat transcripts in private Vercel Blob storage and writes only
structured leads to a private Google Sheet. A lead is created when a user shares
contact details or states explicit hiring intent. Later messages from the same
chat update that row without overwriting the operator-managed `status`,
`follow_up_at`, or `notes` fields.

Production setup:

1. Enable the Google Sheets API in a Google Cloud project.
2. Create a service account and a JSON key.
3. Share the lead spreadsheet with the service account email as an Editor.
4. Add `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SHEETS_CLIENT_EMAIL`, and
   `GOOGLE_SHEETS_PRIVATE_KEY` to the Vercel project environment.
5. Configure `DEEPSEEK_API_KEY`, `BLOB_READ_WRITE_TOKEN`, and a long random
   `CHAT_SESSION_SECRET` for the chat endpoint.
6. Redeploy the application.

Keep the private key server-side. Never prefix these variables with
`NEXT_PUBLIC_` or commit the service-account JSON file.
