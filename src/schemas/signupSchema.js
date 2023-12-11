import Joi from "joi";

export const signUpSchema = Joi.object({
    name: Joi.string().strict().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password'))
});