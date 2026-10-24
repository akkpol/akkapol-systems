import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Markdown } from "@/app/blog/_components/Markdown";
import { formatBlogDate, getPostBySlug, listPosts, type BlogPost } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

// Only posts present at build time are generated. A new file requires the
// next rebuild/redeploy; unknown slugs return 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return listPosts().map((post) => ({ slug: post.slug }));
}

function buildExcerpt(post: BlogPost): string {
  if (post.description) return post.description;

  const plain = post.body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`[\]()!~-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plain) return `A working note by Akkapol Kumpapug: ${post.title}.`;
  return plain.length > 160 ? `${plain.slice(0, 157).trimEnd()}…` : plain;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  const description = buildExcerpt(post);
  const url = `/blog/${post.slug}`;

  return {
    title: post.title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      siteName: "Akkapol Systems",
      title: post.title,
      description,
      publishedTime: post.date,
      authors: ["Akkapol Kumpapug"],
      tags: post.tags,
    },
    twitter: {
      card: "summary",
      title: post.title,
      description,
    },
  };
}

function PostTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Tags">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-[var(--ak-border-subtle)] bg-[var(--ak-surface-secondary)] px-3 py-1 text-xs ak-text-muted"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="ak-theme-shell" data-locale="en" lang="en">
      <div className="ak-section-frame flex flex-wrap items-center gap-x-3 gap-y-2 pb-0 pt-8 md:pt-10">
        <Link
          href="/"
          className="ak-focus-ring group inline-flex items-center gap-2 rounded-full border border-[var(--ak-border-strong)] bg-[var(--ak-surface-panel)] px-4 py-2 text-sm font-medium ak-text-body transition hover:border-[var(--ak-color-accent)] hover:text-[var(--ak-color-accent-text)]"
        >
          <span aria-hidden="true" className="transition group-hover:-translate-x-0.5">
            ←
          </span>
          <span>Home</span>
        </Link>
        <Link
          href="/blog"
          className="ak-focus-ring inline-flex items-center gap-2 rounded-full border border-[var(--ak-border-subtle)] px-4 py-2 text-sm font-medium ak-text-muted transition hover:border-[var(--ak-color-accent)] hover:text-[var(--ak-color-accent-text)]"
        >
          Writing
        </Link>
      </div>

      <article className="ak-section-frame pt-10 md:pt-14">
        <div className="mx-auto max-w-[720px]">
          <header>
            <p className="ak-type-label ak-text-accent">Writing</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight ak-text-primary sm:text-4xl">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
              <time dateTime={post.date} className="ak-type-label ak-text-muted">
                {formatBlogDate(post.date)}
              </time>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--ak-color-subtle)]" />
              <span className="ak-type-label ak-text-subtle">{post.readingMinutes} min read</span>
              {post.source === "dsh" ? (
                <>
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--ak-color-subtle)]" />
                  <span className="ak-type-label ak-text-subtle">AI-assisted</span>
                </>
              ) : null}
            </div>

            {post.description ? (
              <p className="ak-type-body-lg ak-text-muted mt-6">{post.description}</p>
            ) : null}

            <div className="mt-6">
              <PostTags tags={post.tags} />
            </div>

            <hr className="mt-9 border-t border-[var(--ak-border-subtle)]" />
          </header>

          <div className="mt-8">
            <Markdown source={post.body} />
          </div>

          <footer className="mt-14 border-t border-[var(--ak-border-subtle)] pt-8">
            {post.source === "dsh" ? (
              <p className="ak-type-body-sm ak-text-muted">
                This note was drafted from a working session with an AI assistant
                and published through the site&apos;s DSH blog writer.
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/blog" className="ak-action ak-action-secondary ak-focus-ring">
                All writing
              </Link>
              <Link href="/" className="ak-action ak-action-secondary ak-focus-ring">
                Back to home
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </main>
  );
}
