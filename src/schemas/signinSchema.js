import Joi from "joi";

export const signInSchema = Joi.object({
    email: Joi.string().email().strict().required(),
    password: Joi.string().required(),
});