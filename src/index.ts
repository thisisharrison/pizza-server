import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import keys from "../config/keys";
import orderRoutes from "../routes/api/orders";
import { loggerMiddleware } from "./logger";

const app = express();

app.use(
    cors({
        origin: "*", //keys.allowedOrigin,
        allowedHeaders: ["Content-Type"],
        optionsSuccessStatus: 204,
    })
);

const port = 8080;

const db = keys.mongoURI;

mongoose
    .connect(db)
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch((err) => console.log(err));

app.use(loggerMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/orders", orderRoutes);

app.listen(port, () => {
    console.info(`Sever listening on port:${port}`);
});
