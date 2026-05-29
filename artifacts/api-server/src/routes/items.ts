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

const itemStore = new Map<string, any[]>();
let nextItemId = 200;

router.get("/", requireAuth, (req: any, res) => {
  return res.json(itemStore.get(req.userId) ?? []);
});

router.post("/", requireAuth, (req: any, res) => {
  const { type, title, subtitle, description, startDate, endDate, isCurrent, tags, url, order } = req.body;
  const item = {
    id: ++nextItemId, portfolioId: req.userId, type, title, subtitle,
    description, startDate, endDate, isCurrent: isCurrent ?? false,
    tags: tags ?? [], url, order: order ?? 0,
  };
  const items = itemStore.get(req.userId) ?? [];
  items.push(item);
  itemStore.set(req.userId, items);
  return res.status(201).json(item);
});

router.put("/:id", requireAuth, (req: any, res) => {
  const id = parseInt(req.params.id);
  const items = itemStore.get(req.userId) ?? [];
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return res.status(404).json({ error: "Item not found" });
  const { type, title, subtitle, description, startDate, endDate, isCurrent, tags, url, order } = req.body;
  items[idx] = { ...items[idx], type, title, subtitle, description, startDate, endDate, isCurrent, tags, url, order };
  itemStore.set(req.userId, items);
  return res.json(items[idx]);
});

router.delete("/:id", requireAuth, (req: any, res) => {
  const id = parseInt(req.params.id);
  const items = (itemStore.get(req.userId) ?? []).filter((i) => i.id !== id);
  itemStore.set(req.userId, items);
  return res.status(204).send();
});

export default router;
