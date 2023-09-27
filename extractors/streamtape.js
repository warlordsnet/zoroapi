"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
class StreamTape {
    constructor() {
        this.serverName = "StreamTape";
        this.sources = [];
    }
    async extract(videoUrl) {
        try {
            const { data } = await axios_1.default.get(videoUrl.href).catch(() => {
                throw new Error("Video not found");
            });
            const $ = (0, cheerio_1.load)(data);
            let [fh, sh] = $.html()
                ?.match(/robotlink'\).innerHTML = (.*)'/)[1]
                .split("+ ('");
            sh = sh.substring(3);
            fh = fh.replace(/\'/g, "");
            const url = `https:${fh}${sh}`;
            this.sources.push({
                url: url,
                isM3U8: url.includes(".m3u8"),
            });
            return this.sources;
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
}
exports.default = StreamTape;
