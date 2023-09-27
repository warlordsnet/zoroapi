"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parsers_1 = require("../parsers");
const getHomePageInfo = async (req, res, next) => {
    try {
        const data = await (0, parsers_1.scrapeHomePage)();
        res.status(200).json(data);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};
exports.default = getHomePageInfo;
