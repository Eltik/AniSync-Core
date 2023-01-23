import PromiseRequest, { Options, Response } from "./libraries/promise-request";
import { Cheerio, load } from "cheerio";
import { ReadStream, WriteStream } from "fs";
import StringSimilarity from "./libraries/StringSimilarity";
import { Format } from "./providers/AniList";

export default class API {
    private stringSim:StringSimilarity = new StringSimilarity();
    private userAgent:string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36';

    constructor() {
    }

    public async fetch(url:string, options?:Options): Promise<Response> {
        const request = new PromiseRequest(url, {
            ...options,
            headers: {
                ...options?.headers,
                'User-Agent': this.userAgent
            }
        });
        const data = await request.request();
        return data;
    }

    public async fetchDOM(url:string, selector:string, options?:Options): Promise<DOM> {
        const request = new PromiseRequest(url, {
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

        const $ = load(data.text());
        const result = $(selector);
        const dom:DOM = {
            Response: data,
            Cheerio: result
        };
        return dom;
    }

    public async stream(url:string, stream:ReadableStream|WritableStream|ReadStream|WriteStream, options?:Options) {
        const request = new PromiseRequest(url, {
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

    public async wait(time:number) {
        return new Promise(resolve => {
            setTimeout(resolve, time);
        });
    }

    public getRandomInt(max):number {
        return Math.floor(Math.random() * max);
    }

    public makeId(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    public stringSearch(string:string, pattern:string):number {
        let count = 0;
        string = string.toLowerCase();
        pattern = pattern.toLowerCase();
        string = string.replace(/[^a-zA-Z0-9 -]/g, "");
        pattern = pattern.replace(/[^a-zA-Z0-9 -]/g, "");
        
        for (let i = 0; i < string.length; i++) {
            for (let j = 0; j < pattern.length; j++) {
                if (pattern[j] !== string[i + j]) break;
                if (j === pattern.length - 1) count++;
            }
        }
        return count;
    }

    public compare(a:Media, b:Media, stringThreshold?:number, comparisonThreshold?:number):boolean {
        const comparison = this.checkItem(a, b, stringThreshold);
        if (comparison > comparisonThreshold) {
            return true;
        } else {
            return false;
        }
    }

    private checkItem(result1:Media, result2:Media, threshold:number):number {
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

interface DOM {
    Response:Response;
    Cheerio:Cheerio<any>;
}

interface Media {
    title: {
        english?:string;
        romaji?:string;
        native?:string;
    };
    year?:string;
    format?:Format;
    data?:any;
}

export enum ProviderType {
    ANIME = "ANIME",
    MANGA = "MANGA"
}

// Base tables are below.
// CREATE TABLE anime(id int(7) NOT NULL, anilist longtext not null, connectors longtext not null);
// CREATE TABLE manga(id int(7) NOT NULL, anilist longtext not null, connectors longtext not null);

// Cached table can store episodes or chapters.
// CREATE TABLE cached(id int(7) NOT NULL, data longtext not null);

export type { DOM, Media };