import express from "express";
import cors from "cors";
import { authRouter, urlRouter, miscRouter } from "./routers/index.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app
    .use(cors())
    .use(express.json())
    .use(authRouter)
    .use(urlRouter)
    .use(miscRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor conectado na porta ${port}`);
});
