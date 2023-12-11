import Router from "express";
import { getRanking, getUser } from "../controllers/miscController.js";
import { validateToken } from "../middleware/validateToken.js";

const miscRouter = Router();

miscRouter
    .get("/ranking", getRanking)
    .get("/users/me", validateToken, getUser);

export { miscRouter };
