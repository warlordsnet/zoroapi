import { HttpError } from "http-errors";
import { ScrapedAnimeSearchResult } from "../models/parsers";
declare function scrapeAnimeSearch(q: string, page?: number): Promise<ScrapedAnimeSearchResult | HttpError>;
export default scrapeAnimeSearch;
