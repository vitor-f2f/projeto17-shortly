import { Router } from "express";
import authRouter from "./authRouter.js";
import urlRouter from "./urlRouter.js";
import miscRouter from "./miscRouter.js";

const router = Router();

router.use(authRouter);
router.use(urlRouter);
router.use(miscRouter);

export default router;
