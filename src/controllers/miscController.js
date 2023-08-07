import { db } from "../db.js";
import Joi from "joi";

export const getRanking = async (req, res) => {
    try {
    } catch (error) {
        console.error("Erro ao :", error);
        return res.sendStatus(500);
    }
};

export const getUser = async (req, res) => {
    try {
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).send("Erro de autenticação");
        }

        const token = authorization.replace("Bearer ", "");
        const session = await db.query(
            "SELECT * FROM sessions WHERE token = $1",
            [token]
        );
        if (!session.rows.length > 0) {
            return res.status(401).send("Erro de autenticação");
        }

        const userId = session.rows[0].user_id;
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
