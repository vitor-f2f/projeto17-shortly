import { db } from "../db.js";
import { nanoid } from "nanoid";
import Joi from "joi";

const urlSchema = Joi.object({
    url: Joi.string().uri().required(),
});

export const shortenUrl = async (req, res) => {
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

        const { error, value } = urlSchema.validate(req.body);
        if (error) {
            return res.status(422).send("Link inválido");
        }
        const user_id = session.rows[0].user_id;
        const { url } = value;
        const shortened = nanoid(8);
        const query =
            "INSERT INTO urls (original_url, short_url, user_id) values ($1, $2, $3) RETURNING id";
        const insert = await db.query(query, [url, shortened, user_id]);
        const { id } = insert.rows[0];

        return res.status(201).json({ id, shortUrl: shortened });
    } catch (error) {
        console.error("Erro ao :", error);
        return res.sendStatus(500);
    }
};

export const openUrl = async (req, res) => {
    const { shortUrl } = req.params;
    const reg = /^[A-Za-z0-9]+$/;

    if (shortUrl.length !== 8 || !reg.test(shortUrl)) {
        return res.status(404).send("URL inválida.");
    }
    try {
        const query = await db.query(
            "SELECT * from urls WHERE short_url = $1",
            [shortUrl]
        );
        if (!query.rows.length > 0) {
            return res.status(404).send("URL inválida.");
        }
        const { original_url } = query.rows[0];

        await db.query(
            "UPDATE urls SET visit_count = visit_count + 1 WHERE short_url = $1",
            [shortUrl]
        );

        return res.redirect(original_url);
    } catch (error) {
        console.error("Erro ao buscar URL:", error);
        return res.sendStatus(500);
    }
};

export const getById = async (req, res) => {
    const { id } = req.params;
    const parsed = parseInt(id);
    if (isNaN(parsed)) {
        return res.status(404).send("ID inválido");
    }
    try {
        const query = await db.query("SELECT * FROM urls WHERE id = $1", [
            parsed,
        ]);

        if (!query.rows.length > 0) {
            return res.status(404).send("ID inválido");
        }

        const { id, short_url, original_url } = query.rows[0];

        return res.status(200).json({ id, short_url, original_url });
    } catch (error) {
        console.error("Erro ao buscar por ID:", error);
        return res.sendStatus(500);
    }
};

export const deleteUrl = async (req, res) => {
    const { id } = req.params;
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

        const parsed = parseInt(id);
        if (isNaN(parsed)) {
            return res.status(404).send("ID inválido");
        }
        const query = await db.query("SELECT * FROM urls WHERE id = $1", [
            parsed,
        ]);
        if (!query.rows.length > 0) {
            return res.status(404).send("ID inválido");
        }

        const url_user = query.rows[0].user_id;
        const session_user = session.rows[0].user_id;
        if (url_user !== session_user) {
            return res.status(401).send("Usuário não autorizado.");
        }

        await db.query("DELETE FROM urls WHERE id = $1", [parsed]);
        return res.sendStatus(204);
    } catch (error) {
        console.error("Erro ao :", error);
        return res.sendStatus(500);
    }
};
