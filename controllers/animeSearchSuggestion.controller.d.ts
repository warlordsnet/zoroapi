import { RequestHandler } from "express";
import { scrapeAnimeSearchSuggestion } from "../parsers";
import { AnimeSearchSuggestQueryParams } from "../models/controllers";
declare const getAnimeSearchSuggestion: RequestHandler<unknown, Awaited<ReturnType<typeof scrapeAnimeSearchSuggestion>>, unknown, AnimeSearchSuggestQueryParams>;
export default getAnimeSearchSuggestion;
