import { AnimeServers } from "../models/anime";
import { HttpError } from "http-errors";
import { ScrapedAnimeEpisodesSources } from "../models/parsers";
declare function scrapeAnimeEpisodeSources(episodeId: string, server?: AnimeServers, category?: "sub" | "dub"): Promise<ScrapedAnimeEpisodesSources | HttpError>;
export default scrapeAnimeEpisodeSources;
