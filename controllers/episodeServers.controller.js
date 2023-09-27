"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const parsers_1 = require("../parsers");
const getEpisodeServers = async (req, res, next) => {
    try {
        const episodeId = req.query.episodeId
            ? decodeURIComponent(req.query?.episodeId)
            : null;
        if (episodeId === null) {
            throw http_errors_1.default.BadRequest("Episode id required");
        }
        const data = await (0, parsers_1.scrapeEpisodeServers)(episodeId);
        res.status(200).json(data);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};
exports.default = getEpisodeServers;