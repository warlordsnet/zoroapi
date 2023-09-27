import { HttpError } from "http-errors";
import { ScrapedEpisodeServers } from "../models/parsers";
declare function scrapeEpisodeServers(episodeId: string): Promise<ScrapedEpisodeServers | HttpError>;
export default scrapeEpisodeServers;
