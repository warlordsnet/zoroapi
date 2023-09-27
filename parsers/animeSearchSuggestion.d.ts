import { HttpError } from "http-errors";
import { ScrapedAnimeSearchSuggestion } from "../models/parsers";
declare function scrapeAnimeSearchSuggestion(q: string): Promise<ScrapedAnimeSearchSuggestion | HttpError>;
export default scrapeAnimeSearchSuggestion;
