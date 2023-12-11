import { db } from "../db.js";

export const validateToken = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer "))
        return res.status(401).send("Erro de autenticação");

    const token = authorization.replace("Bearer ", "");
    try {
        const { rows } = await db.query("SELECT * FROM sessions WHERE token = $1", [token]);
        const session = rows[0]
        if (!session) return res.status(401).send("Erro de autenticação");

        res.locals.session = session;
        next();
    } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        return res.sendStatus(500);
    }
};
