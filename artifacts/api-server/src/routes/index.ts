import { Router, type IRouter } from "express";
import healthRouter from "./health";
import portfolioRouter from "./portfolio";
import itemsRouter from "./items";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/portfolio", portfolioRouter);
router.use("/items", itemsRouter);

export default router;
