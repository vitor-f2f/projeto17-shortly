import Router from "express";
import { openUrl, getUrlById, deleteUrl, shortenUrl } from "../controllers/urlController.js";
import { validateToken } from "../middleware/validateToken.js";
import { validateSchema } from "../middleware/validateSchema.js";
import { urlSchema } from "../schemas/urlSchema.js";

const urlRouter = Router();

urlRouter
    .get("/urls/open/:shortUrl", openUrl)
    .get("/urls/:id", getUrlById)
    .delete("/urls/:id", validateToken, deleteUrl)
    .post("/urls/shorten", validateToken, validateSchema(urlSchema), shortenUrl);

export { urlRouter };