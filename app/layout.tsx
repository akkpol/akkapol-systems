import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { LocaleDocumentSync } from "@/app/_components/LocaleDocumentSync";
import "./globals.css";

const siteUrl = new URL("https://akkapol-systems.vercel.app");
const siteTitle = "Akkapol Kumpapug | Creative AI Systems Builder";
const siteDescription =
  "Portfolio for Akkapol Kumpapug, a Creative AI Systems Builder focused on practical websites, workflow systems, AI-assisted tools, and real business operations.";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lineSeedSansThai = localFont({
  variable: "--font-line-seed-thai",
  display: "swap",
  src: [
    {
      path: "./fonts/line-seed-sans-th/LINESeedSansTH_W_Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/line-seed-sans-th/LINESeedSansTH_W_Bd.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

const themeBootScript = `
(() => {
  try {
    const params = new URLSearchParams(window.location.search);
    const queryTheme = params.get("theme");
    const savedTheme = window.localStorage.getItem("ak-theme");
    const theme = queryTheme === "light" || queryTheme === "dark"
      ? queryTheme
      : savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : "dark";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.documentElement.lang = window.location.pathname.startsWith("/th") ? "th" : "en";
  } catch {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.lang = window.location.pathname.startsWith("/th") ? "th" : "en";
  }
})();
`;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteTitle,
    template: "%s | Akkapol Kumpapug",
  },
  description: siteDescription,
  applicationName: "Akkapol Systems",
  authors: [{ name: "Akkapol Kumpapug", url: siteUrl }],
  creator: "Akkapol Kumpapug",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      th: "/th",
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Akkapol Systems",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/images/akkapol-cv-portrait-2026.png",
        width: 1200,
        height: 1500,
        alt: "Akkapol Kumpapug profile portrait",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/images/akkapol-cv-portrait-2026.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${lineSeedSansThai.variable} h-full antialiased`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <LocaleDocumentSync />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
