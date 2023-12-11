export function notFound(message = "This could not be found.") {
    const error = new Error(message);
    error.name = "notFound";
    return error;
}
export function conflict(message = "This already exists.") {
    const error = new Error(message);
    error.name = "conflict";
    return error;
}
export function unprocessable(message = "This is not a valid entity") {
    const error = new Error(message);
    error.name = "unprocessable";
    return error;
}
export function badRequest(message = "Invalid request.") {
    const error = new Error(message);
    error.name = "badRequest";
    return error;
}

export function unauthorized(message = "You do not have permission.") {
    const error = new Error(message);
    error.name = "unauthorized";
    return error;
}

export function forbidden(message = "This request cannot be made.") {
    const error = new Error(message);
    error.name = "forbidden";
    return error;
}