export type CareerItem = {
  role: string;
  company: string;
  period: string;
  description: string;
};

export type ProjectItem = {
  title: string;
  category: string;
  tools: string;
  image: string;
  link: string;
  demoLink?: string;
  highlights?: string[];
};

export type WhatIDoItem = {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
};

export const portfolioData = {
  site: {
    title: "Raghav Vats - AI/ML Developer",
  },
  profile: {
    firstName: "Raghav",
    lastName: "Vats",
    initials: "RV",
    headlineTop: "AI/ML Developer",
    headlineWords: ["DSA", "C++ | Java | Python"],
    about:
      "I am a second-year B.Tech Computer Science student at Bennett University specializing in AI/ML. I focus on building practical, real-world systems using data structures, algorithms, and machine learning. I have experience developing full-stack applications, AI-based tools, and deployed systems used in real environments.",
    loaderRoles: ["AI/ML Developer", "DSA Enthusiast", "Full-Stack Builder"],
    heroTagline:
      "Building real-world systems using data, algorithms, and intelligent applications.",
  },
  links: {
    linkedin: "https://www.linkedin.com/in/raghavvxts",
    github: "https://github.com/raghavvxts",
    youtube: "",
    instagram: "https://instagram.com/raghavvxts",
    resume: "/Raghav's Resume.pdf",
  },
  contact: {
    email: "vatsraghav06@gmail.com",
    phone: "+91-7027746467",
  },
  connect: {
    linkedinLabel: "LinkedIn - raghavvxts",
    creditName: "Raghav Vats",
    year: 2026,
  },
  education: [
    "Bennett University - B.Tech in Computer Science (AI/ML), 2024 - 2028, CGPA: 7.42",
    "CBSE Board - Class XII: 76%, Class X: 94.2%",
  ],
  achievements: [
    "Participated in SmartBU Hackathon (SIH internal selection round)",
    "Completed certifications in Data Structures, Machine Learning (Python), and Core Java",
    "Completed coursework in Operating Systems and Computer Networking",
  ],
  careerIntro: "B.Tech CSE (AI/ML), Bennett University (2024 - 2028)",
  whatIDo: [
    {
      title: "CORE SKILLS",
      subtitle: "Problem Solving & Computer Science Foundations",
      description:
        "I use strong fundamentals in data structures, algorithms, and system-level concepts to build robust and maintainable software.",
      tags: [
        "Data Structures & Algorithms",
        "OOP",
        "DBMS",
        "Operating Systems",
        "Computer Networks",
        "Artificial Intelligence",
      ],
    },
    {
      title: "LANGUAGES & TOOLS",
      subtitle: "Building and Deploying Real Projects",
      description:
        "I build full-stack and AI-powered applications with practical tooling, version control, and deployment workflows.",
      tags: [
        "C++",
        "Java",
        "Python",
        "HTML/CSS",
        "Frontend Development",
        "Docker",
        "Git + GitHub",
        "VS Code + Cursor + Copilot",
      ],
    },
  ] as WhatIDoItem[],
  career: [
    {
      role: "First Year",
      company: "",
      period: "2024 - 2025",
      description:
        "Built programming foundations with Python and Java. Focused on problem-solving basics, core programming concepts, and writing clean, structured code through coursework and practice.",
    },
    {
      role: "Second Year",
      company: "",
      period: "2025 - 2026",
      description:
        "Currently concluding second year with Semester 4 exams in May 2026. Learned C++, Data Structures and Algorithms (DSA), and Design and Analysis of Algorithms (DAA), and applied them in projects and coding practice.",
    },
    {
      role: "Third Year (Upcoming)",
      company: "",
      period: "Aug 2026 - 2027",
      description:
        "Starting third year in August 2026, with focus on advancing AI/ML knowledge, building larger systems, and strengthening real-world development experience.",
    },
    {
      role: "Fourth Year (Planned)",
      company: "",
      period: "2027 - 2028",
      description:
        "Final year focused on advanced projects, practical applications, and industry readiness, with expected graduation in 2028.",
    },
    {
      role: "Self-Driven Development",
      company: "Projects and Deployments",
      period: "2024 - Present",
      description:
        "Built and deployed real-world applications, including AI-based and full-stack systems. This includes AgriSense, where device testing was conducted at an agriculture university in Meerut.",
    },
  ] as CareerItem[],
  projects: [
    {
      title: "AI Resume Analyzer & Job Matcher",
      category: "Python, Flask, NLP, Database",
      tools: "Flask, NLP, Authentication, Resume Processing",
      image: "/images/resume-analyzer-ui.png",
      link: "https://github.com/raghavvxts",
      demoLink: "https://aianalysis-resume.vercel.app",
      highlights: [
        "Developed an AI-powered web app to analyze resumes and provide personalized improvement suggestions",
        "Implemented NLP-based keyword extraction and job matching against job descriptions",
        "Built a full-stack system with user authentication and resume upload",
        "Designed backend APIs for real-time analysis and feedback generation",
        "Optimized resume scoring logic to improve keyword match accuracy",
      ],
    },
    {
      title: "AgriSense - AI Expert Diagnostics",
      category: "IoT, AI Diagnostics, Dashboard",
      tools: "Sensor Integration, Monitoring Dashboard, Device Analytics",
      image: "/images/agrisense-ui.png",
      link: "https://github.com/raghavvxts",
      highlights: [
        "Built an AI-powered diagnostics workflow for agriculture-focused decision support",
        "Designed UI for live sensor insights and actionable recommendations",
        "Prepared technical report documenting architecture and system behavior",
        "Completed device testing at an agriculture university in Meerut",
      ],
    },
  ] as ProjectItem[],
  techStack: {
    heading: "Skills Cloud",
    imageUrls: [
      "/images/react2.webp",
      "/images/next2.webp",
      "/images/node2.webp",
      "/images/express.webp",
      "/images/mongo.webp",
      "/images/mysql.webp",
      "/images/typescript.webp",
      "/images/javascript.webp",
    ],
  },
};