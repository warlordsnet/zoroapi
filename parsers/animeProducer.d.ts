import { HttpError } from "http-errors";
import { ScrapedProducerAnime } from "../models/parsers";
declare function scrapeProducerAnimes(producerName: string, page?: number): Promise<ScrapedProducerAnime | HttpError>;
export default scrapeProducerAnimes;
