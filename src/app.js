import express from "express";
import cors from "cors";
import router from "./routers/index.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor conectado na porta ${port}`);
});
