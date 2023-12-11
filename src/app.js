import express from "express";
import "express-async-errors";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter, urlRouter, usersRouter } from "./routers/index.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

app
    .use(cors())
    .use(express.json())
    .use(authRouter)
    .use(urlRouter)
    .use(usersRouter)
    .use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor conectado na porta ${port}`);
});
