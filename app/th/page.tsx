import type { Metadata } from "next";

import { AkkapolPortfolioPage } from "@/app/_components/home/AkkapolPortfolioPage";

const thaiTitle = "Akkapol Kumpapug | นักสร้างระบบ AI เชิงปฏิบัติ";
const thaiDescription =
  "โปรไฟล์ของ Akkapol Kumpapug สำหรับเว็บไซต์ธุรกิจ ระบบ Workflow เครื่องมือ AI และระบบปฏิบัติการที่ใช้งานจริงสำหรับ SME.";

export const metadata: Metadata = {
  title: {
    absolute: thaiTitle,
  },
  description: thaiDescription,
  alternates: {
    canonical: "/th",
    languages: {
      en: "/",
      th: "/th",
    },
  },
  openGraph: {
    url: "/th",
    title: thaiTitle,
    description: thaiDescription,
  },
  twitter: {
    title: thaiTitle,
    description: thaiDescription,
  },
};

export default function ThaiHome() {
  return <AkkapolPortfolioPage locale="th" />;
}
