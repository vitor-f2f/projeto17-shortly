import { notFound, unauthorized, unprocessable } from "../middleware/errorNames.js";
import { nanoid } from "nanoid";
import { urlRepository } from "../repositories/urlRepository.js";

async function shortenUrl(userId, url) {
    const shortUrl = nanoid(8);
    const result = await urlRepository.addUrl(url, shortUrl, userId);
    const { id } = result.rows[0];
    return { id, shortUrl };
};

async function expandUrl(shortUrl) {
    if (shortUrl.length !== 8 || typeof shortUrl !== "string")
        throw unprocessable("Wrong format for shortened URL");

    const fullUrl = await urlRepository.getFullUrl(shortUrl);
    if (fullUrl.rowCount === 0)
        throw notFound("URL was not found");

    await urlRepository.increaseVisits(shortUrl);
    return fullUrl.rows[0].url;
}

async function checkId(id) {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) throw unprocessable("Invalid ID");

    const { rows } = await urlRepository.fetchUrlById(parsedId);
    if (!rows[0]) throw notFound("ID not found in database");

    return rows[0];
}
async function getUrlById(id) {
    const urlData = await checkId(id);
    return {
        id: urlData.id,
        shortUrl: urlData.shortUrl,
        url: urlData.url
    };
}

async function deleteUrlById(urlId, userId) {
    const urlData = await checkId(urlId);
    if (urlData.user_id !== userId) throw unauthorized("User cannot delete this URL");

    await urlRepository.deleteUrl(urlData.id);
}

export const urlService = {
    shortenUrl,
    expandUrl,
    getUrlById,
    deleteUrlById
}