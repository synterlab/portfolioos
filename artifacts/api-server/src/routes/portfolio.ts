import { Router } from "express";
import { getAuth } from "@clerk/express";

const router = Router();

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.userId = userId;
  return next();
};

const portfolioStore = new Map<string, any>();
let nextId = 100;

const DEMO_PORTFOLIO = {
  id: 1,
  userId: "demo",
  username: "demo",
  displayName: "Alex Chen",
  tagline: "Full-Stack Developer & Open Source Contributor",
  bio: "Building things on the internet. Passionate about developer experience, performance, and elegant code.",
  email: "alex@example.com",
  location: "San Francisco, CA",
  avatarUrl: null,
  theme: "retro",
  skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "AWS"],
  socialLinks: { github: "https://github.com", twitter: "https://twitter.com" },
  isPublic: true,
  items: [
    {
      id: 1, portfolioId: 1, type: "experience",
      title: "Senior Software Engineer", subtitle: "Acme Corp",
      description: "Led a team of 5 engineers building high-performance APIs serving 10M+ requests/day.",
      startDate: "2022-01", endDate: null, isCurrent: true,
      tags: ["TypeScript", "Node.js", "Kubernetes"], url: null, order: 0,
    },
    {
      id: 2, portfolioId: 1, type: "project",
      title: "OpenMetrics", subtitle: "Open Source",
      description: "A lightweight observability library for Node.js. 2.3k GitHub stars.",
      startDate: "2021-06", endDate: null, isCurrent: true,
      tags: ["Node.js", "Prometheus", "TypeScript"], url: "https://github.com", order: 1,
    },
    {
      id: 3, portfolioId: 1, type: "education",
      title: "B.S. Computer Science", subtitle: "UC Berkeley",
      description: "Graduated with honors. Focused on distributed systems and algorithms.",
      startDate: "2016-08", endDate: "2020-05", isCurrent: false,
      tags: [], url: null, order: 2,
    },
  ],
};

router.get("/me", requireAuth, (req: any, res) => {
  const p = portfolioStore.get(req.userId);
  if (!p) return res.status(404).json({ error: "Portfolio not found" });
  return res.json(p);
});

router.post("/me/create", requireAuth, (req: any, res) => {
  const { username, displayName, tagline, bio, email, location, avatarUrl, theme, skills, socialLinks, isPublic } = req.body;
  const portfolio = {
    id: ++nextId, userId: req.userId, username, displayName, tagline, bio,
    email, location, avatarUrl, theme: theme ?? "retro",
    skills: skills ?? [], socialLinks: socialLinks ?? {},
    isPublic: isPublic ?? true, items: [],
  };
  portfolioStore.set(req.userId, portfolio);
  return res.status(201).json(portfolio);
});

router.put("/me", requireAuth, (req: any, res) => {
  const existing = portfolioStore.get(req.userId);
  if (!existing) return res.status(404).json({ error: "Portfolio not found" });
  const { username, displayName, tagline, bio, email, location, avatarUrl, theme, skills, socialLinks, isPublic } = req.body;
  const updated = { ...existing, username, displayName, tagline, bio, email, location, avatarUrl, theme, skills, socialLinks, isPublic };
  portfolioStore.set(req.userId, updated);
  return res.json(updated);
});

router.get("/check/:username", (req, res) => {
  const { username } = req.params;
  return res.json({ available: true, username });
});

router.get("/:username", (req, res) => {
  const { username } = req.params;
  if (username === "demo") return res.json(DEMO_PORTFOLIO);
  for (const p of portfolioStore.values()) {
    if (p.username === username && p.isPublic) return res.json(p);
  }
  return res.status(404).json({ error: "Portfolio not found" });
});

export default router;
