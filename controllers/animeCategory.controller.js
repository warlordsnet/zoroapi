"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const parsers_1 = require("../parsers");
const getAnimeCategory = async (req, res, next) => {
    try {
        const category = req.params.category
            ? decodeURIComponent(req.params.category)
            : null;
        const page = req.query.page
            ? Number(decodeURIComponent(req.query?.page))
            : 1;
        if (category === null) {
            throw http_errors_1.default.BadRequest("category required");
        }
        const data = await (0, parsers_1.scrapeAnimeCategory)(category, page);
        res.status(200).json(data);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};
exports.default = getAnimeCategory;
