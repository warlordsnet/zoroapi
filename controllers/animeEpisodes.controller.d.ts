import { RequestHandler } from "express";
import { scrapeAnimeEpisodes } from "../parsers";
import { AnimeEpisodePathParams } from "../models/controllers";
declare const getAnimeEpisodes: RequestHandler<AnimeEpisodePathParams, Awaited<ReturnType<typeof scrapeAnimeEpisodes>>, unknown, unknown>;
export default getAnimeEpisodes;
