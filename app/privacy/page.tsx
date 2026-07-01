import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Akkapol Kumpapug",
  description:
    "Privacy Policy for akkapol-systems.vercel.app — how we collect, use, and protect your data.",
};

const sections = [
  {
    title: "1. Data We Collect",
    content: (
      <ul className="space-y-2">
        <li>
          <strong>Chat messages</strong> — When you use the AI chat on this site,
          your messages are saved to help Akkapol follow up on inquiries (lead
          management). These are stored privately via Vercel Blob.
        </li>
        <li>
          <strong>Abuse-prevention identifier</strong> — We use an anonymous
          browser-generated ID and limited request metadata (such as network or
          browser signals) to rate-limit the chat and reduce abuse. We do not
          use this for advertising or profile building.
        </li>
        <li>
          <strong>Page views</strong> — We use Vercel Analytics to count visits
          and see general traffic patterns. No personal data is collected.
        </li>
        <li>
          <strong>Theme preference</strong> — Your dark/light mode choice is
          saved in your browser&apos;s localStorage. It never leaves your device.
        </li>
      </ul>
    ),
  },
  {
    title: "2. How We Use Your Data",
    content: (
      <ul className="space-y-2">
        <li>Chat messages are reviewed to respond to inquiries and improve services.</li>
        <li>Analytics data helps us understand which parts of the site are useful.</li>
        <li>We do <strong>not</strong> sell, share, or use your data for advertising.</li>
      </ul>
    ),
  },
  {
    title: "3. Data Storage & Retention",
    content: (
      <ul className="space-y-2">
        <li>
          Chat records are stored in <strong>Vercel Blob</strong> (private,
          access-controlled object storage on AWS in the US region).
        </li>
        <li>
          We retain chat data only as long as needed for follow-up and review.
          Automated retention cleanup is not yet enabled in this repository, so
          you can request deletion at any time.
        </li>
        <li>
          Rate-limit counters reset daily and are not linked to any identity.
        </li>
      </ul>
    ),
  },
  {
    title: "4. Your Rights (PDPA / GDPR)",
    content: (
      <ul className="space-y-2">
        <li>
          <strong>Access</strong> — You can request what data we hold about you.
        </li>
        <li>
          <strong>Deletion</strong> — You can request your data be erased at any
          time.
        </li>
        <li>
          <strong>Withdraw consent</strong> — You can stop using the chat at any
          point; no further data will be collected.
        </li>
        <li>
          To exercise these rights, contact Akkapol at{` `}
          <a href="mailto:hi@akkapol.com" className="text-amber-200 hover:text-amber-100 underline">
            hi@akkapol.com
          </a>.
        </li>
      </ul>
    ),
  },
  {
    title: "5. Third-Party Services",
    content: (
      <ul className="space-y-2">
        <li>
          <strong>Vercel</strong> — Hosting and analytics. See{` `}
          <a
            href="https://vercel.com/legal/privacy"
            target="_blank"
            rel="noreferrer"
            className="text-amber-200 hover:text-amber-100 underline"
          >
            Vercel Privacy Policy
          </a>.
        </li>
        <li>
          <strong>Deepseek</strong> — AI model provider for the chat feature.
          Message text is processed by Deepseek APIs. See{` `}
          <a
            href="https://www.deepseek.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="text-amber-200 hover:text-amber-100 underline"
          >
            Deepseek Privacy Policy
          </a>.
        </li>
        <li>
          We do <strong>not</strong> use advertising networks, social media
          pixels, or third-party trackers.
        </li>
      </ul>
    ),
  },
  {
    title: "6. Cookies",
    content: (
      <p>
        This site does <strong>not</strong> use tracking cookies. The AI chat
        and theme preference use browser localStorage only — no cookies are sent
        to servers. Vercel Analytics uses a minimal beacon that does not identify
        individual users.
      </p>
    ),
  },
  {
    title: "7. Changes to This Policy",
    content: (
      <p>
        We may update this policy as the site evolves. The latest version is
        always available at this URL. Continued use after changes means you
        accept the updated policy.
      </p>
    ),
    last: true,
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#070707] px-4 py-8 text-zinc-100">
      <div className="mx-auto mb-6 max-w-[720px]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-amber-300/40 hover:bg-white/[0.07] hover:text-amber-200"
        >
          <span aria-hidden="true">←</span>
          <span>Back to Home</span>
        </Link>
      </div>

      <article className="mx-auto max-w-[720px] rounded-lg border border-white/10 bg-zinc-950 p-8 shadow-2xl shadow-black/50 sm:p-10">
        <header className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
            Privacy Policy
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
            How Your Data Is Handled
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Last updated: June 29, 2026
          </p>
        </header>

        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-4 text-lg font-semibold text-white">
                {section.title}
              </h2>
              <div className="text-sm leading-7 text-zinc-300 [&_strong]:text-zinc-100">
                {section.content}
              </div>
              {!section.last && (
                <hr className="mt-6 border-t border-white/10" />
              )}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
