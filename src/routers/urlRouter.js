import express from "express";

import {
    openUrl,
    getById,
    deleteUrl,
    shortenUrl,
} from "../controllers/urlController.js";
import { validateToken } from "../middleware/validateToken.js";

const urlRouter = express.Router();

urlRouter.get("/urls/open/:shortUrl", openUrl);
urlRouter.get("/urls/:id", getById);
urlRouter.delete("/urls/:id", validateToken, deleteUrl);
urlRouter.post("/urls/shorten", validateToken, shortenUrl);

export default urlRouter;
