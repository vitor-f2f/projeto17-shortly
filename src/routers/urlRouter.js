import express from "express";

import {
    openUrl,
    getById,
    deleteUrl,
    shortenUrl,
} from "../controllers/urlController.js";

const urlRouter = express.Router();

urlRouter.get("/open/:shortUrl", openUrl);
urlRouter.get("/:id", getById);
urlRouter.delete("/:id", deleteUrl);
urlRouter.post("/shorten", shortenUrl);

export default urlRouter;
