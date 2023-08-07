import express from "express";

import {
    openUrl,
    getById,
    deleteUrl,
    shortenUrl,
} from "../controllers/urlController.js";
import { validateToken } from "../middleware/validateToken.js";

const urlRouter = express.Router();

urlRouter.get("/open/:shortUrl", openUrl);
urlRouter.get("/:id", getById);
urlRouter.delete("/:id", validateTokenMiddleware, deleteUrl);
urlRouter.post("/shorten", validateTokenMiddleware, shortenUrl);

export default urlRouter;
