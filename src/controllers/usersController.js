import httpStatus from "http-status";
import { usersService } from "../services/usersService.js";

export const getRanking = async (req, res) => {
    const ranking = await usersService.getUsersRanking();
    return res.status(httpStatus.OK).send(ranking);
};

export const getUser = async (req, res) => {
    const userId = res.locals.session.user_id;
    const userData = await usersService.getUserData(userId);
    return res.status(httpStatus.OK).send(userData);
};
