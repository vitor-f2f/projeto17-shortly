import { db } from "../db.js";

export const validateToken = async (req, res, next) => {
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

        res.locals.session = session.rows[0];

        next();
    } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        return res.sendStatus(500);
    }
};
