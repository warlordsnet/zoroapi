"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const parsers_1 = require("../parsers");
const anime_1 = require("../models/anime");
const getAnimeEpisodeSources = async (req, res, next) => {
    try {
        const episodeId = req.query.id ? decodeURIComponent(req.query.id) : null;
        const server = (req.query.server
            ? decodeURIComponent(req.query.server)
            : anime_1.Servers.VidStreaming);
        const category = (req.query.category ? decodeURIComponent(req.query.category) : "sub");
        if (episodeId === null) {
            throw http_errors_1.default.BadRequest("Anime episode id required");
        }
        const data = await (0, parsers_1.scrapeAnimeEpisodeSources)(episodeId, server, category);
        res.status(200).json(data);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};
exports.default = getAnimeEpisodeSources;
