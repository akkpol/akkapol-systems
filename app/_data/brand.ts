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
  ],
};

export const homeContent: Record<Locale, HomeContent> = {
  en: {
    localeLabel: "EN",
    alternateLocaleLabel: "TH",
    alternateLocaleHref: "/th",
    hero: {
      brand: "AKKAPOL KUMPAPUG",
      status: "CREATIVE TECHNOLOGIST • SYSTEMS BUILDER",
      role: "Creative AI Systems Builder",
      body: ["I help turn unclear business operations into practical websites,", "workflow systems, and AI-assisted tools that can be tested, used, and improved."],
      primaryCta: "View proof",
      secondaryCta: "Ask me anything",
      mapLabels: {
        clarify: "CLARIFY",
        clarifyBody: "Make the real problem visible",
        design: "DESIGN",
        designBody: "Shape workflows people can use",
        ambiguous: "AMBIGUOUS INPUT",
        ambiguousBody: "Messy work, repeated questions, unclear status",
        build: "BUILD",
        buildBody: "Ship the smallest useful system",
        operate: "OPERATE",
        operateBody: "Improve from real usage",
        result: ["CLEAR WORKFLOW.", "USEFUL SYSTEM."],
      },
      bottomEyebrow: "WHAT I BRING",
      bottomTitle: ["Design sense,", "systems thinking, real builds."],
      bottomBody:
        "My work sits between product thinking, operations, and full-stack execution: clarify the workflow, design the useful path, then build a system a real team can try.",
    },
    sections: {
      services: {
        eyebrow: "Ways to Work Together",
        title: "Start with a clear, useful scope before turning the idea into a bigger system.",
        body:
          "The best first step is usually small enough to test, but concrete enough to change how the work feels. These are the ways I can help without making the project bigger than it needs to be.",
        primaryAction: "Ask me anything",
        secondaryAction: "View proof",
        offers: [
          {
            title: "Business Website",
            icon: "code",
            outcome:
              "A clear website that explains what the business does, builds trust, and gives people an easy way to reach out.",
            bestFor: "SMEs or solo operators who need a credible online presence without a long agency process.",
            scope: [
              "Positioning and page flow",
              "Responsive Next.js build",
              "Contact path or lead capture",
              "Deployment and handoff",
            ],
          },
          {
            title: "Workflow System MVP",
            icon: "workflow",
            outcome:
              "A focused operational prototype for intake, quotation, status tracking, dashboards, or team handoff.",
            bestFor: "Teams that are doing too much inside chat, spreadsheets, or unclear job status.",
            scope: [
              "Workflow mapping first",
              "Smallest useful admin flow",
              "Role-aware actions",
              "Clear state changes",
            ],
          },
          {
            title: "AI Workflow Audit",
            icon: "brain",
            outcome:
              "A practical review of repeated work, AI-assisted steps, automation fit, and a short action plan.",
            bestFor: "Owners who want to use AI carefully, without buying vague automation.",
            scope: [
              "Current workflow review",
              "AI fit and risk check",
              "Human-in-the-loop design",
              "Next useful MVP plan",
            ],
          },
        ],
      },
      work: {
        eyebrow: "Selected Work",
        title:
          "Proof that the work is not just strategy: I turn ideas into systems people can inspect, use, and improve.",
        items: [
          {
            title: "Smart Signage",
            status: "Private working product case study",
            icon: "workflow",
            description:
              "A working product case study for Thai sign-shop operations, built around LINE-first customer intake, quotation flow, payment gates, production visibility, and audit-aware handoff.",
            proofPoints: [
              "Turns a messy sign-shop pipeline into visible workflow states a team can follow.",
              "Connects customer intake, quotation approval, receipts, production status, and job history.",
              "Keeps sensitive actions explicit with roles, audit logs, and operational gates.",
            ],
            tags: ["Workflow clarity", "LINE intake", "ERP MVP", "Audit log"],
            links: sharedWorkLinks.smartSignage,
          },
          {
            title: "RoboForge",
            status: "Public demo + robot owner beta platform",
            icon: "sparkles",
            description:
              "A public demo and beta platform exploring how robot owners claim, set up, and control a physical device through a mobile-first product experience.",
            proofPoints: [
              "Connects product storytelling with real owner workspace and setup flows.",
              "Keeps live motor commands local to the robot Wi-Fi while storing beta evidence in Supabase.",
              "Defines a careful control protocol for status, arming, drive, stop, and device identity.",
            ],
            tags: ["Product judgment", "ESP32", "Owner workflow", "Safety-minded control"],
            links: sharedWorkLinks.roboForge,
          },
        ],
      },
      process: {
        eyebrow: "How I Work",
        title: "I like projects where the first version is small, useful, and honest about what needs to be learned.",
        body:
          "I do not start by guessing a full platform. I start by making the workflow clear, choosing the part worth testing, and building something that can survive real feedback.",
        steps: [
          "Clarify the messy workflow",
          "Design the smallest useful path",
          "Build a working version",
          "Use it, learn from it, and improve",
        ],
      },
      about: {
        eyebrow: "Personal Positioning",
        title: "I sit between creative product thinking, business operations, and full-stack execution.",
        summary:
          "My background runs through software development, SharePoint and Power Platform automation, front-end engineering, operations management, design work, and hands-on AI-assisted development. That mix helps me see more than the screen: I can map the business flow, shape the product experience, and build the first version with enough structure for real people to use.",
      },
      focus: {
        eyebrow: "Brand Pillars",
        title: "The strongest work happens when the system is practical, visible, and guided by human judgment.",
        items: [
          "Workflow clarity before automation",
          "AI as a practical assistant, not a vague promise",
          "Small MVPs that can be tested by real owners",
          "Interfaces that show status, handoff, and next action",
          "Technical execution grounded in business context",
          "Human-in-the-loop control where judgment matters",
        ],
      },
      skills: {
        eyebrow: "Capabilities",
        title: "A practical range for building from problem shape to usable system.",
        items: [
          {
            title: "AI-Assisted Systems",
            icon: "brain",
            items:
              "LLM integration · AI workflow design · agentic prototyping · AI-assisted debugging and implementation",
          },
          {
            title: "Product-Focused Engineering",
            icon: "code",
            items:
              "Next.js · React · TypeScript · JavaScript · Supabase · PostgreSQL · Vercel · cloud deployment",
          },
          {
            title: "Workflow Design",
            icon: "workflow",
            items:
              "Customer intake · quotation/status tracking · CRM-style flows · LINE/LIFF touchpoints · operational handoff",
          },
          {
            title: "Enterprise And Operations",
            icon: "database",
            items:
              "SharePoint 2019 · Power Automate · Power Apps · SQL Server · legacy systems · stakeholder coordination",
          },
        ],
      },
      experience: {
        eyebrow: "Experience",
        title: "A background that connects code, operations, automation, and design.",
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
      brand: "AKKAPOL KUMPAPUG",
      status: "CREATIVE TECHNOLOGIST • นักสร้างระบบ",
      role: "นักสร้างระบบ AI เชิงปฏิบัติ",
      body: ["ผมช่วยเปลี่ยนงานธุรกิจที่กระจัดกระจายให้กลายเป็นเว็บไซต์", "ระบบ Workflow และเครื่องมือ AI ที่ใช้งานจริง ทดสอบได้ และต่อยอดได้"],
      primaryCta: "ดูผลงาน",
      secondaryCta: "สอบถามเพิ่มเติม",
      mapLabels: {
        clarify: "ทำให้ชัด",
        clarifyBody: "เห็นปัญหาจริงก่อนเริ่มสร้าง",
        design: "ออกแบบ",
        designBody: "วาง Workflow ที่ทีมใช้ต่อได้",
        ambiguous: "โจทย์ยังไม่ชัด",
        ambiguousBody: "งานกระจาย ถามซ้ำ สถานะไม่ชัด",
        build: "สร้าง",
        buildBody: "ทำเวอร์ชันเล็กที่มีประโยชน์จริง",
        operate: "ใช้งาน",
        operateBody: "ปรับจากการใช้งานจริง",
        result: ["Workflow ชัด", "ระบบใช้ได้จริง"],
      },
      bottomEyebrow: "สิ่งที่ผมนำมาให้",
      bottomTitle: ["คิดแบบ Product,", "เข้าใจระบบ, สร้างได้จริง"],
      bottomBody:
        "งานของผมอยู่ตรงกลางระหว่าง product thinking, operations และ full-stack execution: ทำ workflow ให้ชัด ออกแบบทางที่ใช้ได้จริง แล้วสร้างระบบเวอร์ชันแรกให้ทีมลองใช้ได้.",
    },
    sections: {
      services: {
        eyebrow: "รูปแบบงานที่เริ่มคุยกันได้",
        title: "เริ่มจากขอบเขตที่ชัดและมีประโยชน์ ก่อนค่อยต่อยอดเป็นระบบที่ใหญ่ขึ้น.",
        body:
          "หลายโปรเจกต์ไม่จำเป็นต้องเริ่มจากระบบใหญ่ทันที สิ่งที่คุ้มกว่าคือเริ่มจากส่วนที่ทดสอบได้จริง ช่วยให้เจ้าของหรือทีมเห็นภาพ และค่อยขยายจากสิ่งที่ใช้งานแล้ว.",
        primaryAction: "สอบถามเพิ่มเติม",
        secondaryAction: "ดูผลงาน",
        offers: [
          {
            title: "เว็บไซต์ธุรกิจ",
            icon: "code",
            outcome:
              "เว็บไซต์ที่อธิบายธุรกิจให้ชัดขึ้น ดูน่าเชื่อถือ และมีช่องทางให้ลูกค้าติดต่อได้ง่าย.",
            bestFor: "SME หรือเจ้าของธุรกิจที่อยากมีเว็บจริงจัง โดยไม่ต้องเริ่มจาก process ที่ซับซ้อน.",
            scope: [
              "วาง positioning และลำดับเนื้อหา",
              "พัฒนาเว็บ responsive ด้วย Next.js",
              "วางช่องทางติดต่อหรือรับ lead",
              "Deploy และส่งมอบให้ใช้งานต่อได้",
            ],
          },
          {
            title: "Workflow System MVP",
            icon: "workflow",
            outcome:
              "Prototype ระบบหลังบ้านสำหรับรับข้อมูลลูกค้า ใบเสนอราคา ติดตามสถานะ dashboard หรือ handoff งาน.",
            bestFor: "ทีมที่งานกระจายอยู่ในแชต spreadsheet หรือไม่รู้ว่างานแต่ละชิ้นอยู่ขั้นตอนไหน.",
            scope: [
              "ทำ workflow ให้เห็นภาพก่อน",
              "สร้าง admin flow ที่จำเป็นที่สุด",
              "แยกบทบาทและ action สำคัญ",
              "ทำสถานะงานให้ตรวจสอบได้",
            ],
          },
          {
            title: "AI Workflow Audit",
            icon: "brain",
            outcome:
              "รีวิวงานซ้ำ จุดที่ AI ช่วยได้ ความเสี่ยงที่ต้องระวัง และแผนสั้น ๆ สำหรับเริ่มทำจริง.",
            bestFor: "เจ้าของธุรกิจที่อยากใช้ AI แบบมีทิศทาง ไม่ใช่ซื้อ automation แบบกว้าง ๆ.",
            scope: [
              "ดู workflow ปัจจุบัน",
              "ประเมินว่า AI เหมาะกับจุดไหน",
              "ออกแบบ human-in-the-loop",
              "กำหนด MVP ถัดไปที่คุ้มที่สุด",
            ],
          },
        ],
      },
      work: {
        eyebrow: "ผลงานที่เลือกมา",
        title: "ตัวอย่างงานที่แสดงวิธีคิดของผม: ทำโจทย์ให้ชัด ออกแบบ flow แล้วสร้างระบบที่ลองใช้ได้จริง.",
        items: [
          {
            title: "Smart Signage",
            status: "Private working product case study",
            icon: "workflow",
            description:
              "Working product case study สำหรับงาน operation ของร้านป้ายไทย ครอบคลุมการรับลูกค้าผ่าน LINE, ใบเสนอราคา, payment gate, สถานะผลิต และ handoff งานที่ตรวจสอบได้.",
            proofPoints: [
              "แปลง pipeline ร้านป้ายที่กระจัดกระจายให้เป็นสถานะงานที่ทีมเห็นร่วมกัน.",
              "เชื่อมการรับข้อมูลลูกค้า การอนุมัติราคา ใบเสร็จ สถานะผลิต และประวัติงาน.",
              "แยก action สำคัญด้วย role, audit log และ gate เพื่อให้ operation คุมได้มากขึ้น.",
            ],
            tags: ["Workflow clarity", "LINE intake", "ERP MVP", "Audit log"],
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
              "Public demo และ beta platform ที่สำรวจว่าเจ้าของ robot จะ claim, setup และควบคุมอุปกรณ์จริงผ่าน product experience ที่เข้าใจง่ายได้อย่างไร.",
            proofPoints: [
              "เชื่อม product storytelling กับ owner workspace และ setup flow ที่จับต้องได้.",
              "แยก live motor commands ให้อยู่บน local robot Wi-Fi และเก็บ beta evidence ใน Supabase.",
              "กำหนด control protocol สำหรับ status, arming, drive, stop และ identity ของอุปกรณ์.",
            ],
            tags: ["Product judgment", "ESP32", "Owner workflow", "Safety-minded control"],
            links: [
              {
                ...sharedWorkLinks.roboForge[0],
                label: "เปิดเดโม",
              },
            ],
          },
        ],
      },
      process: {
        eyebrow: "วิธีทำงาน",
        title: "ผมชอบเริ่มจากเวอร์ชันเล็กที่มีประโยชน์จริง และซื่อสัตย์กับสิ่งที่ต้องเรียนรู้ต่อ.",
        body:
          "ผมไม่ได้เริ่มจากการเดาว่าระบบใหญ่ควรหน้าตาอย่างไร แต่เริ่มจาก workflow จริง เลือกส่วนที่ควรทดสอบก่อน แล้วสร้างให้พอใช้งานจริงเพื่อรับ feedback.",
        steps: [
          "ทำ workflow ที่ยุ่งให้ชัด",
          "ออกแบบทางที่เล็กแต่มีประโยชน์",
          "สร้างเวอร์ชันที่ใช้งานได้จริง",
          "ใช้จริง เรียนรู้ แล้วค่อยปรับ",
        ],
      },
      about: {
        eyebrow: "ตัวตนของงาน",
        title: "ผมอยู่ตรงกลางระหว่าง product thinking, business operation และการสร้างระบบจริง.",
        summary:
          "ประสบการณ์ของผมเชื่อมหลายด้านเข้าด้วยกัน: software development, SharePoint และ Power Platform automation, front-end engineering, operations management, งาน design และการใช้ AI ช่วยคิด/สร้าง/ทดลองระบบ จุดแข็งคือผมไม่ได้มองแค่หน้าเว็บหรือโค้ด แต่มอง flow ของธุรกิจ วิธีที่ทีมทำงาน และสิ่งที่ควรสร้างเป็นเวอร์ชันแรกให้คนใช้ได้จริง.",
      },
      focus: {
        eyebrow: "หลักคิดของแบรนด์",
        title: "ระบบที่ดีควรใช้งานได้จริง มองเห็นสถานะชัด และยังมีพื้นที่ให้คนตัดสินใจในจุดสำคัญ.",
        items: [
          "ทำ Workflow ให้ชัดก่อนค่อย automate",
          "ใช้ AI เป็นผู้ช่วย ไม่ใช่คำสัญญากว้าง ๆ",
          "เริ่มจาก MVP ที่เจ้าของหรือทีมลองใช้ได้จริง",
          "ออกแบบหน้าจอให้เห็นสถานะ handoff และ next action",
          "สร้างระบบโดยเข้าใจบริบทธุรกิจ",
          "เก็บ human-in-the-loop ไว้ในจุดที่ต้องใช้ judgment",
        ],
      },
      skills: {
        eyebrow: "ความสามารถที่ใช้สร้างงาน",
        title: "จากโจทย์ที่ยังไม่ชัด ไปจนถึงระบบที่เริ่มใช้งานได้จริง.",
        items: [
          {
            title: "AI-Assisted Systems",
            icon: "brain",
            items:
              "LLM integration · AI workflow design · agentic prototyping · ใช้ AI ช่วย debug และ implement งานจริง",
          },
          {
            title: "Product-Focused Engineering",
            icon: "code",
            items:
              "Next.js · React · TypeScript · JavaScript · Supabase · PostgreSQL · Vercel · cloud deployment",
          },
          {
            title: "Workflow Design",
            icon: "workflow",
            items:
              "Customer intake · quotation/status tracking · CRM-style flows · LINE/LIFF touchpoints · operational handoff",
          },
          {
            title: "Enterprise And Operations",
            icon: "database",
            items:
              "SharePoint 2019 · Power Automate · Power Apps · SQL Server · legacy systems · stakeholder coordination",
          },
        ],
      },
      experience: {
        eyebrow: "ประสบการณ์",
        title: "เชื่อมงานโค้ด operation automation และ design เข้าด้วยกัน.",
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

