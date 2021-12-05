import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import csrf from "csurf";
import keys from "../config/keys";
import orderRoutes from "../routes/api/orders";
import { loggerMiddleware } from "./logger";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(loggerMiddleware);
// Security Middleware
app.use(
    cors({
        origin: "*", //keys.allowedOrigin,
        allowedHeaders: ["Content-Type"],
        optionsSuccessStatus: 204,
    })
);
// Helmet includes Content-Security-Policy header, removes X-Powered-By, Strict-Transport-Security, X-Download-Options, Cache-Control, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
app.use(helmet());
// CSRF protection
if (process.env.NODE_ENV === "production") {
    app.use(cookieParser());
    const csrfProtection = csrf({ cookie: true });
    app.use(csrfProtection);
    app.get("/csrf", csrfProtection, (req, res) => {
        res.json({ csrfToken: req.csrfToken() });
        return;
    });
}

const db = keys.mongoURI;

mongoose
    .connect(db)
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch((err) => console.log(err));

app.use("/api/orders", orderRoutes);

const port = 8080;

const server = app.listen(port, () => {
    console.info(`Sever listening on port:${port}`);
});

export default server;
