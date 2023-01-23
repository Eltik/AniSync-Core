"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderType = void 0;
const promise_request_1 = require("./libraries/promise-request");
const cheerio_1 = require("cheerio");
const StringSimilarity_1 = require("./libraries/StringSimilarity");
class API {
    constructor() {
        this.stringSim = new StringSimilarity_1.default();
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36';
    }
    async fetch(url, options) {
        const request = new promise_request_1.default(url, {
            ...options,
            headers: {
                ...options?.headers,
                'User-Agent': this.userAgent
            }
        });
        const data = await request.request();
        return data;
    }
    async fetchDOM(url, selector, options) {
        const request = new promise_request_1.default(url, {
            ...options,
            headers: {
                ...options?.headers,
                'User-Agent': this.userAgent
            }
        });
        const data = await request.request();
        if (!data.text()) {
            throw new Error("Couldn't fetch data.");
        }
        const $ = (0, cheerio_1.load)(data.text());
        const result = $(selector);
        const dom = {
            Response: data,
            Cheerio: result
        };
        return dom;
    }
    async stream(url, stream, options) {
        const request = new promise_request_1.default(url, {
            ...options,
            stream: true,
            headers: {
                ...options?.headers,
                'User-Agent': this.userAgent
            }
        });
        const final = await request.stream(stream).catch((err) => {
            console.error(err);
            return null;
        });
        return final;
    }
    async wait(time) {
        return new Promise(resolve => {
            setTimeout(resolve, time);
        });
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    makeId(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
    stringSearch(string, pattern) {
        let count = 0;
        string = string.toLowerCase();
        pattern = pattern.toLowerCase();
        string = string.replace(/[^a-zA-Z0-9 -]/g, "");
        pattern = pattern.replace(/[^a-zA-Z0-9 -]/g, "");
        for (let i = 0; i < string.length; i++) {
            for (let j = 0; j < pattern.length; j++) {
                if (pattern[j] !== string[i + j])
                    break;
                if (j === pattern.length - 1)
                    count++;
            }
        }
        return count;
    }
    compare(a, b, stringThreshold, comparisonThreshold) {
        const comparison = this.checkItem(a, b, stringThreshold);
        if (comparison > comparisonThreshold) {
            return true;
        }
        else {
            return false;
        }
    }
    checkItem(result1, result2, threshold) {
        let amount = 0;
        let tries = 0;
        const eng1 = result1.title.english != undefined ? result1.title.english.toLowerCase() : undefined;
        const romaj1 = result1.title.romaji != undefined ? result1.title.romaji.toLowerCase() : undefined;
        const native1 = result1.title.native != undefined ? result1.title.native.toLowerCase() : undefined;
        const eng2 = result2.title.english != undefined ? result2.title.english.toLowerCase() : undefined;
        const romaj2 = result2.title.romaji != undefined ? result2.title.romaji.toLowerCase() : undefined;
        const native2 = result2.title.native != undefined ? result2.title.native.toLowerCase() : undefined;
        const year1 = result1.year != undefined && result1.year != "null" ? String(result1.year).toLowerCase() : undefined;
        const year2 = result2.year != undefined && result2.year != "null" ? String(result2.year).toLowerCase() : undefined;
        const format1 = result1.format != undefined ? result1.format.toLowerCase() : undefined;
        const format2 = result2.format != undefined ? result2.format.toLowerCase() : undefined;
        // Check title
        if (eng1 != undefined && eng2 != undefined) {
            tries++;
            const stringComparison = this.stringSim.compareTwoStrings(eng1, eng2);
            if (eng1 === eng2 || stringComparison > threshold) {
                amount++;
            }
        }
        if (romaj1 != undefined && romaj2 != undefined) {
            tries++;
            const stringComparison = this.stringSim.compareTwoStrings(romaj1, romaj2);
            if (romaj1 === romaj2 || stringComparison > threshold) {
                amount++;
            }
        }
        if (native1 != undefined && native2 != undefined) {
            tries++;
            const stringComparison = this.stringSim.compareTwoStrings(native1, native2);
            if (native1 === native2 || stringComparison > threshold) {
                amount++;
            }
        }
        if (year1 != undefined && year2 != undefined) {
            tries++;
            const stringComparison = this.stringSim.compareTwoStrings(year1, year2);
            if (year1 === year2 || stringComparison > threshold) {
                amount++;
            }
        }
        if (format1 != undefined && format2 != undefined) {
            tries++;
            const stringComparison = this.stringSim.compareTwoStrings(format1, format2);
            if (format1 === format2 || stringComparison > threshold) {
                amount++;
            }
        }
        return amount / tries;
    }
}
exports.default = API;
var ProviderType;
(function (ProviderType) {
    ProviderType["ANIME"] = "ANIME";
    ProviderType["MANGA"] = "MANGA";
})(ProviderType = exports.ProviderType || (exports.ProviderType = {}));
//# sourceMappingURL=API.js.map