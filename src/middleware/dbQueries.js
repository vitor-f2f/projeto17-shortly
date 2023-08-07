export const queries = {
    getRanking: `
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
    `,
    getUser: `
        SELECT u.id, u.name, SUM(url."visitCount") AS "visitCount"
        FROM users u
        LEFT JOIN urls url ON u.id = url.user_id
        WHERE u.id = $1
        GROUP BY u.id, u.name;
    `,
    getUrlsUser: `
        SELECT id, "shortUrl", url, "visitCount"
        FROM urls
        WHERE user_id = $1;
    `,
    findEmail: `
        SELECT * FROM users WHERE email = $1
    `,
};
