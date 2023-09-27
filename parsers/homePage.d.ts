import { HttpError } from "http-errors";
import { ScrapedHomePage } from "../models/parsers";
declare function scrapeHomePage(): Promise<ScrapedHomePage | HttpError>;
export default scrapeHomePage;
