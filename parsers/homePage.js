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
async function scrapeHomePage() {
    const res = {
        spotlightAnimes: [],
        trendingAnimes: [],
        latestEpisodeAnimes: [],
        topUpcomingAnimes: [],
        top10Animes: {
            today: [],
            week: [],
            month: [],
        },
        topAiringAnimes: [],
        genres: [],
    };
    try {
        const mainPage = await axios_1.default.get(utils_1.SRC_HOME_URL, {
            headers: {
                "User-Agent": utils_1.USER_AGENT_HEADER,
                "Accept-Encoding": utils_1.ACCEPT_ENCODING_HEADER,
                Accept: utils_1.ACCEPT_HEADER,
            },
        });
        const $ = (0, cheerio_1.load)(mainPage.data);
        const spotlightSelector = "#slider .swiper-wrapper .swiper-slide";
        $(spotlightSelector).each((i, el) => {
            const otherInfo = $(el)
                .find(".deslide-item-content .sc-detail .scd-item")
                .map((i, el) => $(el).text().trim())
                .get();
            res.spotlightAnimes.push({
                rank: Number($(el)
                    .find(".deslide-item-content .desi-sub-text")
                    ?.text()
                    .trim()
                    .split(" ")[0]
                    .slice(1)) || null,
                id: $(el)
                    .find(".deslide-item-content .desi-buttons a")
                    ?.last()
                    ?.attr("href")
                    ?.slice(1)
                    ?.trim(),
                name: $(el)
                    .find(".deslide-item-content .desi-head-title.dynamic-name")
                    ?.text()
                    .trim(),
                description: $(el)
                    .find(".deslide-item-content .desi-description")
                    ?.text()
                    ?.split("[")
                    ?.shift()
                    ?.trim(),
                poster: $(el)
                    .find(".deslide-cover .deslide-cover-img .film-poster-img")
                    ?.attr("data-src")
                    ?.trim(),
                jname: $(el)
                    .find(".deslide-item-content .desi-head-title.dynamic-name")
                    ?.attr("data-jname")
                    ?.trim(),
                otherInfo,
            });
        });
        const trendingSelector = "#trending-home .swiper-wrapper .swiper-slide";
        $(trendingSelector).each((i, el) => {
            res.trendingAnimes.push({
                rank: parseInt($(el).find(".item .number")?.children()?.first()?.text()?.trim()),
                name: $(el)
                    .find(".item .number .film-title.dynamic-name")
                    ?.text()
                    ?.trim(),
                id: $(el).find(".item .film-poster")?.attr("href")?.slice(1)?.trim(),
                poster: $(el)
                    .find(".item .film-poster .film-poster-img")
                    ?.attr("data-src")
                    ?.trim(),
            });
        });
        const latestEpisodeSelector = "#main-content .block_area_home:nth-of-type(1) .tab-content .film_list-wrap .flw-item";
        res.latestEpisodeAnimes = (0, utils_1.extractAnimes)($, latestEpisodeSelector);
        const topUpcomingSelector = "#main-content .block_area_home:nth-of-type(3) .tab-content .film_list-wrap .flw-item";
        res.topUpcomingAnimes = (0, utils_1.extractAnimes)($, topUpcomingSelector);
        const genreSelector = "#main-sidebar .block_area.block_area_sidebar.block_area-genres .sb-genre-list li";
        $(genreSelector).each((i, el) => {
            res.genres.push(`${$(el).text().trim()}`);
        });
        const mostViewedSelector = '#main-sidebar .block_area-realtime [id^="top-viewed-"]';
        $(mostViewedSelector).each((i, el) => {
            const period = $(el).attr("id")?.split("-")?.pop()?.trim();
            if (period === "day") {
                res.top10Animes.today = (0, utils_1.extractTop10Animes)($, period);
                return;
            }
            if (period === "week") {
                res.top10Animes.week = (0, utils_1.extractTop10Animes)($, period);
                return;
            }
            if (period === "month") {
                res.top10Animes.month = (0, utils_1.extractTop10Animes)($, period);
            }
        });
        const topAiringSelector = "#anime-featured .row div:nth-of-type(1) .anif-block-ul ul li";
        $(topAiringSelector).each((i, el) => {
            const otherInfo = $(el)
                .find(".fd-infor .fdi-item")
                .map((i, el) => $(el).text().trim())
                .get();
            res.topAiringAnimes.push({
                id: $(el)
                    .find(".film-detail .film-name .dynamic-name")
                    ?.attr("href")
                    ?.slice(1)
                    ?.trim(),
                name: $(el)
                    .find(".film-detail .film-name .dynamic-name")
                    ?.attr("title")
                    ?.trim(),
                jname: $(el)
                    .find(".film-detail .film-name .dynamic-name")
                    ?.attr("data-jname")
                    ?.trim(),
                poster: $(el)
                    .find(".film-poster a .film-poster-img")
                    ?.attr("data-src")
                    ?.trim(),
                otherInfo,
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
exports.default = scrapeHomePage;
