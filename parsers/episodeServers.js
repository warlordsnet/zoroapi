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
async function scrapeEpisodeServers(episodeId) {
    const res = {
        sub: [],
        dub: [],
        episodeId,
        episodeNo: 0,
    };
    try {
        const epId = episodeId.split("?ep=")[1];
        const { data } = await axios_1.default.get(`${utils_1.SRC_AJAX_URL}/v2/episode/servers?episodeId=${epId}`, {
            headers: {
                Accept: utils_1.ACCEPT_HEADER,
                "User-Agent": utils_1.USER_AGENT_HEADER,
                "X-Requested-With": "XMLHttpRequest",
                "Accept-Encoding": utils_1.ACCEPT_ENCODING_HEADER,
                Referer: new URL(`/watch/${episodeId}`, utils_1.SRC_BASE_URL).href,
            },
        });
        const $ = (0, cheerio_1.load)(data.html);
        const epNoSelector = ".server-notice strong";
        res.episodeNo = Number($(epNoSelector).text().split(" ").pop()) || 0;
        $(`.ps_-block.ps_-block-sub.servers-sub .ps__-list .server-item`).each((_, el) => {
            res.sub.push({
                serverName: $(el).find("a").text().toLowerCase().trim(),
                serverId: Number($(el)?.attr("data-server-id")?.trim()) || null,
            });
        });
        $(`.ps_-block.ps_-block-sub.servers-dub .ps__-list .server-item`).each((_, el) => {
            res.dub.push({
                serverName: $(el).find("a").text().toLowerCase().trim(),
                serverId: Number($(el)?.attr("data-server-id")?.trim()) || null,
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
exports.default = scrapeEpisodeServers;
