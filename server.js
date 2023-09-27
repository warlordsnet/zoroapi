"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const https_1 = __importDefault(require("https"));
const path_1 = require("path");
const cors_1 = __importDefault(require("./config/cors"));
const ratelimit_1 = require("./config/ratelimit");
const errorHandler_1 = __importDefault(require("./config/errorHandler"));
const notFoundHandler_1 = __importDefault(require("./config/notFoundHandler"));
const routes_1 = __importDefault(require("./routes"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 4000;
app.use((0, morgan_1.default)("dev"));
app.use(cors_1.default);
app.use(ratelimit_1.ratelimit);
app.use(express_1.default.static((0, path_1.resolve)(__dirname, "..", "public")));
app.get("/health", (_, res) => res.sendStatus(200));
app.use("/anime", routes_1.default);
app.use(notFoundHandler_1.default);
app.use(errorHandler_1.default);
app.listen(PORT, () => {
    console.log(`⚔️  api @ http://localhost:${PORT}`);
});
setInterval(() => {
    console.log("HEALTHCHECK ;)", new Date().toLocaleString());
    https_1.default.get("https://zoroapi.onrender.com/health");
}, 540000);
