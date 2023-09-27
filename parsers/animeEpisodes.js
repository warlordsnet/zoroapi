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
const http_errors_1 = __importDefault(require("http-errors"));
const cheerio_1 = require("cheerio");
async function scrapeAnimeEpisodes(animeId) {
    const res = {
        totalEpisodes: 0,
        episodes: [],
    };
    try {
        const episodesAjax = await axios_1.default.get(`${utils_1.SRC_AJAX_URL}/v2/episode/list/${animeId.split("-").pop()}`, {
            headers: {
                Accept: utils_1.ACCEPT_HEADER,
                "User-Agent": utils_1.USER_AGENT_HEADER,
                "X-Requested-With": "XMLHttpRequest",
                "Accept-Encoding": utils_1.ACCEPT_ENCODING_HEADER,
                Referer: `${utils_1.SRC_BASE_URL}/watch/${animeId}`,
            },
        });
        const $ = (0, cheerio_1.load)(episodesAjax.data.html);
        res.totalEpisodes = Number($(".detail-infor-content .ss-list a").length);
        $(".detail-infor-content .ss-list a").each((i, el) => {
            res.episodes.push({
                title: $(el)?.attr("title")?.trim() || null,
                episodeId: $(el)?.attr("href")?.split("/")?.pop() || null,
                number: Number($(el).attr("data-number")),
                isFiller: $(el).hasClass("ssl-item-filler"),
            });
        });
        return res;
    }
    catch (err) {
        if (err instanceof axios_1.AxiosError) {
            throw (0, http_errors_1.default)(err?.response?.status || 500, err?.response?.statusText || "Something went wrong");
        }
        throw http_errors_1.default.InternalServerError(err?.message);
    }
}
exports.default = scrapeAnimeEpisodes;
