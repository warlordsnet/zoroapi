import { RequestHandler } from "express";
import { scrapeEpisodeServers } from "../parsers";
import { EpisodeServersQueryParams } from "../models/controllers";
declare const getEpisodeServers: RequestHandler<unknown, Awaited<ReturnType<typeof scrapeEpisodeServers>>, unknown, EpisodeServersQueryParams>;
export default getEpisodeServers;
