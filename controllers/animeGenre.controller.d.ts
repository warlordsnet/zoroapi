import { RequestHandler } from "express";
import { scrapeGenreAnime } from "../parsers";
import { GenreAnimePathParams, GenreAnimeQueryParams } from "../models/controllers";
declare const getGenreAnime: RequestHandler<GenreAnimePathParams, Awaited<ReturnType<typeof scrapeGenreAnime>>, unknown, GenreAnimeQueryParams>;
export default getGenreAnime;
