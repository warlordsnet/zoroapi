import { RequestHandler } from "express";
import { scrapeAnimeEpisodeSources } from "../parsers";
import { AnimeEpisodeSrcsQueryParams } from "../models/controllers";
declare const getAnimeEpisodeSources: RequestHandler<unknown, Awaited<ReturnType<typeof scrapeAnimeEpisodeSources>>, unknown, AnimeEpisodeSrcsQueryParams>;
export default getAnimeEpisodeSources;
