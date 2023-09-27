import { RequestHandler } from "express";
import { scrapeProducerAnimes } from "../parsers";
import { AnimeProducerPathParams, AnimeProducerQueryParams } from "../models/controllers";
declare const getProducerAnimes: RequestHandler<AnimeProducerPathParams, Awaited<ReturnType<typeof scrapeProducerAnimes>>, unknown, AnimeProducerQueryParams>;
export default getProducerAnimes;
