import httpStatus from "http-status";

export default function errorHandler(error, req, res, next) {
    let statusCode;
    switch (error.name) {
        case "conflict":
            statusCode = httpStatus.CONFLICT;
            break;
        case "notFound":
            statusCode = httpStatus.NOT_FOUND;
            break;
        case "unprocessable":
            statusCode = httpStatus.UNPROCESSABLE_ENTITY;
            break;
        case "unauthorized":
            statusCode = httpStatus.UNAUTHORIZED;
            break;
        case "badRequest":
            statusCode = httpStatus.BAD_REQUEST;
            break;
        case "forbidden":
            statusCode = httpStatus.FORBIDDEN;
            break;
        default:
            statusCode = httpStatus.INTERNAL_SERVER_ERROR
    }
    return res.status(statusCode).send(error.message || "Sorry, something went wrong");
}