import { HttpError } from "http-errors";
import { ScrapedAnimeAboutInfo } from "../models/parsers";
declare function scrapeAnimeAboutInfo(id: string): Promise<ScrapedAnimeAboutInfo | HttpError>;
export default scrapeAnimeAboutInfo;
