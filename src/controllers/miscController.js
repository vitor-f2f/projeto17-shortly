import { db } from "../db.js";
import Joi from "joi";

export const getRanking = async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.name, COALESCE(SUM(url."visitCount"), 0) AS "visitCount"
            FROM users u
            LEFT JOIN urls url ON u.id = url.user_id
            GROUP BY u.id, u.name
            ORDER BY "linksCount" DESC
            LIMIT 10;
        `;
        const result = await db.query(query);
        const ranking = result.rows.map((user) => ({
            id: user.id,
            name: user.name,
            linksCount: parseInt(user.linksCount),
        }));
        return res.status(200).json(ranking);
    } catch (error) {
        console.error("Erro ao gerar ranking:", error);
        return res.sendStatus(500);
    }
};

export const getUser = async (req, res) => {
    try {
        const userId = res.locals.session.user_id;
        const userQuery = `
            SELECT u.id, u.name, SUM(url."visitCount") AS "visitCount"
            FROM users u
            LEFT JOIN urls url ON u.id = url.user_id
            WHERE u.id = $1
            GROUP BY u.id, u.name
        `;
        const userResult = await db.query(userQuery, [userId]);

        const urlsQuery = `
            SELECT id, "shortUrl", url, "visitCount"
            FROM urls
            WHERE user_id = $1
        `;
        const urlsResult = await db.query(urlsQuery, [userId]);

        const user = userResult.rows[0];

        const obj = {
            id: user.id,
            name: user.name,
            visitCount: parseInt(user.visitCount),
            shortenedUrls: urlsResult.rows,
        };
        return res.status(200).json(obj);
    } catch (error) {
        console.error("Erro ao buscar informações do usuário:", error);
        return res.sendStatus(500);
    }
};
