import Router from "express";
import { signIn, signUp } from "../controllers/authController.js";
import { validateSchema } from "../middleware/validateSchema.js";
import { signInSchema } from "../schemas/signinSchema.js";
import { signUpSchema } from "../schemas/signupSchema.js";

const authRouter = Router();

authRouter
    .post("/signin", validateSchema(signInSchema), signIn)
    .post("/signup", validateSchema(signUpSchema), signUp);

export { authRouter };
