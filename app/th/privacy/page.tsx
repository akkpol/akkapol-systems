import Link from "next/link";

export const metadata = {
  title: "นโยบายความเป็นส่วนตัว | Akkapol Kumpapug",
  description:
    "นโยบายความเป็นส่วนตัวของ akkapol-systems.vercel.app — เราเก็บ ใช้ และปกป้องข้อมูลของคุณอย่างไร",
};

const sections = [
  {
    title: "1. ข้อมูลที่เราเก็บ",
    content: (
      <ul className="space-y-2">
        <li>
          <strong>ข้อความในแชท</strong> — เมื่อคุณใช้ AI Chat บนเว็บนี้ ข้อความ
          ของคุณจะถูกบันทึกเพื่อให้ Akkapol ติดตามกลับ (การจัดการลูกค้าเป้าหมาย)
          ข้อมูลถูกเก็บแบบส่วนตัวผ่าน Vercel Blob
        </li>
        <li>
          <strong>ตัวระบุเพื่อป้องกันการใช้งานเกินขอบเขต</strong> — เราใช้ไอดีสุ่ม
          จากเบราว์เซอร์ร่วมกับข้อมูลคำขอบางส่วนที่ไม่ใช้เพื่อโฆษณา
          (เช่นสัญญาณจากเครือข่ายหรือเบราว์เซอร์) เพื่อจำกัดการใช้งานแชทและลดการ abuse
        </li>
        <li>
          <strong>การเข้าชมหน้าเว็บ</strong> — เราใช้ Vercel Analytics เพื่อนับ
          ผู้เยี่ยมชมและดูแนวทางการใช้งานโดยรวม ไม่มีการเก็บข้อมูลส่วนบุคคล
        </li>
        <li>
          <strong>การตั้งค่าธีม</strong> — การเลือกธีม dark/light ของคุณถูกบันทึก
          ใน localStorage ของเบราว์เซอร์เท่านั้น ไม่มีการส่งออกไปที่อื่น
        </li>
      </ul>
    ),
  },
  {
    title: "2. เราใช้ข้อมูลของคุณอย่างไร",
    content: (
      <ul className="space-y-2">
        <li>ข้อความในแชทถูกตรวจสอบเพื่อตอบคำถามและปรับปรุงบริการ</li>
        <li>ข้อมูล analytics ช่วยให้เราเข้าใจว่าส่วนไหนของเว็บที่มีประโยชน์</li>
        <li>เรา <strong>ไม่</strong> ขาย แบ่งปัน หรือใช้ข้อมูลของคุณเพื่อโฆษณา</li>
      </ul>
    ),
  },
  {
    title: "3. การจัดเก็บและการเก็บรักษาข้อมูล",
    content: (
      <ul className="space-y-2">
        <li>
          ข้อความในแชทถูกเก็บใน <strong>Vercel Blob</strong> (พื้นที่จัดเก็บ
          แบบส่วนตัว ควบคุมการเข้าถึง บน AWS ในเขตสหรัฐอเมริกา)
        </li>
        <li>
          เราเก็บข้อมูลแชทเท่าที่จำเป็นต่อการติดตามและทบทวนงานเท่านั้น
          ขณะนี้ repository นี้ยังไม่มีระบบลบอัตโนมัติ ดังนั้นคุณสามารถขอให้ลบข้อมูลได้ทุกเมื่อ
        </li>
        <li>
          ตัวนับการจำกัดจำนวนข้อความถูกรีเซ็ตทุกวันและไม่เชื่อมโยงกับตัวตนใด ๆ
        </li>
      </ul>
    ),
  },
  {
    title: "4. สิทธิ์ของคุณ (PDPA)",
    content: (
      <ul className="space-y-2">
        <li>
          <strong>ขอเข้าถึงข้อมูล</strong> — คุณสามารถขอทราบว่าเราเก็บข้อมูล
          อะไรของคุณบ้าง
        </li>
        <li>
          <strong>ขอให้ลบข้อมูล</strong> — คุณสามารถขอให้ลบข้อมูลของคุณได้
          ทุกเมื่อ
        </li>
        <li>
          <strong>เพิกถอนความยินยอม</strong> — คุณสามารถหยุดใช้แชทได้ทุกเมื่อ
          ระบบจะไม่เก็บข้อมูลเพิ่มเติม
        </li>
        <li>
          หากต้องการใช้สิทธิ์เหล่านี้ ติดต่อ Akkapol ได้ที่{` `}
          <a href="mailto:hi@akkapol.com" className="text-amber-200 hover:text-amber-100 underline">
            hi@akkapol.com
          </a>
        </li>
      </ul>
    ),
  },
  {
    title: "5. บริการจากบุคคลที่สาม",
    content: (
      <ul className="space-y-2">
        <li>
          <strong>Vercel</strong> — โฮสติ้งและ analytics ดู{` `}
          <a
            href="https://vercel.com/legal/privacy"
            target="_blank"
            rel="noreferrer"
            className="text-amber-200 hover:text-amber-100 underline"
          >
            นโยบายความเป็นส่วนตัวของ Vercel
          </a>
        </li>
        <li>
          <strong>Deepseek</strong> — ผู้ให้บริการ AI model สำหรับฟีเจอร์แชท
          ข้อความถูกส่งไปประมวลผลผ่าน Deepseek APIs ดู{` `}
          <a
            href="https://www.deepseek.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="text-amber-200 hover:text-amber-100 underline"
          >
            นโยบายความเป็นส่วนตัวของ Deepseek
          </a>
        </li>
        <li>
          เรา <strong>ไม่</strong> ใช้เครือข่ายโฆษณา social media pixels
          หรือตัวติดตามจากบุคคลที่สาม
        </li>
      </ul>
    ),
  },
  {
    title: "6. คุกกี้",
    content: (
      <p>
        เว็บไซต์นี้ <strong>ไม่</strong> ใช้ tracking cookies การแชทและการตั้งค่า
        ธีมใช้ localStorage ของเบราว์เซอร์เท่านั้น — ไม่มีคุกกี้ถูกส่งไปยังเซิร์ฟเวอร์
        Vercel Analytics ใช้ beacon ขนาดเล็กที่ไม่ระบุตัวตนผู้ใช้
      </p>
    ),
  },
  {
    title: "7. การเปลี่ยนแปลงนโยบาย",
    content: (
      <p>
        เราอาจอัปเดตนโยบายนี้เมื่อเว็บไซต์มีการพัฒนา เวอร์ชันล่าสุดอยู่ที่ URL
        นี้เสมอ การใช้เว็บไซต์ต่อหลังการเปลี่ยนแปลงหมายถึงคุณยอมรับนโยบาย
        ที่อัปเดตแล้ว
      </p>
    ),
    last: true,
  },
];

export default function ThaiPrivacyPage() {
  return (
    <main className="min-h-screen bg-[#070707] px-4 py-8 text-zinc-100">
      <div className="mx-auto mb-6 max-w-[720px]">
        <Link
          href="/th"
          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-amber-300/40 hover:bg-white/[0.07] hover:text-amber-200"
        >
          <span aria-hidden="true">←</span>
          <span>กลับหน้าแรก</span>
        </Link>
      </div>

      <article className="mx-auto max-w-[720px] rounded-lg border border-white/10 bg-zinc-950 p-8 shadow-2xl shadow-black/50 sm:p-10">
        <header className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
            นโยบายความเป็นส่วนตัว
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
            ข้อมูลของคุณถูกจัดการอย่างไร
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            อัปเดตล่าสุด: 29 มิถุนายน 2026
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
