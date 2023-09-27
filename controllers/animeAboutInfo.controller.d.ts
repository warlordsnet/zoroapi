import { RequestHandler } from "express";
import { scrapeAnimeAboutInfo } from "../parsers";
import { AnimeAboutInfoQueryParams } from "../models/controllers";
declare const getAnimeAboutInfo: RequestHandler<unknown, Awaited<ReturnType<typeof scrapeAnimeAboutInfo>>, unknown, AnimeAboutInfoQueryParams>;
export default getAnimeAboutInfo;
