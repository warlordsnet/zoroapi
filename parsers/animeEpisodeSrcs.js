"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const axios_1 = __importStar(require("axios"));
const cheerio_1 = require("cheerio");
const anime_1 = require("../models/anime");
const http_errors_1 = __importDefault(require("http-errors"));
const extractors_1 = require("../extractors");
async function scrapeAnimeEpisodeSources(episodeId, server = anime_1.Servers.VidStreaming, category = "sub") {
    if (episodeId.startsWith("http")) {
        const serverUrl = new URL(episodeId);
        switch (server) {
            case anime_1.Servers.VidStreaming:
            case anime_1.Servers.VidCloud:
                return {
                    ...(await new extractors_1.RapidCloud().extract(serverUrl)),
                };
            case anime_1.Servers.StreamSB:
                return {
                    headers: {
                        Referer: serverUrl.href,
                        watchsb: "streamsb",
                        "User-Agent": utils_1.USER_AGENT_HEADER,
                    },
                    sources: await new extractors_1.StreamSB().extract(serverUrl, true),
                };
            case anime_1.Servers.StreamTape:
                return {
                    headers: { Referer: serverUrl.href, "User-Agent": utils_1.USER_AGENT_HEADER },
                    sources: await new extractors_1.StreamTape().extract(serverUrl),
                };
            default:
                return {
                    headers: { Referer: serverUrl.href },
                    ...(await new extractors_1.RapidCloud().extract(serverUrl)),
                };
        }
    }
    const epId = new URL(`/watch/${episodeId}`, utils_1.SRC_BASE_URL).href;
    console.log(epId);
    try {
        const resp = await axios_1.default.get(`${utils_1.SRC_AJAX_URL}/v2/episode/servers?episodeId=${epId.split("?ep=")[1]}`, {
            headers: {
                Referer: epId,
                "User-Agent": utils_1.USER_AGENT_HEADER,
                "X-Requested-With": "XMLHttpRequest",
            },
        });
        const $ = (0, cheerio_1.load)(resp.data.html);
        let serverId = null;
        try {
            console.log("THE SERVER: ", server);
            switch (server) {
                case anime_1.Servers.VidCloud: {
                    serverId = (0, utils_1.retrieveServerId)($, 1, category);
                    if (!serverId)
                        throw new Error("RapidCloud not found");
                    break;
                }
                case anime_1.Servers.VidStreaming: {
                    serverId = (0, utils_1.retrieveServerId)($, 4, category);
                    console.log("SERVER_ID: ", serverId);
                    if (!serverId)
                        throw new Error("VidStreaming not found");
                    break;
                }
                case anime_1.Servers.StreamSB: {
                    serverId = (0, utils_1.retrieveServerId)($, 5, category);
                    if (!serverId)
                        throw new Error("StreamSB not found");
                    break;
                }
                case anime_1.Servers.StreamTape: {
                    serverId = (0, utils_1.retrieveServerId)($, 3, category);
                    if (!serverId)
                        throw new Error("StreamTape not found");
                    break;
                }
            }
        }
        catch (err) {
            throw http_errors_1.default.NotFound("Couldn't find server. Try another server");
        }
        const { data: { link }, } = await axios_1.default.get(`${utils_1.SRC_AJAX_URL}/v2/episode/sources?id=${serverId}`);
        console.log("THE LINK: ", link);
        return await scrapeAnimeEpisodeSources(link, server);
    }
    catch (err) {
        console.log(err);
        if (err instanceof axios_1.AxiosError) {
            throw (0, http_errors_1.default)(err?.response?.status || 500, err?.response?.statusText || "Something went wrong");
        }
        throw http_errors_1.default.InternalServerError(err?.message);
    }
}
exports.default = scrapeAnimeEpisodeSources;
