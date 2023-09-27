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
async function scrapeAnimeAboutInfo(id) {
    const res = {
        anime: {
            info: {
                id: null,
                name: null,
                jname: null,
                poster: null,
                description: null,
                stats: {
                    rating: null,
                    quality: null,
                    episodes: {
                        sub: null,
                        dub: null,
                    },
                    type: null,
                    duration: null,
                },
            },
            moreInfo: {},
        },
        seasons: [],
        mostPopularAnimes: [],
        relatedAnimes: [],
        recommendedAnimes: [],
    };
    try {
        const animeUrl = new URL(id, utils_1.SRC_BASE_URL);
        const mainPage = await axios_1.default.get(animeUrl.href, {
            headers: {
                "User-Agent": utils_1.USER_AGENT_HEADER,
                "Accept-Encoding": utils_1.ACCEPT_ENCODING_HEADER,
                Accept: utils_1.ACCEPT_HEADER,
            },
        });
        const $ = (0, cheerio_1.load)(mainPage.data);
        const selector = "#ani_detail .container .anis-content";
        res.anime.info.id =
            $(selector)
                ?.find(".anisc-detail .film-buttons a.btn-play")
                ?.attr("href")
                ?.split("/")
                ?.pop() || null;
        res.anime.info.name =
            $(selector)
                ?.find(".anisc-detail .film-name.dynamic-name")
                ?.text()
                ?.trim() || null;
        res.anime.info.jname =
            $(selector)
                ?.find(".anisc-detail .film-name.dynamic-name")
                ?.attr("data-jname")
                ?.trim() || null;
        res.anime.info.description =
            $(selector)
                ?.find(".anisc-detail .film-description .text")
                .text()
                ?.split("[")
                ?.shift()
                ?.trim() || null;
        res.anime.info.poster =
            $(selector)?.find(".film-poster .film-poster-img")?.attr("src")?.trim() ||
                null;
        res.anime.info.stats.rating =
            $(`${selector} .film-stats .tick .tick-pg`)?.text()?.trim() || null;
        res.anime.info.stats.quality =
            $(`${selector} .film-stats .tick .tick-quality`)?.text()?.trim() || null;
        res.anime.info.stats.episodes = {
            sub: Number($(`${selector} .film-stats .tick .tick-sub`)?.text()?.trim()) ||
                null,
            dub: Number($(`${selector} .film-stats .tick .tick-dub`)?.text()?.trim()) ||
                null,
        };
        res.anime.info.stats.type =
            $(`${selector} .film-stats .tick`)
                ?.text()
                ?.trim()
                ?.replace(/[\s\n]+/g, " ")
                ?.split(" ")
                ?.at(-2) || null;
        res.anime.info.stats.duration =
            $(`${selector} .film-stats .tick`)
                ?.text()
                ?.trim()
                ?.replace(/[\s\n]+/g, " ")
                ?.split(" ")
                ?.pop() || null;
        $(`${selector} .anisc-info-wrap .anisc-info .item:not(.w-hide)`).each((i, el) => {
            let key = $(el)
                .find(".item-head")
                .text()
                .toLowerCase()
                .replace(":", "")
                .trim();
            key = key.includes(" ") ? key.replace(" ", "") : key;
            const value = [
                ...$(el)
                    .find("*:not(.item-head)")
                    .map((i, el) => $(el).text().trim()),
            ]
                .map((i) => `${i}`)
                .toString()
                .trim();
            if (key === "genres") {
                res.anime.moreInfo[key] = value.split(",").map((i) => i.trim());
                return;
            }
            if (key === "producers") {
                res.anime.moreInfo[key] = value.split(",").map((i) => i.trim());
                return;
            }
            res.anime.moreInfo[key] = value;
        });
        const seasonsSelector = "#main-content .os-list a.os-item";
        $(seasonsSelector).each((i, el) => {
            res.seasons.push({
                id: $(el)?.attr("href")?.slice(1)?.trim() || null,
                name: $(el)?.attr("title")?.trim() || null,
                jname: $(el)?.attr("data-jname")?.trim() || null,
                title: $(el)?.find(".title")?.text()?.trim(),
                poster: $(el)
                    ?.find(".season-poster")
                    ?.attr("style")
                    ?.split(" ")
                    ?.pop()
                    ?.split("(")
                    ?.pop()
                    ?.split(")")[0] || null,
                isCurrent: $(el).hasClass("active"),
            });
        });
        const relatedAnimeSelector = "#main-sidebar .block_area.block_area_sidebar.block_area-realtime:nth-of-type(1) .anif-block-ul ul li";
        res.relatedAnimes = (0, utils_1.extractMostPopularAnimes)($, relatedAnimeSelector);
        const mostPopularSelector = "#main-sidebar .block_area.block_area_sidebar.block_area-realtime:nth-of-type(2) .anif-block-ul ul li";
        res.mostPopularAnimes = (0, utils_1.extractMostPopularAnimes)($, mostPopularSelector);
        const recommendedAnimeSelector = "#main-content .block_area.block_area_category .tab-content .flw-item";
        res.recommendedAnimes = (0, utils_1.extractAnimes)($, recommendedAnimeSelector);
        return res;
    }
    catch (err) {
        if (err instanceof axios_1.AxiosError) {
            throw (0, http_errors_1.default)(err?.response?.status || 500, err?.response?.statusText || "Something went wrong");
        }
        throw http_errors_1.default.InternalServerError(err?.message);
    }
}
exports.default = scrapeAnimeAboutInfo;
