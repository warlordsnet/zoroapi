import { RequestHandler } from "express";
import { scrapeAnimeCategory } from "../parsers";
import { CategoryAnimePathParams, CategoryAnimeQueryParams } from "../models/controllers";
declare const getAnimeCategory: RequestHandler<CategoryAnimePathParams, Awaited<ReturnType<typeof scrapeAnimeCategory>>, unknown, CategoryAnimeQueryParams>;
export default getAnimeCategory;
