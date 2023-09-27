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
const axios_1 = __importStar(require("axios"));
const cheerio_1 = require("cheerio");
const utils_1 = require("../utils");
const http_errors_1 = __importDefault(require("http-errors"));
async function scrapeAnimeSearchSuggestion(q) {
    const res = {
        suggestions: [],
    };
    try {
        const { data } = await axios_1.default.get(`${utils_1.SRC_AJAX_URL}/search/suggest?keyword=${encodeURIComponent(q)}`, {
            headers: {
                Accept: "*/*",
                Pragma: "no-cache",
                Referer: utils_1.SRC_HOME_URL,
                "User-Agent": utils_1.USER_AGENT_HEADER,
                "X-Requested-With": "XMLHttpRequest",
                "Accept-Encoding": utils_1.ACCEPT_ENCODING_HEADER,
            },
        });
        const $ = (0, cheerio_1.load)(data.html);
        const selector = ".nav-item:has(.film-poster)";
        if ($(selector).length < 1)
            return res;
        $(selector).each((_, el) => {
            const id = $(el).attr("href")?.split("?")[0].includes("javascript")
                ? null
                : $(el).attr("href")?.split("?")[0]?.slice(1);
            res.suggestions.push({
                id,
                name: $(el).find(".srp-detail .film-name")?.text()?.trim() || null,
                jname: $(el).find(".srp-detail .film-name")?.attr("data-jname")?.trim() ||
                    $(el).find(".srp-detail .alias-name")?.text()?.trim() ||
                    null,
                poster: $(el)
                    .find(".film-poster .film-poster-img")
                    ?.attr("data-src")
                    ?.trim(),
                moreInfo: [
                    ...$(el)
                        .find(".film-infor")
                        .contents()
                        .map((_, el) => $(el).text().trim()),
                ].filter((i) => i),
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
exports.default = scrapeAnimeSearchSuggestion;
