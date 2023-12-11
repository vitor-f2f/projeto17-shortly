import { db } from "../db.js";

async function checkEmail(email) {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email])
}

async function createUser(name, email, password) {
    return db.query(`
        INSERT INTO users (name, email, password) VALUES ($1, $2, $3)
    `, [name, email, password]);
}

export const userRepository = {
    checkEmail,
    createUser
}
