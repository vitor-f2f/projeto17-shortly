import Router from "express";
import { getRanking, getUser } from "../controllers/usersController.js";
import { validateToken } from "../middleware/validateToken.js";

const usersRouter = Router();

usersRouter
    .get("/ranking", getRanking)
    .get("/users/me", validateToken, getUser);

export { usersRouter };
