"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratelimit = void 0;
const express_rate_limit_1 = require("express-rate-limit");
exports.ratelimit = (0, express_rate_limit_1.rateLimit)({
    windowMs: 30 * 60 * 1000,
    max: 70,
    legacyHeaders: true,
    standardHeaders: "draft-7",
    message: "Too many API requests, try again later",
});
