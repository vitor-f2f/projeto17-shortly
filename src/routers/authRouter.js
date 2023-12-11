import Router from "express";
import { signIn, signUp } from "../controllers/authController.js";

const authRouter = Router();

authRouter
    .post("/signin", signIn)
    .post("/signup", signUp);

export { authRouter };
