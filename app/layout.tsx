import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = new URL("https://akkapol-systems.vercel.app");
const siteTitle = "Akkapol Kumpapug | AI Systems Builder";
const siteDescription =
  "Portfolio for Akkapol Kumpapug, an AI systems builder focused on workflow design, operational automation, and production-ready web systems.";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  } catch {
    document.documentElement.dataset.theme = "dark";
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
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Akkapol Systems",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/images/akkapol-profile-2026.png",
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
    images: ["/images/akkapol-profile-2026.png"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
