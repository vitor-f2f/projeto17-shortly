import { db } from "../db.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { queries } from "./dbQueries.js";

const signUpSchema = Joi.object({
    name: Joi.string().strict().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.ref("password"),
});

const signInSchema = Joi.object({
    email: Joi.string().email().strict().required(),
    password: Joi.string().required(),
});

export const signIn = async (req, res) => {
    let signInInfo = req.body;
    const { error } = signInSchema.validate(signInInfo, {
        abortEarly: false,
    });
    if (error) {
        return res.status(422).send("Erro de validação do usuário.");
    }
    try {
        const exists = await db.query(queries.findEmail, [signInInfo.email]);
        const user = exists.rows[0];
        if (
            !user ||
            !(await bcrypt.compare(signInInfo.password, user.password))
        ) {
            return res.status(401).send("Usuário não existe.");
        }

        const token = uuid();
        const exp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const query =
            "INSERT INTO sessions (user_id, token, expiration) VALUES ($1, $2, $3)";
        await db.query(query, [user.id, token, exp]);

        return res.status(200).send({ token });
    } catch (error) {
        console.error("Erro ao tentar realizar login:", error);
        return res.sendStatus(500);
    }
};

export const signUp = async (req, res) => {
    let signUpInfo = req.body;
    const { error } = signUpSchema.validate(signUpInfo, {
        abortEarly: false,
    });
    if (error) {
        return res.status(422).send("Erro de validação do usuário.");
    }
    try {
        const exists = await db.query(queries.findEmail, [signUpInfo.email]);
        if (exists.rows.length > 0) {
            return res.status(409).send("Email já cadastrado.");
        }

        const salts = 10;
        const password = await bcrypt.hash(signUpInfo.password, salts);

        const query =
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)";
        await db.query(query, [signUpInfo.name, signUpInfo.email, password]);

        return res.sendStatus(201);
    } catch (error) {
        console.error("Erro ao tentar cadastrar usuário:", error);
        return res.sendStatus(500);
    }
};
