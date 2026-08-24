/**
 * Single source of truth for every string on the site.
 * Structured facts come from the 2026 resume; the longer narrative framing is
 * carried over from the previous portfolio build.
 */

export const OPERATOR = {
  callsign: "SHASHANK",
  /** The one name the site uses, everywhere. */
  name: "Shashank Mourya",
  role: "AI Systems Engineer",
  secondaryRole: "QA & Automation Lead",
  location: "Pune, India",
  email: "shashankmourya00@gmail.com",
  phone: "+91 95663 12065",
  linkedin: "https://www.linkedin.com/in/shashank-mourya-it",
  github: "https://github.com/Shashank-mourya",
  resume: "/Shashank_Mourya_Resume.pdf",
  tagline: "I build systems that hold up under load, under scrutiny, and offline.",
  bio: [
    "Information Technology undergraduate at MMCOE Pune, and an AI systems engineer with live production experience — two months at Nerumach.AI, promoted from QA / Automation Engineer to QA Lead inside the first month.",
    "The work runs from computer vision and gradient-boosted forensics through to real-time WebXR, in C++17, Python and TypeScript. The bias throughout is privacy-first architecture, measurable performance, and engineering you can actually test.",
  ],
};

/** Top-line numbers for the hero readout. Kept short — a HUD does not explain itself. */
export const VITALS = [
  { label: "CGPA", value: "9.01", unit: "/ 10" },
  { label: "HACKATHON FINALS", value: "04", unit: "cleared" },
  { label: "SHIPPED", value: "05", unit: "systems" },
];

export type Mission = {
  id: string;
  index: string;
  name: string;
  codename: string;
  status: "DEPLOYED" | "ACTIVE" | "ARCHIVED";
  classification: string;
  summary: string;
  brief: string[];
  stack: string[];
  metrics: { label: string; value: string }[];
  accent: "cyan" | "magenta" | "amber";
};

/**
 * Ordered by the priority the brief asked for: InsureTrust, Drishti, FlowState,
 * then the remaining shipped work.
 */
export const MISSIONS: Mission[] = [
  {
    id: "insuretrust",
    index: "M-01",
    name: "InsureTrust",
    codename: "FORENSIC LEDGER",
    status: "DEPLOYED",
    classification: "Multi-layered forensic insurance verification",
    summary:
      "An end-to-end forensic pipeline that catches insurance fraud by reading what a claim document does not say out loud — its integrity artefacts and its image metadata.",
    brief: [
      "Built an end-to-end forensic ecosystem that detects insurance fraud by analysing document integrity and image metadata rather than self-reported claim fields.",
      "Engineered a multi-layered verification pipeline pairing XGBoost risk scoring with image forensic algorithms, so a claim has to survive both a statistical and a pixel-level check before it clears.",
      "Designed the layers to fail independently: a forged document that beats the metadata check still has to beat the risk model, and vice versa.",
    ],
    stack: ["Python", "XGBoost", "Image Forensics", "Machine Learning", "Feature Engineering"],
    metrics: [
      { label: "LAYERS", value: "MULTI" },
      { label: "MODEL", value: "XGBOOST" },
      { label: "SIGNAL", value: "DOC + EXIF" },
    ],
    accent: "cyan",
  },
  {
    id: "drishti",
    index: "M-02",
    name: "Drishti AI",
    codename: "SPATIAL VOICE",
    status: "DEPLOYED",
    classification: "Computer vision navigation & safety system",
    summary:
      "Real-time obstacle detection for the visually impaired, speaking back in Hinglish — because the language a warning arrives in decides whether it lands in time.",
    brief: [
      "Architected a real-time navigation assistance system using computer vision for obstacle detection and spatial awareness.",
      "Integrated a custom Hinglish audio guidance layer so alerts arrive in the register the user actually thinks in, not translated English.",
      "Optimised the detection models for low-latency inference — in a safety-critical loop, a late correct answer is a wrong answer.",
    ],
    stack: ["Computer Vision", "Python", "CNNs", "Multilingual NLP", "Audio Processing"],
    metrics: [
      { label: "LOOP", value: "REAL-TIME" },
      { label: "OUTPUT", value: "HINGLISH" },
      { label: "TARGET", value: "EDGE" },
    ],
    accent: "magenta",
  },
  {
    id: "flowstate",
    index: "M-03",
    name: "FlowState",
    codename: "COGNITIVE TELEMETRY",
    status: "ACTIVE",
    classification: "Privacy-first productivity & cognitive load predictor",
    summary:
      "Behavioural telemetry that predicts burnout risk from how you work, never from what you write. Every model runs locally; nothing leaves the machine.",
    brief: [
      "Built a user-space, privacy-first behavioural orchestrator that monitors cognitive load and predicts burnout risk from non-content telemetry.",
      "Ran all machine learning locally, so behavioural metrics never leave the user's machine — no keystrokes stored, no content read.",
      "Dynamically adjusts the work environment in response to real-time cognitive stress indicators, rather than reporting on the damage afterwards.",
    ],
    stack: ["Behavioral Telemetry", "Machine Learning", "User-Space Orchestration", "Python"],
    metrics: [
      { label: "INFERENCE", value: "ON-DEVICE" },
      { label: "CONTENT", value: "NONE" },
      { label: "XENIA '26", value: "TOP 6" },
    ],
    accent: "cyan",
  },
  {
    id: "lunarcomm",
    index: "M-04",
    name: "LunarComm",
    codename: "SHADOW RELAY",
    status: "DEPLOYED",
    classification: "WebXR simulation of the ISRO–JAXA LUPEX lunar mission",
    summary:
      "A live WebXR simulation of the lunar south pole, demonstrating RFC 9171 delay-tolerant networking for rovers working inside permanently shadowed regions.",
    brief: [
      "Developed a live WebXR Lunar South Pole simulation demonstrating the RFC 9171 DTN protocol for rover communications inside permanently shadowed regions.",
      "Architected a Firebase-powered real-time state system implementing genuine store-and-forward bundle queuing, so the simulation survives connectivity loss the way the real link has to.",
      "Built a dual-interface demo: a mobile 'rover' trigger and a mission control dashboard with live connection visualisation and redundancy.",
      "Rendered the lunar surface for Meta Quest 2 in-browser with physically-motivated lighting and interactive animations.",
      "Benchmarked the architecture against NASA LunaNet and SpaceX Starlink, proposing a robot-deployable ground relay mesh to close the last-mile line-of-sight gaps.",
    ],
    stack: ["React", "TypeScript", "Three.js / R3F", "WebXR", "Vite", "Firebase RTDB"],
    metrics: [
      { label: "FARAWAY", value: "TOP 100" },
      { label: "FIELD", value: "11,000+" },
      { label: "PROTOCOL", value: "RFC 9171" },
    ],
    accent: "amber",
  },
  {
    id: "impulse-route",
    index: "M-05",
    name: "Impulse Route",
    codename: "PATHFINDER",
    status: "ARCHIVED",
    classification: "National-level AI routing solution",
    summary:
      "A high-efficiency routing engine for complex logistics, tuned for path optimisation and resource allocation at national scale.",
    brief: [
      "Engineered a high-efficiency routing engine for complex logistics, focused on path optimisation and resource allocation.",
      "Refined algorithmic performance against large-scale datasets to keep the engine viable at national-level deployment size.",
      "Secured a place in the Top 77 of 1,600+ teams at the IGNISIA '26 National-Level AI Hackathon.",
    ],
    stack: ["AI Algorithms", "Data Structures", "Path Optimisation", "C++"],
    metrics: [
      { label: "IGNISIA", value: "TOP 77" },
      { label: "FIELD", value: "1,600+" },
      { label: "PERCENTILE", value: "TOP 5%" },
    ],
    accent: "amber",
  },
];

export type LoadoutSlot = {
  slot: string;
  category: string;
  items: { name: string; tier: number; note?: string }[];
};

/**
 * Tier is a 1–5 proficiency read, used to draw the loadout bars.
 * Written as a self-assessment, so the section header says so.
 */
export const LOADOUT: LoadoutSlot[] = [
  {
    slot: "PRIMARY",
    category: "Languages",
    items: [
      { name: "C++17", tier: 5, note: "Systems, DSA, performance work" },
      { name: "Python", tier: 5, note: "ML, forensics, tooling" },
      { name: "TypeScript", tier: 4, note: "React, WebXR, real-time UI" },
      { name: "SQL", tier: 4, note: "Schema design, query tuning" },
      { name: "Java", tier: 3, note: "OOP coursework, JVM fundamentals" },
    ],
  },
  {
    slot: "SECONDARY",
    category: "AI / ML",
    items: [
      { name: "Computer Vision", tier: 5, note: "Detection, spatial awareness" },
      { name: "XGBoost", tier: 4, note: "Risk scoring, tabular forensics" },
      { name: "CNNs", tier: 4, note: "Low-latency inference" },
      { name: "LLMs", tier: 4, note: "Applied integration" },
      { name: "Image Forensics", tier: 4, note: "Tamper detection" },
    ],
  },
  {
    slot: "ABILITY",
    category: "QA & Automation",
    items: [
      { name: "Test Case Design", tier: 5, note: "Structured, reproducible" },
      { name: "Regression & Smoke", tier: 5, note: "Owned per release cycle" },
      { name: "Automation Scripting", tier: 4, note: "Repeatable suites" },
      { name: "Bug Triage", tier: 5, note: "Closed inside the sprint" },
      { name: "Release Sign-off", tier: 4, note: "As QA Lead" },
    ],
  },
  {
    slot: "GEAR",
    category: "Frameworks & Hardware",
    items: [
      { name: "React / R3F", tier: 4, note: "Three.js, WebXR" },
      { name: "Git", tier: 5, note: "Branching, review flow" },
      { name: "REST APIs", tier: 4, note: "Design and integration" },
      { name: "STM32 / ESP32", tier: 3, note: "Embedded firmware" },
      { name: "Vite / Firebase", tier: 4, note: "Real-time state" },
    ],
  },
];

export type TelemetryEntry = {
  sector: string;
  window: string;
  title: string;
  org: string;
  kind: "ROLE" | "AWARD" | "EDUCATION" | "SERVICE";
  /** 0–100, drives the telemetry trace height. Reads as intensity of the period. */
  load: number;
  detail: string[];
};

/**
 * Ordered newest first, matching the way a race engineer reads a lap chart back.
 */
export const TELEMETRY: TelemetryEntry[] = [
  {
    sector: "S1",
    window: "AUG 2026 — PRESENT",
    title: "AI/ML Head",
    org: "IT Tech Club, MMCOE",
    kind: "ROLE",
    load: 78,
    detail: [
      "Selected to head the AI/ML vertical, owning technical direction for the club's AI initiatives.",
      "Runs hands-on sessions, workshops and project mentorship in machine learning and computer vision.",
      "Mentors juniors through project builds and hackathon prep, growing an active contributor base.",
    ],
  },
  {
    sector: "S1",
    window: "16 JUN 2026 — 16 AUG 2026",
    title: "QA / Automation Engineer → QA Lead",
    org: "Nerumach.AI · Live Project",
    kind: "ROLE",
    load: 96,
    detail: [
      "Owned functional, regression and exploratory testing for a live production product, authoring structured test cases and reproducible defect reports every sprint.",
      "Built and maintained automation scripts for repeatable regression suites, cutting manual verification per release and catching regressions before staging.",
      "Promoted to QA Lead after one month — took ownership of QA strategy, the test plan, and release quality.",
      "Assigned test scope, reviewed peer test cases, and consolidated reporting for stakeholders.",
    ],
  },
  {
    sector: "S2",
    window: "2026",
    title: "Winner — 1st of 3,200+ teams",
    org: "MIT ADT AI Grand Challenge",
    kind: "AWARD",
    load: 100,
    detail: [
      "First place nationwide for a high-impact AI prototype.",
      "Awarded a ₹1,00,000 cash prize for technical excellence and innovation in AI systems.",
    ],
  },
  {
    sector: "S2",
    window: "2026",
    title: "Top 100 of 11,000+ teams",
    org: "FarAway 2026",
    kind: "AWARD",
    load: 91,
    detail: [
      "Top 0.9% nationally, for the LunarComm WebXR lunar communications simulation.",
    ],
  },
  {
    sector: "S2",
    window: "2026",
    title: "National Finalist — Top 77 of 1,600+",
    org: "IGNISIA '26 AI Hackathon",
    kind: "AWARD",
    load: 85,
    detail: [
      "Top 5% across India for the Impulse Route national-scale routing engine.",
    ],
  },
  {
    sector: "S2",
    window: "2026",
    title: "Top 6 Finalist of 350+ teams",
    org: "XENIA Hackathon 2026",
    kind: "AWARD",
    load: 82,
    detail: [
      "Recognised for engineering excellence in rapid prototyping, for FlowState.",
      "Built real-time cognitive-load detection from non-content telemetry — burnout risk without storing a single keystroke.",
    ],
  },
  {
    sector: "S3",
    window: "24 — 25 APR 2026",
    title: "Student Volunteer",
    org: "ICSFT 2026 · IEEE Pune Section",
    kind: "SERVICE",
    load: 54,
    detail: [
      "Supported the International Conference on Sustainable and Futuristic Technologies, technically sponsored by the IEEE Pune Section.",
      "Assisted technical sessions on 'AI Integration for Sustainable Development'.",
      "Coordinated with faculty convenors and technical partners including Vintech and EduLife Software.",
    ],
  },
  {
    sector: "S3",
    window: "APR 2025 — SEP 2025",
    title: "Event Management Head",
    org: "MicDrop Club",
    kind: "SERVICE",
    load: 66,
    detail: [
      "Managed logistics and operations for club events end to end, from setup through wrap-up.",
      "Led a cross-functional team covering technical needs, equipment and scheduling, improving live-shoot workflow.",
      "Primary escalation point during fast-paced events, holding production quality and timelines.",
    ],
  },
  {
    sector: "S3",
    window: "22 MAR 2025",
    title: "Student Coordinator",
    org: "UDAAN 2K25",
    kind: "SERVICE",
    load: 48,
    detail: [
      "Owned scoring and final results with 100% accuracy across hundreds of participants.",
      "Automated data entry in Advanced Excel, cutting roughly two hours from processing time.",
    ],
  },
  {
    sector: "S4",
    window: "2024 — 2028",
    title: "B.Tech, Information Technology",
    org: "MMCOE, Pune · CGPA 9.01 / 10",
    kind: "EDUCATION",
    load: 88,
    detail: [
      "Core coursework in data structures & algorithms, object-oriented programming and system design.",
      "Elective focus on computer vision, machine learning and embedded systems (STM32 / ESP32).",
    ],
  },
];

/** Commands the contact terminal accepts. Order here is the order `help` lists them. */
export const TERMINAL_COMMANDS = [
  { cmd: "whoami", desc: "operator identity" },
  { cmd: "contact", desc: "open comms channels" },
  { cmd: "missions", desc: "list deployed systems" },
  { cmd: "stack", desc: "primary loadout" },
  { cmd: "resume", desc: "download resume" },
  { cmd: "clear", desc: "wipe the buffer" },
];

export const NAV = [
  { id: "hero", index: "00", label: "STANDBY" },
  { id: "dossier", index: "01", label: "DOSSIER" },
  { id: "missions", index: "02", label: "MISSION LOG" },
  { id: "loadout", index: "03", label: "LOADOUT" },
  { id: "telemetry", index: "04", label: "TELEMETRY" },
  { id: "comms", index: "05", label: "COMMS" },
];
