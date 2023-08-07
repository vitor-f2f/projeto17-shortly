import { db } from "../db.js";
import { queries } from "./dbQueries.js";

export const getRanking = async (req, res) => {
    try {
        const result = await db.query(queries.getRanking);
        const ranking = result.rows;
        return res.status(200).json(ranking);
    } catch (error) {
        console.error("Erro ao gerar ranking:", error);
        return res.sendStatus(500);
    }
};

export const getUser = async (req, res) => {
    try {
        const userId = res.locals.session.user_id;

        const userResult = await db.query(queries.getUser, [userId]);
        const urlsResult = await db.query(queries.getUrlsUser, [userId]);

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
