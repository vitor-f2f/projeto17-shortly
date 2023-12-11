import { db } from "../db.js";

async function createSession(userId, token, expiration) {
    return db.query(`
    INSERT INTO sessions (user_id, token, expiration) VALUES ($1, $2, $3)
    `, [userId, token, expiration]);
}

export const sessionRepository = {
    createSession
}
