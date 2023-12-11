import httpStatus from "http-status";
import { authService } from "../services/authServices.js";

export const signIn = async (req, res) => {
    const userData = req.body;
    const token = await authService.signIn(userData);
    return res.status(httpStatus.OK).send(token);
};

export const signUp = async (req, res) => {
    const userData = req.body;
    await authService.signUp(userData);
    return res.sendStatus(httpStatus.CREATED);
};
