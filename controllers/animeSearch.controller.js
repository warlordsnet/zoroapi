"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const parsers_1 = require("../parsers");
const getAnimeSearch = async (req, res, next) => {
    try {
        const query = req.query.q
            ? decodeURIComponent(req.query.q)
            : null;
        const page = req.query.page
            ? Number(decodeURIComponent(req.query?.page))
            : 1;
        if (query === null) {
            throw http_errors_1.default.BadRequest("Search keyword required");
        }
        const data = await (0, parsers_1.scrapeAnimeSearch)(query, page);
        res.status(200).json(data);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};
exports.default = getAnimeSearch;
