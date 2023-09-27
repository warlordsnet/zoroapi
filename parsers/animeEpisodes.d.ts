import { HttpError } from "http-errors";
import { ScrapedAnimeEpisodes } from "../models/parsers";
declare function scrapeAnimeEpisodes(animeId: string): Promise<ScrapedAnimeEpisodes | HttpError>;
export default scrapeAnimeEpisodes;
