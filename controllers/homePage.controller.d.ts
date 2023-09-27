import { RequestHandler } from "express";
import { scrapeHomePage } from "../parsers";
declare const getHomePageInfo: RequestHandler<unknown, Awaited<ReturnType<typeof scrapeHomePage>>>;
export default getHomePageInfo;
