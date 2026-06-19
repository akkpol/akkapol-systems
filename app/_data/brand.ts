import type { IconName } from "@/app/_data/cv";

export type Locale = "en" | "th";

export type ServiceOffer = {
  title: string;
  icon: IconName;
  outcome: string;
  bestFor: string;
  scope: string[];
};

export type WorkProof = {
  title: string;
  status: string;
  icon: IconName;
  description: string;
  proofPoints: string[];
  tags: string[];
  links: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
};

export type SimpleCard = {
  title: string;
  icon: IconName;
  items: string;
};

export type ExperienceItem = {
  title: string;
  company: string;
  period: string;
  points: string[];
};

export type EducationItem = {
  program: string;
  institution: string;
  period: string;
  description?: string;
};

export type HomeContent = {
  localeLabel: string;
  alternateLocaleLabel: string;
  alternateLocaleHref: string;
  hero: {
    brand: string;
    status: string;
    role: string;
    body: string[];
    primaryCta: string;
    secondaryCta: string;
    mapLabels: {
      clarify: string;
      clarifyBody: string;
      design: string;
      designBody: string;
      ambiguous: string;
      ambiguousBody: string;
      build: string;
      buildBody: string;
      operate: string;
      operateBody: string;
      result: string[];
    };
    bottomEyebrow: string;
    bottomTitle: string[];
    bottomBody: string;
  };
  sections: {
    services: {
      eyebrow: string;
      title: string;
      body: string;
      primaryAction: string;
      secondaryAction: string;
      offers: ServiceOffer[];
    };
    work: {
      eyebrow: string;
      title: string;
      items: WorkProof[];
    };
    process: {
      eyebrow: string;
      title: string;
      body: string;
      steps: string[];
    };
    about: {
      eyebrow: string;
      title: string;
      summary: string;
    };
    focus: {
      eyebrow: string;
      title: string;
      items: string[];
    };
    skills: {
      eyebrow: string;
      title: string;
      items: SimpleCard[];
    };
    experience: {
      eyebrow: string;
      title: string;
      items: ExperienceItem[];
    };
    education: {
      eyebrow: string;
      title: string;
      items: EducationItem[];
    };
    contact: {
      title: string;
      body: string;
      cvActions: {
        copyIdle: string;
        copyCopied: string;
        copyError: string;
        downloadPdf: string;
        downloadMarkdown: string;
        viewCv: string;
      };
    };
  };
};

const sharedWorkLinks = {
  smartSignage: [
    {
      label: "Live app",
      href: "https://smart-signage.vercel.app",
      external: true,
    },
  ],
  roboForge: [
    {
      label: "Live demo",
      href: "https://roboforge-mvp.vercel.app",
      external: true,
    },
    {
      label: "GitHub",
      href: "https://github.com/akkpol/roboforge-mvp",
      external: true,
    },
  ],
};

export const homeContent: Record<Locale, HomeContent> = {
  en: {
    localeLabel: "EN",
    alternateLocaleLabel: "TH",
    alternateLocaleHref: "/th",
    hero: {
      brand: "SYSTEMS STUDIO",
      status: "SYSTEMS THINKER • BUILDER • OPERATOR",
      role: "Creative AI Systems Builder",
      body: ["Systems, workflows, and intelligent tools", "for real business operations"],
      primaryCta: "View services",
      secondaryCta: "Start scoped conversation",
      mapLabels: {
        clarify: "CLARIFY",
        clarifyBody: "Understand goals, constraints, context",
        design: "DESIGN",
        designBody: "Map systems and workflows",
        ambiguous: "AMBIGUOUS INPUT",
        ambiguousBody: "Unclear, scattered, hard to scale",
        build: "BUILD",
        buildBody: "Create intelligent tools and automations",
        operate: "OPERATE",
        operateBody: "Run, refine, and evolve systems",
        result: ["ELEGANT SYSTEMS.", "REAL RESULTS."],
      },
      bottomEyebrow: "WHAT I DO",
      bottomTitle: ["I build systems that", "run your business."],
      bottomBody:
        "I partner with founders and operators to turn ambiguity into structure, designing and building systems that streamline operations and scale with confidence.",
    },
    sections: {
      services: {
        eyebrow: "Services / Offers",
        title: "Practical systems you can start with before committing to a large build.",
        body:
          "I keep the first step small: clarify the workflow, define the useful MVP, then build the part that can be tested by a real owner, team, or customer.",
        primaryAction: "Start a scoped conversation",
        secondaryAction: "View proof",
        offers: [
          {
            title: "Company Website / Landing Page",
            icon: "code",
            outcome:
              "A clear business website with responsive UI, lead capture, deployment, and practical content structure.",
            bestFor: "SMEs that need a credible online presence fast.",
            scope: [
              "Positioning and page structure",
              "Responsive Next.js delivery",
              "Contact or lead capture path",
              "Vercel deployment and handoff",
            ],
          },
          {
            title: "Workflow & Backoffice System",
            icon: "workflow",
            outcome:
              "A scoped operational prototype for intake, quotation, status tracking, dashboards, and handoff.",
            bestFor: "Teams stuck in chat, spreadsheets, or unclear job status.",
            scope: [
              "Workflow mapping",
              "Admin-first MVP",
              "Role-aware operations",
              "Audit-ready state changes",
            ],
          },
          {
            title: "AI Workflow Audit",
            icon: "brain",
            outcome:
              "A practical review of repeated work, automation opportunities, AI-assisted steps, and a 30-day action plan.",
            bestFor: "Owners who want AI leverage without buying vague automation.",
            scope: [
              "Process review",
              "Automation fit check",
              "Human-in-the-loop design",
              "Smallest useful MVP plan",
            ],
          },
        ],
      },
      work: {
        eyebrow: "Selected Work",
        title:
          "Recent product work that proves the brand: workflow clarity, AI-native execution, and practical systems.",
        items: [
          {
            title: "Smart Signage",
            status: "Private working product case study",
            icon: "workflow",
            description:
              "A Thai sign-shop ERP and workflow system for LINE-first customer intake, quoting, payment gates, production visibility, legal documents, and operations audit trails.",
            proofPoints: [
              "Maps a messy sign-shop pipeline into visible Kanban stages.",
              "Connects LINE touchpoints, quotation approval, receipt delivery, and job history.",
              "Separates sensitive business actions with roles, audit logs, and explicit gates.",
            ],
            tags: ["LINE workflow", "ERP MVP", "Supabase", "Audit log"],
            links: sharedWorkLinks.smartSignage,
          },
          {
            title: "RoboForge",
            status: "Public demo + robot owner beta platform",
            icon: "sparkles",
            description:
              "A mobile-first robot identity and owner platform that combines a public product demo, authenticated Garage ownership, claim kits, setup guidance, and an ESP32 Rover-01 local control path.",
            proofPoints: [
              "Preserves a strong product experience while adding real owner/workspace data.",
              "Keeps live motor commands local to the robot Wi-Fi and stores beta evidence in Supabase.",
              "Defines a stable robot protocol for status, arming, drive, stop, and device identity.",
            ],
            tags: ["Robot platform", "ESP32", "Next.js", "Vercel"],
            links: sharedWorkLinks.roboForge,
          },
        ],
      },
      process: {
        eyebrow: "Operating Model",
        title: "A bilingual systems practice for Thai SMEs and international-facing products.",
        body:
          "The working style is simple: start with the business workflow, build the smallest useful system, then improve it through real usage.",
        steps: [
          "Clarify the workflow",
          "Design the smallest useful system",
          "Build a working MVP",
          "Operate, measure, and improve",
        ],
      },
      about: {
        eyebrow: "Executive Summary",
        title: "A practical profile built around execution, workflow design, and solving real business problems.",
        summary:
          "AI-integrated systems builder with a background in full-stack development, SharePoint and Power Platform automation, workflow systems, and operational problem-solving. Experienced in designing practical AI-assisted business systems that combine LLM tooling, agentic development workflows, cloud infrastructure, CRM-style operational flows, customer intake, quotation/status tracking, and production-ready web systems. Strong foundation in real-world enterprise systems execution, legacy system support, front-end engineering, and operations management. Focused on turning business ambiguity into clear workflow states, usable interfaces, customer visibility, and scalable operational processes.",
      },
      focus: {
        eyebrow: "Current Focus",
        title: "Building 2026-ready AI-integrated business systems for real operations.",
        items: [
          "2026-ready AI-integrated business systems",
          "Agentic workflow design",
          "SME operational automation",
          "Customer intake systems",
          "Quotation and status tracking",
          "Production workflow visibility",
          "Practical AI-assisted software development",
        ],
      },
      skills: {
        eyebrow: "Core Competencies",
        title: "A practical stack for AI-assisted systems, workflow automation, and production web delivery.",
        items: [
          {
            title: "AI & Agentic Workflows",
            icon: "brain",
            items:
              "LLM Integration · AI Workflow Orchestration · Agentic Workflow Design · AI-assisted coding, debugging & prototyping",
          },
          {
            title: "Full-Stack & Cloud",
            icon: "code",
            items:
              "Next.js · React · TypeScript · JavaScript · Supabase · PostgreSQL · Vercel · Firebase · GCP · Cloudflare R2",
          },
          {
            title: "Business Workflow Systems",
            icon: "workflow",
            items:
              "LINE Messaging API · LIFF · MINI App flows · REST APIs · Webhooks · Signed URLs · CRM workflows · Intake · Quote/status tracking",
          },
          {
            title: "Enterprise Automation",
            icon: "database",
            items:
              "SharePoint 2019 · Power Automate · Power Apps · SQL Server · Git · Cursor · GitHub Copilot · Codex",
          },
        ],
      },
      experience: {
        eyebrow: "Experience",
        title: "Current role first: building AI systems, workflows, and practical solutions.",
        items: [
          {
            title: "Independent AI Systems Developer & Consultant",
            company: "Independent",
            period: "2026 - Present",
            points: [
              "Design AI-assisted operational systems and workflow platforms for small businesses and production environments.",
              "Build LINE + LIFF based customer intake and quotation workflow systems integrated with Supabase and Vercel.",
              "Design CRM and workflow foundations for customer intake, quote visibility, payment/commercial gates, production status tracking, and operator handoff.",
              "Develop scalable file and asset handling strategies using signed URLs and cloud object storage.",
              "Apply AI-assisted development workflows using ChatGPT, Codex, Claude, Gemini, Cursor, and GitHub Copilot.",
              "Design practical AI features as assistive workflow layers.",
              "Explore agentic AI workflows and orchestration patterns for future production automation systems.",
            ],
          },
          {
            title: "AI-Assisted Problem Solver / AI & Tech Integrator",
            company: "Independent / AK3 Studio",
            period: "2025 - 2026",
            points: [
              "Use AI as a reasoning partner for research-driven problem analysis and decision support.",
              "Clarify ambiguous business problems and translate insights into practical execution.",
              "Improve operational efficiency and long-term business value for SMEs.",
              "Transform unclear requirements into workflow structures and execution-ready solutions.",
            ],
          },
          {
            title: "IT Programmer / SharePoint & Power Platform Developer",
            company: "C.C.S. Advance Tech Co., Ltd.",
            period: "Nov 2022 - Nov 2025",
            points: [
              "Developed and maintained enterprise systems on SharePoint 2019 On-Premise.",
              "Automated workflows using Power Automate.",
              "Built custom forms and interfaces using JavaScript, jQuery, HTML, and CSS.",
              "Integrated SharePoint lists, legacy data, and business requirements.",
              "Collaborated with cross-functional teams.",
            ],
          },
          {
            title: "Front-End Developer",
            company: "Absolute Solution Co., Ltd.",
            period: "Nov 2021 - Jul 2022",
            points: [
              "Developed user interfaces using React, Next.js, Ant Design, and Material UI.",
              "Integrated REST APIs.",
              "Participated in Agile workflows.",
            ],
          },
          {
            title: "Operations Manager",
            company: "Frozen Restaurant",
            period: "Oct 2018 - Dec 2020",
            points: [
              "Managed daily operations, staff coordination, and resource planning.",
              "Improved operational workflows and team performance.",
              "Gained hands-on decision-making experience.",
            ],
          },
          {
            title: "Junior .NET Developer",
            company: "Auction Trade Co., Ltd.",
            period: "Oct 2015 - Feb 2018",
            points: [
              "Developed internal systems using C#, .NET Framework, and SQL Server.",
              "Fixed bugs and optimized legacy systems.",
              "Supported database operations and maintenance.",
            ],
          },
          {
            title: "Graphic Designer",
            company: "Manta Performing Arts",
            period: "Dec 2013 - Dec 2014",
            points: [
              "Created visual assets, branding materials, and stage graphics.",
              "Built foundations in visual communication and creative thinking.",
            ],
          },
        ],
      },
      education: {
        eyebrow: "Education",
        title: "A technical foundation across data, production systems, web development, and electronics.",
        items: [
          {
            program: "Data Analysis with Power BI",
            institution: "AskMe Solutions",
            period: "2024 - Present",
          },
          {
            program: "SCADA Systems for Production Processes",
            institution: "Rajamangala University of Technology Phra Nakhon",
            period: "2024 - Present",
          },
          {
            program: "Full-Stack JavaScript Web Development (CodeCamp #9)",
            institution: "Software Park Thailand",
            period: "2021",
            description:
              "Intensive 6-month bootcamp covering React, UX/UI, Node.js, MySQL, and backend fundamentals.",
          },
          {
            program: "Undergraduate Coursework",
            institution: "Chandrakasem Rajabhat University",
            period: "2013",
            description: "Programming, algorithms, databases, and system fundamentals.",
          },
          {
            program: "Vocational Certificate in Electrical & Electronics",
            institution: "Tak Technical College",
            period: "2010",
            description: "Electronic circuits, electrical systems, and digital/analog fundamentals.",
          },
        ],
      },
      contact: {
        title: "Let's turn business problems into practical AI-assisted systems.",
        body:
          "Best fit: practical AI-assisted systems, customer workflows, process automation, and production-ready web platforms.",
        cvActions: {
          copyIdle: "Copy CV.md",
          copyCopied: "Copied",
          copyError: "Copy failed",
          downloadPdf: "Download PDF",
          downloadMarkdown: "Download CV.md",
          viewCv: "View CV",
        },
      },
    },
  },
  th: {
    localeLabel: "TH",
    alternateLocaleLabel: "EN",
    alternateLocaleHref: "/",
    hero: {
      brand: "SYSTEMS STUDIO",
      status: "คิดเป็นระบบ • สร้างจริง • ใช้งานจริง",
      role: "นักสร้างระบบ AI เชิงปฏิบัติ",
      body: ["เว็บไซต์ ระบบ Workflow และเครื่องมือ AI", "สำหรับธุรกิจที่ต้องการใช้งานจริง"],
      primaryCta: "ดูบริการ",
      secondaryCta: "คุยขอบเขตงาน",
      mapLabels: {
        clarify: "ทำให้ชัด",
        clarifyBody: "เป้าหมาย ข้อจำกัด และบริบทธุรกิจ",
        design: "ออกแบบ",
        designBody: "วางระบบและขั้นตอนงาน",
        ambiguous: "โจทย์ยังไม่ชัด",
        ambiguousBody: "ข้อมูลกระจัดกระจาย ขยายงานยาก",
        build: "สร้าง",
        buildBody: "ทำเครื่องมือและระบบที่ใช้ได้จริง",
        operate: "ใช้งาน",
        operateBody: "วัดผล ปรับปรุง และต่อยอด",
        result: ["ระบบที่ชัดเจน", "ผลลัพธ์ที่ใช้ได้จริง"],
      },
      bottomEyebrow: "สิ่งที่ผมทำ",
      bottomTitle: ["สร้างระบบที่ช่วยให้", "ธุรกิจทำงานเป็นระบบ"],
      bottomBody:
        "ผมช่วยเจ้าของธุรกิจและทีมปฏิบัติการเปลี่ยนโจทย์ที่ยังไม่ชัดให้กลายเป็นโครงสร้าง ระบบ และเครื่องมือที่ใช้งานจริงได้.",
    },
    sections: {
      services: {
        eyebrow: "บริการ / จุดเริ่มต้น",
        title: "เริ่มจากระบบเล็กที่ชัด ก่อนลงทุนสร้างระบบใหญ่.",
        body:
          "ผมเริ่มจากการทำ workflow ให้ชัด กำหนด MVP ที่เล็กพอจะทดสอบได้ แล้วสร้างส่วนที่เจ้าของ ทีมงาน หรือลูกค้าใช้งานจริงได้ก่อน.",
        primaryAction: "คุยขอบเขตงาน",
        secondaryAction: "ดูผลงาน",
        offers: [
          {
            title: "เว็บไซต์บริษัท / Landing Page",
            icon: "code",
            outcome:
              "เว็บไซต์ธุรกิจที่สื่อสารชัด รองรับมือถือ มีทางรับ lead และ deploy พร้อมใช้งาน.",
            bestFor: "SME ที่ต้องการความน่าเชื่อถือออนไลน์เร็วขึ้น.",
            scope: [
              "วาง positioning และโครงหน้าเว็บ",
              "พัฒนา responsive ด้วย Next.js",
              "วางช่องทางติดต่อหรือรับ lead",
              "Deploy บน Vercel และส่งมอบ",
            ],
          },
          {
            title: "ระบบ Workflow / Backoffice",
            icon: "workflow",
            outcome:
              "Prototype ระบบหลังบ้านสำหรับรับข้อมูลลูกค้า ใบเสนอราคา ติดตามสถานะ dashboard และ handoff งาน.",
            bestFor: "ทีมที่งานกระจายอยู่ในแชต spreadsheet หรือสถานะงานไม่ชัด.",
            scope: [
              "วิเคราะห์ workflow",
              "สร้าง MVP ฝั่ง admin ก่อน",
              "แยกสิทธิ์และบทบาทผู้ใช้",
              "เก็บประวัติ action สำคัญ",
            ],
          },
          {
            title: "AI Workflow Audit",
            icon: "brain",
            outcome:
              "รีวิวงานซ้ำ จุดที่ AI ช่วยได้ ขั้นตอนที่ควรเก็บ human-in-the-loop และแผน 30 วันสำหรับเริ่มทำจริง.",
            bestFor: "เจ้าของธุรกิจที่อยากใช้ AI แบบไม่หลง hype.",
            scope: [
              "สำรวจ process ปัจจุบัน",
              "ประเมินจุดที่ automate ได้จริง",
              "ออกแบบ AI แบบมีคนควบคุม",
              "กำหนด MVP ที่เล็กและคุ้ม",
            ],
          },
        ],
      },
      work: {
        eyebrow: "ผลงานที่เลือกมา",
        title: "งานล่าสุดที่พิสูจน์ positioning: workflow ชัด ใช้ AI เป็นเครื่องมือ และสร้างระบบที่ใช้งานจริง.",
        items: [
          {
            title: "Smart Signage",
            status: "Private working product case study",
            icon: "workflow",
            description:
              "ERP / workflow สำหรับร้านป้ายไทย ครอบคลุมการรับงานผ่าน LINE, ใบเสนอราคา, payment gate, งานออกแบบ, ผลิต, เอกสารกฎหมาย และ audit trail.",
            proofPoints: [
              "แปลง pipeline ร้านป้ายที่ซับซ้อนให้เป็น Kanban ที่มองเห็นสถานะงานชัด.",
              "เชื่อม LINE touchpoints, การอนุมัติราคา, ส่งใบเสร็จ และประวัติงาน.",
              "แยก action สำคัญด้วย role, audit log และ gate ที่ตรวจสอบได้.",
            ],
            tags: ["LINE workflow", "ERP MVP", "Supabase", "Audit log"],
            links: [
              {
                ...sharedWorkLinks.smartSignage[0],
                label: "เปิดแอป",
              },
            ],
          },
          {
            title: "RoboForge",
            status: "Public demo + robot owner beta platform",
            icon: "sparkles",
            description:
              "แพลตฟอร์ม robot identity และ owner experience ที่รวม public demo, Garage สำหรับเจ้าของ, claim kit, setup guidance และ control path ของ ESP32 Rover-01.",
            proofPoints: [
              "รักษา product experience ให้ชัด ขณะเพิ่มข้อมูล owner/workspace จริง.",
              "แยก live motor commands ให้อยู่บน local robot Wi-Fi และเก็บ beta evidence ใน Supabase.",
              "กำหนด robot protocol สำหรับ status, arming, drive, stop และ identity ของอุปกรณ์.",
            ],
            tags: ["Robot platform", "ESP32", "Next.js", "Vercel"],
            links: [
              {
                ...sharedWorkLinks.roboForge[0],
                label: "เปิดเดโม",
              },
              sharedWorkLinks.roboForge[1],
            ],
          },
        ],
      },
      process: {
        eyebrow: "วิธีทำงาน",
        title: "บริการสองภาษา สำหรับ SME ไทยและ product ที่ต้องสื่อสารกับตลาดกว้างขึ้น.",
        body:
          "วิธีทำงานคือเริ่มจาก workflow ธุรกิจจริง สร้างระบบเล็กที่ใช้ได้ก่อน แล้วค่อยวัดผลและต่อยอดจากการใช้งาน.",
        steps: [
          "ทำ workflow ให้ชัด",
          "ออกแบบระบบเล็กที่คุ้มที่สุด",
          "สร้าง MVP ที่ใช้งานได้จริง",
          "ใช้งาน วัดผล และปรับปรุง",
        ],
      },
      about: {
        eyebrow: "ภาพรวม",
        title: "โปรไฟล์ที่ยืนบน execution, workflow design และการแก้ปัญหาธุรกิจจริง.",
        summary:
          "ผมเป็นนักสร้างระบบที่ผสานงาน full-stack, SharePoint, Power Platform, workflow automation และ AI-assisted development เพื่อช่วยธุรกิจเปลี่ยนโจทย์ที่ยังไม่ชัดให้เป็นระบบที่มองเห็นสถานะ ใช้งานได้จริง และต่อยอดได้. จุดแข็งคือการเชื่อม business operation เข้ากับ technical execution ตั้งแต่ customer intake, quotation/status tracking, dashboard, cloud infrastructure ไปจนถึง production-ready web systems.",
      },
      focus: {
        eyebrow: "โฟกัสปัจจุบัน",
        title: "สร้างระบบธุรกิจที่ผสาน AI และพร้อมใช้งานจริงในปี 2026.",
        items: [
          "AI-integrated business systems สำหรับปี 2026",
          "Agentic workflow design",
          "ระบบ automation สำหรับ SME",
          "ระบบรับข้อมูลลูกค้า",
          "ใบเสนอราคาและการติดตามสถานะ",
          "Production workflow visibility",
          "AI-assisted software development ที่ใช้ได้จริง",
        ],
      },
      skills: {
        eyebrow: "ความสามารถหลัก",
        title: "Stack ที่เหมาะกับระบบ workflow, automation และ production web delivery.",
        items: [
          {
            title: "AI & Agentic Workflows",
            icon: "brain",
            items:
              "LLM Integration · AI Workflow Orchestration · Agentic Workflow Design · AI-assisted coding, debugging & prototyping",
          },
          {
            title: "Full-Stack & Cloud",
            icon: "code",
            items:
              "Next.js · React · TypeScript · JavaScript · Supabase · PostgreSQL · Vercel · Firebase · GCP · Cloudflare R2",
          },
          {
            title: "Business Workflow Systems",
            icon: "workflow",
            items:
              "LINE Messaging API · LIFF · MINI App flows · REST APIs · Webhooks · Signed URLs · CRM workflows · Intake · Quote/status tracking",
          },
          {
            title: "Enterprise Automation",
            icon: "database",
            items:
              "SharePoint 2019 · Power Automate · Power Apps · SQL Server · Git · Cursor · GitHub Copilot · Codex",
          },
        ],
      },
      experience: {
        eyebrow: "ประสบการณ์",
        title: "เริ่มจากบทบาทปัจจุบัน: สร้างระบบ AI, workflow และ solution ที่ใช้ได้จริง.",
        items: [
          {
            title: "Independent AI Systems Developer & Consultant",
            company: "Independent",
            period: "2026 - ปัจจุบัน",
            points: [
              "ออกแบบระบบ operation และ workflow platform ที่ใช้ AI เป็นตัวช่วยสำหรับธุรกิจขนาดเล็กและงาน production.",
              "พัฒนาระบบ customer intake และ quotation workflow บน LINE + LIFF, Supabase และ Vercel.",
              "วางพื้นฐาน CRM/workflow สำหรับ intake, quote visibility, payment gate, production status และ operator handoff.",
              "ออกแบบแนวทางจัดการไฟล์และ asset ด้วย signed URLs และ cloud object storage.",
              "ใช้ ChatGPT, Codex, Claude, Gemini, Cursor และ GitHub Copilot เป็น workflow ในการคิด สร้าง debug และ prototype.",
            ],
          },
          {
            title: "AI-Assisted Problem Solver / AI & Tech Integrator",
            company: "Independent / AK3 Studio",
            period: "2025 - 2026",
            points: [
              "ใช้ AI เป็น reasoning partner สำหรับวิเคราะห์ปัญหาและช่วยตัดสินใจ.",
              "ทำโจทย์ธุรกิจที่คลุมเครือให้กลายเป็น insight และ action ที่ลงมือได้.",
              "ปรับปรุง efficiency และ business value ระยะยาวให้ SME.",
              "เปลี่ยน requirement ที่ยังไม่ชัดให้เป็น workflow และ execution plan.",
            ],
          },
          {
            title: "IT Programmer / SharePoint & Power Platform Developer",
            company: "C.C.S. Advance Tech Co., Ltd.",
            period: "พ.ย. 2022 - พ.ย. 2025",
            points: [
              "พัฒนาและดูแลระบบองค์กรบน SharePoint 2019 On-Premise.",
              "ทำ workflow automation ด้วย Power Automate.",
              "สร้างฟอร์มและ interface ด้วย JavaScript, jQuery, HTML และ CSS.",
              "เชื่อม SharePoint lists, legacy data และ requirement จากทีมธุรกิจ.",
            ],
          },
          {
            title: "Front-End Developer",
            company: "Absolute Solution Co., Ltd.",
            period: "พ.ย. 2021 - ก.ค. 2022",
            points: [
              "พัฒนา user interfaces ด้วย React, Next.js, Ant Design และ Material UI.",
              "เชื่อมต่อ REST APIs.",
              "ทำงานใน Agile workflow.",
            ],
          },
          {
            title: "Operations Manager",
            company: "Frozen Restaurant",
            period: "ต.ค. 2018 - ธ.ค. 2020",
            points: [
              "ดูแล daily operations, staff coordination และ resource planning.",
              "ปรับ workflow การทำงานและ performance ของทีม.",
              "สะสมประสบการณ์ตัดสินใจจาก operation จริง.",
            ],
          },
          {
            title: "Junior .NET Developer",
            company: "Auction Trade Co., Ltd.",
            period: "ต.ค. 2015 - ก.พ. 2018",
            points: [
              "พัฒนาระบบภายในด้วย C#, .NET Framework และ SQL Server.",
              "แก้ bug และ optimize legacy systems.",
              "สนับสนุนงาน database operations และ maintenance.",
            ],
          },
          {
            title: "Graphic Designer",
            company: "Manta Performing Arts",
            period: "ธ.ค. 2013 - ธ.ค. 2014",
            points: [
              "สร้าง visual assets, branding materials และ stage graphics.",
              "วางพื้นฐานด้าน visual communication และ creative thinking.",
            ],
          },
        ],
      },
      education: {
        eyebrow: "การศึกษา / การพัฒนา",
        title: "พื้นฐานด้าน data, production systems, web development และ electronics.",
        items: [
          {
            program: "Data Analysis with Power BI",
            institution: "AskMe Solutions",
            period: "2024 - ปัจจุบัน",
          },
          {
            program: "SCADA Systems for Production Processes",
            institution: "Rajamangala University of Technology Phra Nakhon",
            period: "2024 - ปัจจุบัน",
          },
          {
            program: "Full-Stack JavaScript Web Development (CodeCamp #9)",
            institution: "Software Park Thailand",
            period: "2021",
            description: "Bootcamp 6 เดือน ครอบคลุม React, UX/UI, Node.js, MySQL และ backend fundamentals.",
          },
          {
            program: "Undergraduate Coursework",
            institution: "Chandrakasem Rajabhat University",
            period: "2013",
            description: "Programming, algorithms, databases และ system fundamentals.",
          },
          {
            program: "Vocational Certificate in Electrical & Electronics",
            institution: "Tak Technical College",
            period: "2010",
            description: "Electronic circuits, electrical systems และ digital/analog fundamentals.",
          },
        ],
      },
      contact: {
        title: "มาเปลี่ยนปัญหาธุรกิจให้เป็นระบบ AI-assisted ที่ใช้ได้จริง.",
        body:
          "เหมาะกับงานเว็บไซต์ธุรกิจ ระบบ customer workflow, process automation และ production-ready web platform.",
        cvActions: {
          copyIdle: "คัดลอก CV.md",
          copyCopied: "คัดลอกแล้ว",
          copyError: "คัดลอกไม่สำเร็จ",
          downloadPdf: "ดาวน์โหลด PDF",
          downloadMarkdown: "ดาวน์โหลด CV.md",
          viewCv: "ดู CV",
        },
      },
    },
  },
};

