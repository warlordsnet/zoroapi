"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const crypto_js_1 = require("crypto-js");
const utils_1 = require("../utils");
class RapidCloud {
    constructor() {
        this.serverName = "RapidCloud";
        this.sources = [];
        this.fallbackKey = "c1d17096f2ca11b7";
        this.host = "https://rapid-cloud.co";
    }
    async extract(videoUrl) {
        const result = {
            sources: [],
            subtitles: [],
        };
        try {
            const id = videoUrl.href.split("/").pop()?.split("?")[0];
            const options = {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            };
            let res = null;
            res = await axios_1.default.get(`https://${videoUrl.hostname}/embed-2/ajax/e-1/getSources?id=${id}`, options);
            let { data: { sources, tracks, intro, encrypted }, } = res;
            let decryptKey = await (await axios_1.default.get("https://github.com/enimax-anime/key/blob/e6/key.txt")).data;
            decryptKey = (0, utils_1.substringBefore)((0, utils_1.substringAfter)(decryptKey, '"blob-code blob-code-inner js-file-line">'), "</td>");
            if (!decryptKey) {
                decryptKey = await (await axios_1.default.get("https://raw.githubusercontent.com/enimax-anime/key/e6/key.txt")).data;
            }
            if (!decryptKey)
                decryptKey = this.fallbackKey;
            try {
                if (encrypted) {
                    const sourcesArray = sources.split("");
                    let extractedKey = "";
                    for (const index of decryptKey) {
                        for (let i = index[0]; i < index[1]; i++) {
                            extractedKey += sources[i];
                            sourcesArray[i] = "";
                        }
                    }
                    decryptKey = extractedKey;
                    sources = sourcesArray.join("");
                    const decrypt = crypto_js_1.AES.decrypt(sources, decryptKey);
                    sources = JSON.parse(decrypt.toString(crypto_js_1.enc.Utf8));
                }
            }
            catch (err) {
                console.log(err.message);
                throw new Error("Cannot decrypt sources. Perhaps the key is invalid.");
            }
            this.sources = sources?.map((s) => ({
                url: s.file,
                isM3U8: s.file.includes(".m3u8"),
            }));
            result.sources.push(...this.sources);
            if (videoUrl.href.includes(new URL(this.host).host)) {
                result.sources = [];
                this.sources = [];
                for (const source of sources) {
                    const { data } = await axios_1.default.get(source.file, options);
                    const m3u8data = data
                        .split("\n")
                        .filter((line) => line.includes(".m3u8") && line.includes("RESOLUTION="));
                    const secondHalf = m3u8data.map((line) => line.match(/RESOLUTION=.*,(C)|URI=.*/g)?.map((s) => s.split("=")[1]));
                    const TdArray = secondHalf.map((s) => {
                        const f1 = s[0].split(",C")[0];
                        const f2 = s[1].replace(/"/g, "");
                        return [f1, f2];
                    });
                    for (const [f1, f2] of TdArray) {
                        this.sources.push({
                            url: `${source.file?.split("master.m3u8")[0]}${f2.replace("iframes", "index")}`,
                            quality: f1.split("x")[1] + "p",
                            isM3U8: f2.includes(".m3u8"),
                        });
                    }
                    result.sources.push(...this.sources);
                }
                if (intro.end > 1) {
                    result.intro = {
                        start: intro.start,
                        end: intro.end,
                    };
                }
            }
            result.sources.push({
                url: sources[0].file,
                isM3U8: sources[0].file.includes(".m3u8"),
                quality: "auto",
            });
            result.subtitles = tracks
                .map((s) => s.file
                ? { url: s.file, lang: s.label ? s.label : "Thumbnails" }
                : null)
                .filter((s) => s);
            return result;
        }
        catch (err) {
            console.log(err.message);
            throw err;
        }
    }
}
exports.default = RapidCloud;
