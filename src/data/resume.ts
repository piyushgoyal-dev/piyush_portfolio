import { EMAIL, GITHUB_URL, LINKEDIN_URL, RESUME_URL } from '@/config/links';
import aboutImg from '@/Assets/Green-Cartoon-Image-900.jpg';
import backendImg from '@/Assets/Backend.jpeg';
import cloudImg from '@/Assets/cloud.jpeg';
import frontendImg from '@/Assets/Frontend.jpeg';
import integrationsImg from '@/Assets/Integrations.jpeg';
import softSkillsImg from '@/Assets/Skills.jpeg';
import toolsImg from '@/Assets/Tools.jpeg';

// ─────────────────────────────────────────────────────────────
//  All résumé content for the site. Edit text and links here.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Piyush Goyal',
  title: 'Full-Stack Developer',
  location: 'Fatehabad, Haryana',
  resume: RESUME_URL, // set in src/config/links.ts
  email: EMAIL, // set in src/config/links.ts
  phone: '+91 98967 87236',
  phoneHref: '+919896787236',
  linkedin: LINKEDIN_URL, // set in src/config/links.ts
  github: GITHUB_URL,
};

// About page: heading (the `highlight` words get a hand-drawn circle), story paragraphs
// written from the résumé, and the illustration on the right.
export const about = {
  heading: { before: 'I turn ideas into products', highlight: 'people trust', after: '.' },
  paragraphs: [
    "I'm Piyush — a full-stack developer from Fatehabad, Haryana. I work across React.js, Node.js, Express and MongoDB, and I enjoy owning a product end-to-end: from the database schema and REST APIs to the interface and the server it runs on.",
    'My journey started in R&D. At Artanes I built a role-based health management system with JWT authentication and a Web Speech voice recorder, and deployed it on AWS EC2 with Nginx and PM2. At Healee I built a scheduling platform with five isolated role portals and worked with AI engineers to bring Google Calendar into AI-driven scheduling.',
    'Today I freelance as a frontend and Shopify developer — redesigning interfaces into conversion-focused React components, building Shopify storefronts end-to-end with Razorpay payments, and adding 3D and motion with Three.js and GSAP when a product deserves to feel alive.',
    'What I care about most: security built in from day one, interfaces that are fast and accessible, and shipping work that real users can depend on.',
  ],
  image: aboutImg, // src/Assets/Green-Cartoon-Image-900.jpg (optimised copy of Green-Cartoon-Image.png)
  imageAlt: 'Illustration of Piyush in a green shirt, smiling and holding a coffee mug',
};

const healeePoints = [
  'Designed UI/UX and developed scalable full-stack apps with React.js, Node.js and MongoDB.',
  'Partnered with AI engineers to integrate Google Calendar into AI-driven scheduling pilots.',
  'Built a secure Healthcare Schedule Optimization platform with isolated portals for Students, Parents, Providers, Admins and Coordinators, with no cross-role access.',
  "Modeled linked Student/Parent/Provider profiles (20+ fields per relation) so parents could manage their child's data from their own dashboard.",
  'Automated appointment confirmation emails with Nodemailer and embedded Google Calendar for shared real-time visibility.',
  'Admins manage all appointments; Coordinators define profile-based intake questions (preferred time, reason for visit, language).',
];

const artanesPoints = [
  'Built a secure, role-based health management system (5 portals) powered by REST APIs.',
  'Integrated Google Calendar scheduling; Admins/Coordinators manage student data and profile questions.',
  'Developed the Care Plan Health login/signup with JWT auth, HTTP-cookie sessions and Mongoose schema validation.',
  'Built a role-based Admin/User login system with distinct UIs and permissions.',
  'Integrated a Voice Recorder (Web Speech Recognition API) and a Stopwatch.',
  'Deployed on AWS EC2 with Nginx and PM2.',
];

export const experience = [
  {
    role: 'Freelance Frontend / UI & Shopify Developer',
    company: 'Freelance · Remote',
    period: '2026 – Present',
    points: [
      'Partner with a fellow developer to design, build and enhance UIs for client projects, including digital marketing and coupon/deals platforms.',
      'Redesign existing UIs with modern, conversion-focused layouts as responsive, production-ready React.js components.',
      'Designed and customized multiple Shopify storefronts (makeup, farming and more) end-to-end, using Shopify AI Chat for extra custom animated sections.',
      'Set up Razorpay payments on Shopify and structured client content into header, navbar, footer, FAQ, image-comparison sliders, contact forms and animated video sections.',
    ],
  },
  {
    role: 'Full-Stack Developer Intern',
    company: 'Healee – R&D · Remote',
    period: 'Apr 2024 – Dec 2024',
    points: healeePoints,
  },
  {
    role: 'Software Engineer',
    company: 'Artanes – R&D · Remote',
    period: 'Jan 2024 – Mar 2024',
    points: artanesPoints,
  },
];

// Empty liveUrl / githubUrl hide those links.
export const projects = [
  {
    id: 'mercedes',
    title: 'Mercedes-Benz 3D – Interactive Car Showcase',
    category: '3D',
    summary: 'Scroll-driven 3D car site with live drive modes and color customizer.',
    tech: ['React', 'Three.js', 'GSAP'],
    points: [
      'Scroll-driven 3D site with a cinematic hero video and a live speedometer switching drive modes (Ice, Sand, Off-road, Comfort) in sync with RGB lighting.',
      "Real-time car color customization that updates the 3D model's material on click.",
      'Scroll-triggered color transitions, a product showcase with customer imagery and an animated footer.',
      'Fully responsive; deployed via GitHub + Vercel.',
    ],
    liveUrl: '',
    githubUrl: '',
  },
  {
    id: 'tasks',
    title: 'Task Management App',
    category: 'Full-Stack',
    summary: 'Secure project boards with JWT auth, bcrypt and full CRUD APIs.',
    tech: ['React', 'Node', 'Express', 'MongoDB', 'JWT', 'bcrypt'],
    points: [
      'JWT authentication; passwords hashed with bcrypt so plaintext is never stored.',
      'Secure change-password flow verifying the current password first.',
      'Project-specific task boards (Todo / In Progress / Done) by priority, category and due date; profile management and account deletion.',
      'Global theming with CSS variables in one file; Error Boundaries with fallback pages; React.lazy code-splitting.',
      'Full CRUD REST APIs; responsive; deployed on Vercel.',
    ],
    liveUrl: '',
    githubUrl: '',
  },
  {
    id: 'flowers',
    title: 'Flower Bouquet – Handmade Ribbon Bouquets',
    category: 'E-Commerce',
    summary: 'Bouquet store with separate Admin and User flows and dashboards.',
    tech: ['React', 'Node', 'Express', 'MongoDB', 'Cloudinary'],
    points: [
      'Completely separate Admin and User login/signup flows and dashboards.',
      'Admin dashboard for products, registered users and contact-form inquiries via REST APIs.',
      'Cloudinary image storage; Home, About, Products and Contact routes with category browsing and cart.',
      'Google Maps embed on Contact; reusable CSS-variable system; deployed on Vercel.',
    ],
    liveUrl: '',
    githubUrl: '',
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Website',
    category: 'E-Commerce',
    summary: 'Role-based store with Razorpay payments and a live admin dashboard.',
    tech: ['React', 'Node', 'Express', 'MongoDB', 'Razorpay'],
    points: [
      'JWT auth with role-based Admin/User access.',
      'Razorpay test-mode payments (UPI, cards, QR, COD) and Nodemailer emails.',
      'Cloudinary media; real-time admin dashboard for orders and inventory; deployed on Render.',
    ],
    liveUrl: '',
    githubUrl: '',
  },
  {
    id: 'healee',
    title: 'Healthcare Schedule Optimization',
    category: 'Full-Stack',
    summary: 'Healee R&D — five isolated role portals with Google Calendar scheduling.',
    tech: ['React', 'Node', 'MongoDB', 'Google Calendar', 'Nodemailer'],
    points: healeePoints,
    liveUrl: '',
    githubUrl: '',
  },
  {
    id: 'artanes',
    title: 'Health Management System',
    category: 'Full-Stack',
    summary: 'Artanes R&D — role-based health portals deployed on AWS EC2.',
    tech: ['React', 'Node', 'MongoDB', 'JWT', 'AWS EC2', 'Nginx', 'PM2'],
    points: artanesPoints,
    liveUrl: '',
    githubUrl: '',
  },
];

// Skills carousel: one card per group. `image` can be a URL, a file in public/, or an import from src/Assets.
// usedIn / highlight are taken from the résumé above — keep them factual.
export const skills = [
  {
    category: 'Frontend',
    subtitle: 'Interfaces & motion',
    icon: 'layout',
    image: frontendImg, // src/Assets/Frontend.jpeg
    items: ['React.js', 'Three.js', 'GSAP', '3D/Scroll Animation', 'CSS Custom Properties', 'React.lazy', 'Error Boundaries'],
    usedIn: 'Mercedes-Benz 3D, Task Manager, Flower Bouquet, E-Commerce',
    highlight: 'Scroll-driven 3D scenes with Three.js & GSAP',
  },
  {
    category: 'Backend',
    subtitle: 'APIs, auth & data',
    icon: 'server',
    image: backendImg, // src/Assets/Backend.jpeg
    items: ['Node.js', 'Express.js', 'REST APIs', 'JWT', 'bcrypt', 'Mongoose', 'MongoDB'],
    usedIn: 'Healee, Artanes, Task Manager, E-Commerce',
    highlight: 'Role-based portals with JWT + bcrypt auth',
  },
  {
    category: 'Cloud/DevOps',
    subtitle: 'Shipping to production',
    icon: 'cloud',
    image: cloudImg, // src/Assets/cloud.jpeg
    items: ['AWS EC2', 'AWS Lambda', 'Docker', 'Nginx', 'PM2', 'SSL', 'Render', 'Vercel'],
    usedIn: 'Artanes (AWS EC2), E-Commerce (Render), Task Manager (Vercel)',
    highlight: 'AWS EC2 deploys with Nginx and PM2',
  },
  {
    category: 'Integrations',
    subtitle: 'Payments, media & more',
    icon: 'plug',
    image: integrationsImg, // src/Assets/Integrations.jpeg
    items: ['Razorpay', 'Cloudinary', 'Nodemailer', 'Google Calendar API', 'Web Speech Recognition API'],
    usedIn: 'E-Commerce, Flower Bouquet, Healee, Artanes',
    highlight: 'Razorpay payments: UPI, cards, QR and COD',
  },
  {
    category: 'Tools',
    subtitle: 'Everyday workflow',
    icon: 'git',
    image: toolsImg, // src/Assets/Tools.jpeg
    items: ['Git/GitHub', 'VS Code'],
    usedIn: 'Every project',
    highlight: 'GitHub → Vercel deploys',
  },
  {
    category: 'Soft skills',
    subtitle: 'How I work',
    icon: 'users',
    image: softSkillsImg, // src/Assets/Skills.jpeg
    items: ['Communication', 'Time Management', 'Problem Solving', 'Creative Thinking'],
    usedIn: 'Client, team & freelance work',
    highlight: 'Partnering with AI engineers and fellow developers',
  },
];
