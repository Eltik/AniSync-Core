"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const API_1 = require("../API");
const AniList_1 = require("./AniList");
class Kitsu extends API_1.default {
    constructor(type) {
        super();
        this.api = 'https://kitsu.io/api/edge';
        this.type = undefined;
        this.type = type;
    }
    async search(query, type) {
        type = type ? type : this.type;
        if (!type) {
            throw new Error("No type provided.");
        }
        if (type === AniList_1.Type.ANIME) {
            return await this.searchAnime(query);
        }
        else if (type === AniList_1.Type.MANGA) {
            return await this.searchManga(query);
        }
        else {
            throw new Error("Invalid type provided.");
        }
    }
    async searchAnime(query) {
        const results = [];
        const searchUrl = `/anime?filter[text]=${encodeURIComponent(query)}`;
        try {
            const req = await this.fetch(this.api + searchUrl, {
                headers: {
                    "Accept": "application/vnd.api+json",
                    "Content-Type": "application/vnd.api+json"
                }
            }).catch((err) => {
                return null;
            });
            if (!req) {
                return results;
            }
            const data = req.json();
            if (data.data.length > 0) {
                data.data.forEach((result) => {
                    results.push({
                        title: {
                            english: result.attributes.titles.en_us,
                            romaji: result.attributes.titles.en_jp,
                            native: result.attributes.titles.ja_jp,
                        },
                        data: result
                    });
                });
                return results;
            }
            else {
                return results;
            }
        }
        catch (e) {
            throw new Error(e);
        }
    }
    async searchManga(query) {
        const results = [];
        const searchUrl = `/manga?filter[text]=${encodeURIComponent(query)}`;
        try {
            const req = await this.fetch(this.api + searchUrl, {
                headers: {
                    "Accept": "application/vnd.api+json",
                    "Content-Type": "application/vnd.api+json"
                }
            }).catch((err) => {
                return null;
            });
            if (!req) {
                return results;
            }
            const data = req.json();
            if (data.data.length > 0) {
                data.data.forEach((result) => {
                    results.push({
                        title: {
                            english: result.attributes.titles.en,
                            romaji: result.attributes.titles.en_jp,
                            native: result.attributes.titles.ja_jp,
                        },
                        data: result
                    });
                });
                return results;
            }
            else {
                return results;
            }
        }
        catch (e) {
            throw new Error(e);
        }
    }
}
exports.default = Kitsu;
//# sourceMappingURL=Kitsu.js.map