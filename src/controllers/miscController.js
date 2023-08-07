import { db } from "../db.js";
import Joi from "joi";

export const getRanking = async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.name, SUM(url."visitCount") AS "linksCount"
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
        const query = `
            SELECT json_build_object(
                "id", u.id,
                "name", u.name, 
                "visitCount", SUM(url."visitCount"),
                "shortenedUrls", json_agg(
                    json_build_object(
                        "id", url.id,
                        "shortUrl", url."shortUrl",
                        "url", url.url,
                        "visitCount", url."visitCount"
                    )
                )
            ) AS user_data
            FROM users u
            LEFT JOIN urls url ON u.id = url.user_id
            WHERE u.id = $1
            GROUP BY u.id, u.name
        `;
        const result = await db.query(query, [userId]);

        const { user_data } = result.rows[0];
        return res.status(200).json(user_data);
    } catch (error) {
        console.error("Erro ao buscar informações do usuário:", error);
        return res.sendStatus(500);
    }
};
