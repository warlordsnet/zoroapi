import { AnimeCategories } from "../models/anime";
import { HttpError } from "http-errors";
import { ScrapedAnimeCategory } from "../models/parsers";
declare function scrapeAnimeCategory(category: AnimeCategories, page?: number): Promise<ScrapedAnimeCategory | HttpError>;
export default scrapeAnimeCategory;
