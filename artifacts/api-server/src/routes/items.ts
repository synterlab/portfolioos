import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, portfoliosTable, portfolioItemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

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

const getPortfolioId = async (userId: string) => {
  const portfolio = await db.query.portfoliosTable.findFirst({
    where: eq(portfoliosTable.userId, userId),
  });
  return portfolio?.id;
};

// GET /api/items
router.get("/", requireAuth, async (req: any, res) => {
  try {
    const portfolioId = await getPortfolioId(req.userId);
    if (!portfolioId) return res.status(404).json({ error: "Portfolio not found" });
    const items = await db.select().from(portfolioItemsTable).where(eq(portfolioItemsTable.portfolioId, portfolioId));
    return res.json(items);
  } catch (err) {
    req.log.error({ err }, "Failed to get items");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/items
router.post("/", requireAuth, async (req: any, res) => {
  try {
    const portfolioId = await getPortfolioId(req.userId);
    if (!portfolioId) return res.status(404).json({ error: "Portfolio not found" });
    const { type, title, subtitle, description, startDate, endDate, isCurrent, tags, url, order } = req.body;
    const [item] = await db.insert(portfolioItemsTable).values({
      portfolioId,
      type,
      title,
      subtitle,
      description,
      startDate,
      endDate,
      isCurrent: isCurrent ?? false,
      tags: tags ?? [],
      url,
      order: order ?? 0,
    }).returning();
    return res.status(201).json(item);
  } catch (err) {
    req.log.error({ err }, "Failed to create item");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/items/:id
router.put("/:id", requireAuth, async (req: any, res) => {
  try {
    const portfolioId = await getPortfolioId(req.userId);
    if (!portfolioId) return res.status(404).json({ error: "Portfolio not found" });
    const { type, title, subtitle, description, startDate, endDate, isCurrent, tags, url, order } = req.body;
    const [updated] = await db.update(portfolioItemsTable)
      .set({ type, title, subtitle, description, startDate, endDate, isCurrent, tags, url, order })
      .where(eq(portfolioItemsTable.id, parseInt(req.params.id)))
      .returning();
    if (!updated) return res.status(404).json({ error: "Item not found" });
    return res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update item");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/items/:id
router.delete("/:id", requireAuth, async (req: any, res) => {
  try {
    await db.delete(portfolioItemsTable).where(eq(portfolioItemsTable.id, parseInt(req.params.id)));
    return res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete item");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;