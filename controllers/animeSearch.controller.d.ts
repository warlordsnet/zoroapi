import { RequestHandler } from "express";
import { scrapeAnimeSearch } from "../parsers";
import { AnimeSearchQueryParams } from "../models/controllers";
declare const getAnimeSearch: RequestHandler<unknown, Awaited<ReturnType<typeof scrapeAnimeSearch>>, unknown, AnimeSearchQueryParams>;
export default getAnimeSearch;
