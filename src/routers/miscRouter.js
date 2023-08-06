import express from "express";

import { getRanking, getUser } from "../controllers/miscController.js";

const miscRouter = express.Router();

miscRouter.get("/ranking", getRanking);
miscRouter.get("/users/me", getUser);

export default miscRouter;
