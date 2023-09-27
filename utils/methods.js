"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.substringBefore = exports.substringAfter = exports.retrieveServerId = exports.extractMostPopularAnimes = exports.extractTop10Animes = exports.extractAnimes = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const extractAnimes = ($, selector) => {
    try {
        const animes = [];
        $(selector).each((i, el) => {
            const animeId = $(el)
                .find(".film-detail .film-name .dynamic-name")
                ?.attr("href")
                ?.slice(1)
                .split("?ref=search")[0] || null;
            animes.push({
                id: animeId,
                name: $(el)
                    .find(".film-detail .film-name .dynamic-name")
                    ?.text()
                    ?.trim(),
                jname: $(el)
                    .find(".film-detail .film-name .dynamic-name")
                    .attr("data-jname")
                    ?.trim() || null,
                poster: $(el)
                    .find(".film-poster .film-poster-img")
                    ?.attr("data-src")
                    ?.trim() || null,
                duration: $(el)
                    .find(".film-detail .fd-infor .fdi-item.fdi-duration")
                    ?.text()
                    ?.trim(),
                type: $(el)
                    .find(".film-detail .fd-infor .fdi-item:nth-of-type(1)")
                    ?.text()
                    ?.trim(),
                rating: $(el).find(".film-poster .tick-rate")?.text()?.trim() || null,
                episodes: {
                    sub: Number($(el)
                        .find(".film-poster .tick-sub")
                        ?.text()
                        ?.trim()
                        .split(" ")
                        .pop()) || null,
                    dub: Number($(el)
                        .find(".film-poster .tick-dub")
                        ?.text()
                        ?.trim()
                        .split(" ")
                        .pop()) || null,
                },
            });
        });
        return animes;
    }
    catch (err) {
        throw http_errors_1.default.InternalServerError(err?.message || "Something went wrong");
    }
};
exports.extractAnimes = extractAnimes;
const extractTop10Animes = ($, period) => {
    try {
        const animes = [];
        const selector = `#top-viewed-${period} ul li`;
        $(selector).each((i, el) => {
            animes.push({
                id: $(el)
                    .find(".film-detail .dynamic-name")
                    ?.attr("href")
                    ?.slice(1)
                    .trim() || null,
                rank: Number($(el).find(".film-number span")?.text()?.trim()) || null,
                name: $(el).find(".film-detail .dynamic-name")?.text()?.trim() || null,
                jname: $(el).find(".film-detail .dynamic-name")?.attr("data-jname")?.trim() || null,
                poster: $(el)
                    .find(".film-poster .film-poster-img")
                    ?.attr("data-src")
                    ?.trim() || null,
                episodes: {
                    sub: Number($(el)
                        .find(".film-detail .fd-infor .tick-item.tick-sub")
                        ?.text()
                        ?.trim()) || null,
                    dub: Number($(el)
                        .find(".film-detail .fd-infor .tick-item.tick-dub")
                        ?.text()
                        ?.trim()) || null,
                },
            });
        });
        return animes;
    }
    catch (err) {
        throw http_errors_1.default.InternalServerError(err?.message || "Something went wrong");
    }
};
exports.extractTop10Animes = extractTop10Animes;
const extractMostPopularAnimes = ($, selector) => {
    try {
        const animes = [];
        $(selector).each((i, el) => {
            animes.push({
                id: $(el)
                    .find(".film-detail .dynamic-name")
                    ?.attr("href")
                    ?.slice(1)
                    .trim() || null,
                name: $(el).find(".film-detail .dynamic-name")?.text()?.trim() || null,
                poster: $(el)
                    .find(".film-poster .film-poster-img")
                    ?.attr("data-src")
                    ?.trim() || null,
                jname: $(el)
                    .find(".film-detail .film-name .dynamic-name")
                    .attr("data-jname")
                    ?.trim() || null,
                episodes: {
                    sub: Number($(el)?.find(".fd-infor .tick .tick-sub")?.text()?.trim()) ||
                        null,
                    dub: Number($(el)?.find(".fd-infor .tick .tick-dub")?.text()?.trim()) ||
                        null,
                },
                type: $(el)
                    ?.find(".fd-infor .tick")
                    ?.text()
                    ?.trim()
                    ?.replace(/[\s\n]+/g, " ")
                    ?.split(" ")
                    ?.pop() || null,
            });
        });
        return animes;
    }
    catch (err) {
        throw http_errors_1.default.InternalServerError(err?.message || "Something went wrong");
    }
};
exports.extractMostPopularAnimes = extractMostPopularAnimes;
function retrieveServerId($, index, category) {
    return ($(`.ps_-block.ps_-block-sub.servers-${category} > .ps__-list .server-item`)
        ?.map((_, el) => $(el).attr("data-server-id") == `${index}` ? $(el) : null)
        ?.get()[0]
        ?.attr("data-id") || null);
}
exports.retrieveServerId = retrieveServerId;
function substringAfter(str, toFind) {
    const index = str.indexOf(toFind);
    return index == -1 ? "" : str.substring(index + toFind.length);
}
exports.substringAfter = substringAfter;
function substringBefore(str, toFind) {
    const index = str.indexOf(toFind);
    return index == -1 ? "" : str.substring(0, index);
}
exports.substringBefore = substringBefore;
