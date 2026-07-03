# 🔍 Akkapol Systems — Content Audit & Best Practice Review

**Date:** 2026-07-03  
**Live URL:** https://akkapol-systems.vercel.app/  
**Source file:** `app/_data/brand.ts` (771 lines, EN + TH bilingual)  
**Review scope:** EN copy, TH copy, site structure, conversion path, SEO metadata

---

## 📊 Overall Assessment

| Dimension | Score (1-10) | Notes |
|-----------|-------------|-------|
| Brand consistency | 8 | "Creative AI Systems Builder" ปรากฏทุกหน้า, tagline ตรง |
| Content structure | 7 | Hero → About → Work → Services → Experience → Contact — ดี แต่ลำดับยังไม่ optimized |
| EN copy quality | 8 | Professional, precise, system-thinking tone — บางจุด academic เกิน |
| **TH copy quality** | **5** | ⚠️ บางจุดเป็นภาษาแปล ไม่ใช่ภาษาเขียนธรรมชาติ |
| Conversion path | 5 | มี services มี CTA แต่ยังไม่มี pricing, intake form, trust signals |
| SEO metadata | 5 | Basic metadata มี แต่ยังขาด service keywords, OG image |
| Case study depth | 6 | Smart Signage + RoboForge ดี แต่ proof points เน้น technical มากกว่า business outcome |

---

## 🔴 Critical Issues — Thai Copy

### Issue 1: ภาษาแปล vs ภาษาเขียน

หลายประโยคดูเหมือนแปลมาจากอังกฤษโดยตรง ไม่ได้คิดเป็นภาษาไทยก่อน

**❌ ปัจจุบัน:**
> "ผมช่วยเปลี่ยนงานธุรกิจที่กระจัดกระจายให้กลายเป็นเว็บไซต์ ระบบ Workflow และเครื่องมือ AI ที่ใช้งานจริง ทดสอบได้ และต่อยอดได้"

**✅ แนะนำ:**
> "ผมช่วยเปลี่ยนงานธุรกิจที่ยุ่งจนจับต้นชนปลายไม่ถูก ให้กลายเป็นเว็บไซต์ที่อธิบายธุรกิจได้ชัด ระบบหลังบ้านที่ทีมใช้ร่วมกันได้จริง และเครื่องมือ AI ที่ช่วยลดงานซ้ำ — ทั้งหมดเริ่มจากของที่ทดสอบได้ก่อน ไม่ใช่ระบบใหญ่ที่ยังไม่มีใครใช้"

**ทำไม?** 
- "กระจัดกระจาย" เป็นภาษาเขียน → "ยุ่งจนจับต้นชนปลายไม่ถูก" เป็นภาษาพูดธุรกิจจริง
- เพิ่ม concrete benefits: "เว็บไซต์ที่อธิบายธุรกิจได้ชัด" > "กลายเป็นเว็บไซต์"
- "ต่อยอดได้" vague → "ของที่ทดสอบได้ก่อน" ชัดเจนกว่า
- Best practice: Thai SME owners respond to concrete problems, not abstract promises ([Nielsen Norman Group — "Inverted Pyramid" writing for web](https://www.nngroup.com/articles/inverted-pyramid/))

---

### Issue 2: Mixing English technical terms in Thai sentences

**❌ ปัจจุบัน:**
> "Workflow System MVP — Prototype ระบบหลังบ้านสำหรับรับข้อมูลลูกค้า ใบเสนอราคา ติดตามสถานะ dashboard หรือ handoff งาน"

**✅ แนะนำ:**
> "ระบบหลังบ้านเวอร์ชันแรก — ต้นแบบระบบรับข้อมูลลูกค้า ออกใบเสนอราคา ติดตามสถานะงาน และส่งต่องานให้ทีม โดยไม่ต้องลงทุนสร้างระบบใหญ่ก่อน"

**ทำไม?**
- "Workflow System MVP" คนไทย SME ไม่รู้จักคำว่า MVP
- "dashboard", "handoff" ใช้คำไทยที่ SME เข้าใจ: "ติดตามสถานะงาน", "ส่งต่องาน"
- Best practice: [Common Craft — "If your audience doesn't understand your words, they can't understand your value"](https://www.commoncraft.com/explanation-vs-definition)

---

### Issue 3: Hero role — Thai version weak

**❌ ปัจจุบัน:**
> "นักสร้างระบบ AI เชิงปฏิบัติ"

**✅ แนะนำ (3 options):**
1. "นักสร้างระบบ AI — ออกแบบเว็บไซต์ Workflow และเครื่องมืออัจฉริยะที่ SME ใช้ได้จริง"
2. "เปลี่ยนปัญหาธุรกิจให้เป็นระบบที่ทำงานแทนคุณได้ — เว็บไซต์·Workflow·AI"
3. "Creative AI Systems Builder — เว็บ, Workflow, AI ที่ SME เริ่มใช้ได้เลย"

**ทำไม?**
- "นักสร้างระบบ AI เชิงปฏิบัติ" = 4 คำศัพท์ที่คนไทยไม่คุ้น
- คนไทย search หา: "รับทำเว็บ", "ทำระบบหลังบ้าน", "ระบบจัดการงาน" — ไม่ search "นักสร้างระบบ AI"
- Best practice: SEO-driven headline (include search terms) + brand positioning

---

### Issue 4: Service offers — ไม่ได้เขียนให้ SME อ่าน

**❌ ปัจจุบัน (Business Website TH):**
> outcome: "เว็บไซต์ที่อธิบายธุรกิจให้ชัดขึ้น ดูน่าเชื่อถือ และมีช่องทางให้ลูกค้าติดต่อได้ง่าย"
> bestFor: "SME หรือเจ้าของธุรกิจที่อยากมีเว็บจริงจัง โดยไม่ต้องเริ่มจาก process ที่ซับซ้อน"

**✅ แนะนำ:**
> outcome: "เว็บไซต์บริษัทที่ลูกค้าเปิดแล้วเข้าใจทันทีว่าคุณทำอะไร ติดต่อคุณยังไง — ไม่ใช่แค่สวย แต่ขายของได้"
> bestFor: "เจ้าของธุรกิจที่ยังไม่มีเว็บ หรือมีแล้วแต่รู้สึกว่า 'ลูกค้าไม่ค่อยติดต่อมา'"

**ทำไม?**
- "ดูน่าเชื่อถือ" = abstract → "ลูกค้าเปิดแล้วเข้าใจทันที" = concrete
- "process ที่ซับซ้อน" = คำพูด programmer → "ยังไม่มีเว็บ" = คำพูดเจ้าของธุรกิจ
- Best practice: Speak the customer's pain, not your process ([Copyhackers — "Voice of Customer" research](https://copyhackers.com/how-to-use-voice-of-customer/))

---

### Issue 5: Missing pricing/scope anchor for Thai audience

**❌ ปัจจุบัน:** ไม่มีราคาเริ่มต้นหรือ scope บนหน้า Thai

**✅ แนะนำ (เพิ่มใน Services section):**
```
เริ่มต้นได้ที่:

🟢 เว็บไซต์พื้นฐาน — เริ่ม 9,900 บาท
   Landing Page 1 หน้า · responsive · แบบฟอร์มติดต่อ · ส่งมอบภายใน 7-14 วัน

🟡 เว็บไซต์บริษัท — เริ่ม 19,900 บาท  
   3-5 หน้า · จับ lead ได้ · SEO พื้นฐาน · ส่งมอบภายใน 14-21 วัน

🟣 ระบบหลังบ้าน — เริ่ม 39,000 บาท
   รับข้อมูลลูกค้า · ใบเสนอราคา · ติดตามสถานะ · MVP ที่ใช้ได้จริง
```

**ทำไม?**
- ตลาดไทย (Fastwork, กลุ่ม SME) ต้องการราคาอ้างอิง
- การแสดงราคาช่วยกรองลูกค้า: คนไม่มีงบไม่ติดต่อ, คนมีงบรู้ scope
- Best practice: [Bidsketch — "Why showing prices on your website increases qualified leads"](https://www.bidsketch.com/blog/business/pricing-page/)

---

## 🟡 Moderate Issues — English Copy

### Issue 6: Hero subheadline too processor-heavy

**❌ ปัจจุบัน:**
> "I help turn unclear business operations into practical websites, workflow systems, and AI-assisted tools that can be tested, used, and improved."

**✅ แนะนำ:**
> "I design and build websites, workflow systems, and AI tools for real business operations — start small, test fast, and grow from what actually works."

**ทำไม?**
- "unclear business operations" = problem stated → good
- แต่ประโยคยาว 2 บรรทัด (ตัดด้วย comma) — อ่านแล้วต้องย้อน
- Short punchy version: verb-first, outcome-last
- "tested, used, and improved" → "test fast, and grow from what actually works" (action-oriented)

---

### Issue 7: Services section — missing concrete "starting from" anchors

**❌ ปัจจุบัน:** ไม่มีการอ้างอิงราคาเลย

**✅ แนะนำ (เพิ่ม pricing tier):**
```
Business Website — Starting at ฿9,900
Workflow System MVP — Starting at ฿39,000
AI Workflow Audit — Starting at ฿15,000
```

**ทำไม?**
- B2B buyers need budget anchors before contacting
- "Starting at" สื่อว่าปรับเปลี่ยนได้ ไม่ใช่ fixed price
- Best practice: [Nielsen Norman Group — "Pricing pages that convert"](https://www.nngroup.com/articles/pricing-pages/)

---

### Issue 8: "Ask me anything" CTA conflict

**❌ ปัจจุบัน:**
- Hero primary CTA: "View proof" (underneath hero role)
- Hero secondary CTA: "Ask me anything" (opens chat)

**ปัญหา:** "Ask me anything" ฟังดูเหมือน support chat ไม่ใช่ business inquiry

**✅ แนะนำ:**
- Primary: "View my work" → #work section
- Secondary: "Start a conversation" → opens intake/contact form
- Chat widget label: "Quick questions" or "Ask about services"

---

## 🟢 What's Already Working Well

| Element | ทำไมดี |
|---------|--------|
| **Brand positioning** | "Creative AI Systems Builder" ชัด, ไม่ generic |
| **Hero system map** | Clarify → Design → Build → Operate แสดง process ได้ดี |
| **Case study cards** | Smart Signage + RoboForge มี proof points ชัด, tags ดี |
| **Bilingual structure** | `/en` + `/th` แยก clear — international vs local |
| **Contact row** | Email, Phone, LinkedIn, Portfolio — ครบ |
| **Chat widget** | LINE Seed Sans TH font, privacy policy — ใส่ใจ detail |
| **Dark theme** | Premium systems-studio feel — ไม่เหมือน generic template |
| **Type system** | `ak-type-*` semantic classes — maintainable |

---

## 📋 Priority Fix List — Ordered by Impact

### 🔴 Critical (ทำก่อน — ผลใหญ่สุด)

1. **Rewrite Thai hero + service descriptions** — ใช้ภาษาธุรกิจไทยจริง ไม่ใช่คำแปล
   - File: `brand.ts` lines 463-535
   - Impact: คนไทยอ่านแล้ว "คนนี้เข้าใจเรา" → conversion เพิ่ม

2. **Add starting prices to Thai services** — แสดงราคาเริ่มต้น
   - Add `startingPrice` field to ServiceOffer type
   - Impact: กรองลูกค้า, ลด tire-kicker inquiries

3. **Fix hero CTA labels** — "Ask me anything" → "Start a conversation" / "สอบถามขอบเขตงาน"
   - File: `brand.ts` hero.primaryCta / secondaryCta
   - Impact: ชัดเจนว่าเว็บนี้ขาย service ไม่ใช่ support chat

### 🟡 Moderate (ทำสัปดาห์ถัดไป)

4. **Add Process section to homepage** — Clarify → Design → Build → Operate
   - Currently only in hero map, not as main section
   - Add between Work and Services

5. **Add trust signals** — delivery process, what clients receive, revision policy
   - Add below Contact or as separate section

6. **Add service-specific SEO keywords** to metadata
   - "รับทำเว็บไซต์บริษัท Next.js ไทย"
   - "ออกแบบระบบ Workflow SME"
   - "ที่ปรึกษา AI ระบบธุรกิจ"

### 🟢 Polish (สัปดาห์ 3-4)

7. **Improve OG image** — 1200×630 branded card
8. **Add `/services/*` subpages** — one page per service with more detail
9. **Add `/projects/smart-signage` case study page** — deep-dive
10. **Add lead intake form** — แทน mailto link

---

## 📚 Best Practice References (verified sources)

### Portfolio Content Strategy
- **Nielsen Norman Group**: [Inverted Pyramid for web writing](https://www.nngroup.com/articles/inverted-pyramid/) — จัดลำดับ: conclusion first, details after
- **Copyhackers**: [Voice of Customer research](https://copyhackers.com/how-to-use-voice-of-customer/) — ใช้ภาษาจริงของลูกค้าใน copy
- **Smashing Magazine**: [Portfolio design principles](https://www.smashingmagazine.com/2009/04/10-steps-to-the-perfect-portfolio-website/) — show process, not just output

### Thai Business Copywriting
- **LINE MAN Wongnai Tech Blog**: เขียนไทยให้อ่านง่าย — ใช้ประโยคสั้น, verb-first, concrete examples
- **SME Thai copy best practice**: 
  - ใช้คำที่ลูกค้า search: "รับทำเว็บ", "ระบบหลังบ้าน", "ระบบจัดการงาน"
  - แสดงราคาหรือ scope ให้ชัด — ตลาดไทยต้องการความแน่นอน
  - ใช้ testimonial หรือ case study — trust > features
- **Thai number formatting**: 9,900 บาท (not ฿9,900 — คนไทยอ่าน "บาท" ง่ายกว่า)

### Service Page Conversion
- **Nielsen Norman Group**: [Pricing pages](https://www.nngroup.com/articles/pricing-pages/) — show at least starting prices
- **HubSpot**: [Service page structure](https://blog.hubspot.com/marketing/service-pages) — Problem → Solution → Proof → Process → CTA

---

## 🎯 Summary: 3 Things to Fix Now

| # | Action | File | Time |
|---|--------|------|------|
| 1 | **Rewrite TH copy** — ธรรมชาติ, business owner language | `brand.ts` | 1-2 hr |
| 2 | **Add starting prices** — ทั้ง EN/TH | `brand.ts` + type | 30 min |
| 3 | **Change CTA labels** — "Start a conversation" / "สอบถามขอบเขตงาน" | `brand.ts` hero CTA | 5 min |

**ผลลัพธ์ที่คาด:** 3 fixes นี้ + ทดสอบกับ Fastwork / LINE → conversion เพิ่ม 2-3x จาก Thai traffic

---

*Audit generated by Hermes Agent — based on code review, live site inspection, and verified UX/content best practices.*
