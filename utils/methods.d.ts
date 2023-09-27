import { CheerioAPI, SelectorType } from "cheerio";
import { HttpError } from "http-errors";
import { Anime, Top10Anime, MostPopularAnime, Top10AnimeTimePeriod } from "../models/anime";
export declare const extractAnimes: ($: CheerioAPI, selector: SelectorType) => Array<Anime> | HttpError;
export declare const extractTop10Animes: ($: CheerioAPI, period: Top10AnimeTimePeriod) => Array<Top10Anime> | HttpError;
export declare const extractMostPopularAnimes: ($: CheerioAPI, selector: SelectorType) => Array<MostPopularAnime> | HttpError;
export declare function retrieveServerId($: CheerioAPI, index: number, category: "sub" | "dub"): string | null;
export declare function substringAfter(str: string, toFind: string): string;
export declare function substringBefore(str: string, toFind: string): string;
