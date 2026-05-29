import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, portfoliosTable, portfolioItemsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = userId;
  return next();
};

// GET /api/portfolio/me
router.get("/me", requireAuth, async (req: any, res) => {
  try {
    const portfolio = await db.query.portfoliosTable.findFirst({
      where: eq(portfoliosTable.userId, req.userId),
      with: { items: { orderBy: (items: any, { asc }: any) => [asc(items.order), asc(items.createdAt)] } },
    });
    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }
    return res.json(portfolio);
  } catch (err) {
    req.log.error({ err }, "Failed to get portfolio");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/portfolio/me/create
router.post("/me/create", requireAuth, async (req: any, res) => {
  try {
    const { username, displayName, tagline, bio, email, location, avatarUrl, theme, skills, socialLinks, isPublic } = req.body;
    const [portfolio] = await db.insert(portfoliosTable).values({
      userId: req.userId,
      username,
      displayName,
      tagline,
      bio,
      email,
      location,
      avatarUrl,
      theme: theme ?? "retro",
      skills: skills ?? [],
      socialLinks: socialLinks ?? {},
      isPublic: isPublic ?? true,
    }).returning();
    return res.status(201).json(portfolio);
  } catch (err: any) {
    if (err?.code === "23505") {
      return res.status(409).json({ error: "Username already taken" });
    }
    req.log.error({ err }, "Failed to create portfolio");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/portfolio/me
router.put("/me", requireAuth, async (req: any, res) => {
  try {
    const { username, displayName, tagline, bio, email, location, avatarUrl, theme, skills, socialLinks, isPublic } = req.body;
    const [updated] = await db.update(portfoliosTable)
      .set({ username, displayName, tagline, bio, email, location, avatarUrl, theme, skills, socialLinks, isPublic })
      .where(eq(portfoliosTable.userId, req.userId))
      .returning();
    if (!updated) return res.status(404).json({ error: "Portfolio not found" });
    return res.json(updated);
  } catch (err: any) {
    if (err?.code === "23505") {
      return res.status(409).json({ error: "Username already taken" });
    }
    req.log.error({ err }, "Failed to update portfolio");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/portfolio/check/:username
router.get("/check/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const existing = await db.query.portfoliosTable.findFirst({
      where: eq(portfoliosTable.username, username),
    });
    return res.json({ available: !existing, username });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/portfolio/:username (public)
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const portfolio = await db.query.portfoliosTable.findFirst({
      where: and(eq(portfoliosTable.username, username), eq(portfoliosTable.isPublic, true)),
      with: { items: { orderBy: (items: any, { asc }: any) => [asc(items.order), asc(items.createdAt)] } },
    });
    if (!portfolio) return res.status(404).json({ error: "Portfolio not found" });
    return res.json(portfolio);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;