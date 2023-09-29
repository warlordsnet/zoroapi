import morgan from "morgan";
import express from "express";
import { config } from "dotenv";

import https from "https";
import http from "http";
import { resolve } from "path";
import corsConfig from "./config/cors";
import { ratelimit } from "./config/ratelimit";
import errorHandler from "./config/errorHandler";
import notFoundHandler from "./config/notFoundHandler";

import animeRouter from "./routes";

config();
const app: express.Application = express();

app.use(morgan("dev"));
app.use(corsConfig);
app.use(ratelimit);

app.use(express.static(resolve(__dirname, "..", "public")));
app.get("/health", (_, res) => res.sendStatus(200));
app.use("/anime", animeRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
