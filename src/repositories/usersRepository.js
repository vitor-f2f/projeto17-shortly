import { db } from "../db.js";

async function checkEmail(email) {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email])
}

async function createUser(name, email, password) {
    return db.query(`
        INSERT INTO users (name, email, password) VALUES ($1, $2, $3)
    `, [name, email, password]);
}

async function getUser(userId) {
    return db.query(`
        SELECT u.id, u.name, SUM(url."visitCount") AS "visitCount"
        FROM users u
        LEFT JOIN urls url ON u.id = url.user_id
        WHERE u.id = $1
        GROUP BY u.id, u.name;
    `, [userId]);
}

async function getUsersRanking() {
    return db.query(`
        SELECT 
            u.id AS "id",
            u.name AS "name",
            COALESCE(COUNT(DISTINCT url.id), 0) AS "linksCount",
            COALESCE(SUM(url."visitCount"), 0) AS "visitCount"
        FROM users u
        LEFT JOIN urls url ON u.id = url.user_id
        GROUP BY u.id, u.name
        ORDER BY "visitCount" DESC
        LIMIT 10;
    `);
}

export const usersRepository = {
    checkEmail,
    createUser,
    getUser,
    getUsersRanking
}
