import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/app/_components/SiteHeader";
import { ScrollProgress } from "@/app/_components/HomeMotion";
import { Markdown } from "@/app/blog/_components/Markdown";
import { NoteCard, NoteTags } from "@/app/blog/_components/NoteCard";
import {
  collectBlogOutline,
  formatBlogDate,
  getAdjacentPosts,
  getPostBySlug,
  getRelatedPosts,
  listPosts,
  parseMarkdown,
  toBlogCardData,
  type BlogPost,
} from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

const siteUrl = "https://akkapol-systems.vercel.app";

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
  const imageUrl = post.image ? `${siteUrl}${post.image}` : undefined;
  const imageAlt = post.imageAlt ?? post.title;

  return {
    title: post.title,
    description,
    keywords: post.tags,
    alternates: {
      canonical: url,
      languages: {
        en: url,
      },
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
      ...(imageUrl
        ? { images: [{ url: imageUrl, width: 1200, height: 630, alt: imageAlt }] }
        : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: post.title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

function AdjacentNote({
  direction,
  post,
}: {
  direction: "newer" | "older";
  post: BlogPost;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="ak-surface ak-surface-compact ak-focus-ring group flex flex-col gap-2"
    >
      <span className="ak-type-label ak-text-subtle">
        {direction === "newer" ? "Newer note" : "Older note"}
      </span>
      <span className="ak-type-title-card ak-text-primary transition group-hover:text-[var(--ak-color-accent-text)]">
        {post.title}
      </span>
      <span className="ak-type-label ak-text-muted">{formatBlogDate(post.date)}</span>
    </Link>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const posts = listPosts();
  const { newer, older } = getAdjacentPosts(posts, post.slug);
  const related = getRelatedPosts(posts, post.slug);
  const outline = collectBlogOutline(parseMarkdown(post.body));
  const description = buildExcerpt(post);
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "en",
    keywords: post.tags.join(", "),
    ...(post.image ? { image: [`${siteUrl}${post.image}`] } : {}),
    url: postUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    author: { "@type": "Person", name: "Akkapol Kumpapug", url: siteUrl },
    publisher: { "@type": "Organization", name: "Akkapol Systems", url: siteUrl },
  };

  return (
    <main id="top" className="ak-theme-shell" data-locale="en" lang="en">
      <ScrollProgress />
      <SiteHeader current="blog" />

      <article className="ak-section-frame">
        <div className="mx-auto max-w-[760px] pt-4 md:pt-6">
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
              <NoteTags tags={post.tags} />
            </div>

            <hr className="mt-9 border-t border-[var(--ak-border-subtle)]" />
          </header>

          {post.image ? (
            <figure className="ak-surface ak-surface-strong mt-8 overflow-hidden">
              <Image
                src={post.image}
                alt={post.imageAlt ?? post.title}
                width={1200}
                height={630}
                className="h-auto w-full"
                priority
                sizes="(max-width: 760px) 100vw, 760px"
              />
            </figure>
          ) : null}

          {outline.length >= 2 ? (
            <nav
              aria-labelledby="post-outline-title"
              className="ak-surface ak-surface-compact mt-8"
            >
              <p id="post-outline-title" className="ak-type-label ak-text-muted">
                On this page
              </p>
              <ol className="mt-3 space-y-2">
                {outline.map((entry) => (
                  <li key={entry.id} className={entry.level >= 3 ? "pl-4" : undefined}>
                    <a
                      href={`#${entry.id}`}
                      className="ak-type-body-sm ak-text-muted rounded transition hover:text-[var(--ak-color-accent-text)] ak-focus-ring"
                    >
                      {entry.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          <div className="mt-8">
            <Markdown source={post.body} />
          </div>

          <footer className="mt-14 border-t border-[var(--ak-border-subtle)] pt-8">
            <p className="ak-type-body-sm ak-text-muted">
              Written by <span className="ak-text-body">Akkapol Kumpapug</span> · Published{" "}
              {formatBlogDate(post.date)}
            </p>

            {post.source === "dsh" ? (
              <p className="ak-type-body-sm ak-text-muted mt-2">
                This note was drafted from a working session with an AI assistant
                and published through the site&apos;s DSH blog writer.
              </p>
            ) : null}

            {newer || older ? (
              <nav aria-label="More notes" className="mt-8 grid gap-4 sm:grid-cols-2">
                {newer ? <AdjacentNote direction="newer" post={newer} /> : null}
                {older ? <AdjacentNote direction="older" post={older} /> : null}
              </nav>
            ) : null}

            {related.length > 0 ? (
              <section className="mt-10">
                <p className="ak-type-label ak-text-accent">Related notes</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {related.map((item) => (
                    <NoteCard key={item.slug} note={toBlogCardData(item)} />
                  ))}
                </div>
              </section>
            ) : null}

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/blog" className="ak-action ak-action-secondary ak-focus-ring">
                All writing
              </Link>
              <Link href="/" className="ak-action ak-action-secondary ak-focus-ring">
                Back to home
              </Link>
              <a href="mailto:akkapol.kumpapug@gmail.com" className="ak-action ak-action-primary ak-focus-ring">
                Start a conversation
              </a>
            </div>

            <p className="mt-8">
              <a href="#top" className="ak-type-label ak-text-subtle ak-focus-ring rounded transition hover:text-[var(--ak-color-accent-text)]">
                Back to top ↑
              </a>
            </p>
          </footer>
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
