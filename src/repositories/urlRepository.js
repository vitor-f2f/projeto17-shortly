import { db } from "../db.js";

async function addUrl(url, shortUrl, userId) {
    return db.query(`
        INSERT INTO urls (url, "shortUrl", user_id) values ($1, $2, $3) RETURNING id
    `, [url, shortUrl, userId]);
}

async function getFullUrl(shortUrl) {
    return db.query(`
        SELECT * from urls WHERE "shortUrl" = $1`,
        [shortUrl]
    );
}

async function increaseVisits(shortUrl) {
    return db.query(`
        UPDATE urls SET "visitCount" = "visitCount" + 1 WHERE "shortUrl" = $1
    `, [shortUrl]);
}

async function fetchUrlById(id) {
    return db.query(`
        SELECT * FROM urls WHERE id = $1`,
        [id]
    );
}

async function deleteUrl(id) {
    await db.query("DELETE FROM urls WHERE id = $1", [id]);
}

export const urlRepository = {
    addUrl,
    getFullUrl,
    increaseVisits,
    fetchUrlById,
    deleteUrl
}
