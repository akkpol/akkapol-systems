export type IconName =
  | "arrow"
  | "sparkles"
  | "workflow"
  | "code"
  | "database"
  | "figma"
  | "brain"
  | "mail"
  | "phone"
  | "map";

export type Skill = {
  title: string;
  icon: IconName;
  items: string;
};

export type Experience = {
  title: string;
  company: string;
  period: string;
  points: string[];
};

export type Strength = {
  title: string;
  description: string;
};

export type Education = {
  program: string;
  institution: string;
  period: string;
  description?: string;
};

export const cv = {
  profile: {
    name: "Akkapol Kumpapug",
    displayName: "AKKAPOL KUMPAPUG",
    role: "AI Systems Builder & Problem Solver",
    tagline: "AI-Integrated Systems · Workflow Design · Practical Execution",
    location: "Bangkok, Thailand",
    phone: "+66 961195161",
    email: "akkapol.kumpapug@gmail.com",
    linkedin: "linkedin.com/in/akkapol-kumpapug",
    portfolio: "akkapol-systems.vercel.app",
  },
  summary:
    "AI-integrated systems builder with a background in full-stack development, SharePoint and Power Platform automation, workflow systems, and operational problem-solving. Experienced in designing practical AI-assisted business systems that combine LLM tooling, agentic development workflows, cloud infrastructure, CRM-style operational flows, customer intake, quotation/status tracking, and production-ready web systems. Strong foundation in real-world enterprise systems execution, legacy system support, front-end engineering, and operations management. Focused on turning business ambiguity into clear workflow states, usable interfaces, customer visibility, and scalable operational processes.",
  currentFocus: [
    "2026-ready AI-integrated business systems",
    "Agentic workflow design",
    "SME operational automation",
    "Customer intake systems",
    "Quotation and status tracking",
    "Production workflow visibility",
    "Practical AI-assisted software development",
  ],
  coreCompetencies: [
    "LLM Integration & AI Workflow Orchestration",
    "Agentic Workflow Design",
    "AI-assisted coding, debugging & prototyping",
    "Next.js / React / TypeScript / JavaScript",
    "Supabase / PostgreSQL / SQL Server",
    "Vercel / Firebase / GCP / Cloudflare R2",
    "LINE Messaging API / LIFF / MINI App flows",
    "REST APIs / Webhooks / Signed URLs",
    "SharePoint 2019 / Power Automate / Power Apps",
    "CRM workflows, intake, quote/status tracking",
    "Git / Cursor / GitHub Copilot / Codex",
  ],
  skills: [
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
  ] satisfies Skill[],
  strengths: [
    {
      title: "AI-Driven Thinking",
      description: "Uses AI to improve decision quality, not just speed.",
    },
    {
      title: "Systems Builder",
      description: "Designs and ships real operational systems end-to-end.",
    },
    {
      title: "Ambiguity to Clarity",
      description: "Turns unclear business needs into workflow states.",
    },
    {
      title: "Stakeholder Bridge",
      description: "Communicates across technical and non-technical teams.",
    },
    {
      title: "Practical Execution",
      description: "Grounded in real operational and business experience.",
    },
  ] satisfies Strength[],
  experience: [
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
  ] satisfies Experience[],
  education: [
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
  ] satisfies Education[],
};

function linesToBullets(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

function experienceToMarkdown(job: Experience) {
  return [
    `## ${job.title}`,
    `**${job.company} | ${job.period}**`,
    "",
    linesToBullets(job.points),
  ].join("\n");
}

function educationToMarkdown(item: Education) {
  return [
    `## ${item.program}`,
    `${item.institution} | ${item.period}`,
    item.description ? `\n${item.description}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export const cvMarkdown = [
  `# ${cv.profile.displayName}`,
  "",
  `**${cv.profile.role}**`,
  "",
  "## Contact",
  linesToBullets([
    `Location: ${cv.profile.location}`,
    `Phone: ${cv.profile.phone}`,
    `Email: ${cv.profile.email}`,
    `LinkedIn: ${cv.profile.linkedin}`,
    `Portfolio: ${cv.profile.portfolio}`,
  ]),
  "",
  "---",
  "",
  "## Executive Summary",
  "",
  cv.summary,
  "",
  "---",
  "",
  "## Current Focus",
  "",
  linesToBullets(cv.currentFocus),
  "",
  "---",
  "",
  "## Core Competencies",
  "",
  linesToBullets(cv.coreCompetencies),
  "",
  "---",
  "",
  "## Strengths",
  "",
  cv.strengths
    .map((strength) => `### ${strength.title}\n${strength.description}`)
    .join("\n\n"),
  "",
  "# Experience",
  "",
  cv.experience.map(experienceToMarkdown).join("\n\n"),
  "",
  "# Education",
  "",
  cv.education.map(educationToMarkdown).join("\n\n"),
  "",
].join("\n");

export const cvFiles = {
  markdown: "/Akkapol_Kumpapug_CV.md",
  pdf: "/Akkapol_Kumpapug_CV.pdf",
  view: "/cv",
};
