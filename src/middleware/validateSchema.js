import { unprocessable } from "./errorNames.js";

export function validateSchema(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            throw unprocessable(error.message);
        }
        next();
    };
}