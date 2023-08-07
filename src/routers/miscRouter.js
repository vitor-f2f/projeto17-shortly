import express from "express";

import { getRanking, getUser } from "../controllers/miscController.js";
import { validateToken } from "../middleware/validateToken.js";

const miscRouter = express.Router();

miscRouter.get("/ranking", getRanking);
miscRouter.get("/users/me", validateTokenMiddleware, getUser);

export default miscRouter;
