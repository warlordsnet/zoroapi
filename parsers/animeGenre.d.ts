import { HttpError } from "http-errors";
import { ScrapedGenreAnime } from "../models/parsers";
declare function scrapeGenreAnime(genreName: string, page?: number): Promise<ScrapedGenreAnime | HttpError>;
export default scrapeGenreAnime;
