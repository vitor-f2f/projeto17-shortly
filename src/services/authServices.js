import { conflict, notFound, unauthorized } from "../middleware/errorNames.js";
import { usersRepository } from "../repositories/usersRepository.js"
import { sessionRepository } from "../repositories/sessionRepository.js"
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

async function signIn(userData) {
    const registeredUser = await usersRepository.checkEmail(userData.email);
    if (registeredUser.rowCount === 0)
        throw notFound("User not found.");

    const user = registeredUser.rows[0];
    if (!bcrypt.compareSync(userData.password, user.password))
        throw unauthorized("Wrong password.");

    const token = uuid();
    const expiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await sessionRepository.createSession(user.id, token, expiration);
    return token;
}

async function signUp(userData) {
    const registeredUser = await usersRepository.checkEmail(userData.email);
    if (registeredUser.rowCount !== 0)
        throw conflict("Email already in use.");

    const salts = 10;
    const hashedPassword = await bcrypt.hash(userData.password, salts);
    return await usersRepository.createUser(userData.name, userData.email, hashedPassword);
};

export const authService = {
    signIn,
    signUp
}