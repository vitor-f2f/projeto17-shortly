import { urlRepository } from "../repositories/urlRepository.js";
import { usersRepository } from "../repositories/usersRepository.js";

async function getUsersRanking() {
    const ranking = await usersRepository.getUsersRanking();
    return ranking.rows;
}

async function getUserData(userId) {
    const user = await usersRepository.getUser(userId);
    const shortenedUrls = await urlRepository.getUrlsByUserId(userId);
    return {
        id: user.rows[0].id,
        name: user.rows[0].name,
        visitCount: user.rows[0].visitCount,
        shortenedUrls: shortenedUrls.rows,
    };
}

export const usersService = {
    getUsersRanking,
    getUserData
}