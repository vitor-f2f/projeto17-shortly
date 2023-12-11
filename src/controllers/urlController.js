import httpStatus from "http-status";
import { urlService } from "../services/urlServices.js";

export const shortenUrl = async (req, res) => {
    const { url } = req.body;
    const userId = res.locals.session.user_id;
    const result = await urlService.shortenUrl(userId, url);
    return res.status(httpStatus.OK).send(result);
};

export const openUrl = async (req, res) => {
    const { shortUrl } = req.params;
    const fullUrl = await urlService.expandUrl(shortUrl);
    return res.redirect(fullUrl);
};

export const getUrlById = async (req, res) => {
    const { id } = req.params;
    const urlData = await urlService.getUrlById(id);
    return res.status(httpStatus.OK).send(urlData);
};

export const deleteUrl = async (req, res) => {
    const urlId = req.params.id;
    const userId = res.locals.session.user_id;
    await urlService.deleteUrlById(urlId, userId);
    return res.sendStatus(httpStatus.NO_CONTENT);
};
