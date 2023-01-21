import API, { Media } from "./API";

export default class AniSync extends API {
    private item1:Media;
    private item2:Media;
    private options:Options;

    /**
     * @constructor
     * @param item1: Optional media item. 
     * @param item2: Optional media item.
     * @param opts: Optional options object.
     */
    constructor(item1?:Media, item2?:Media, opts?:Options) {
        super();
        
        this.item1 = item1;
        this.item2 = item2;
        this.options = opts ? opts : {
            stringThreshold: 0.8,
            comparisonThreshold: 0.8
        };
    }

    /**
     * @function: Syncs two media items.
     * @param item1: Optional media item. Defaults to item1 provided in constructor.
     * @param item2: Optional media item. Defaults to item2 provided in constructor.
     * @returns: Boolean indicating whether the two items are similar/can match.
     */
    public sync(item1?:Media, item2?:Media):boolean {
        if (item1) {
            this.item1 = item1;
        }
        if (item2) {
            this.item2 = item2;
        }

        if (!this.item1 || !this.item2) {
            throw new Error("No items provided.");
        }
        if (this.compare(this.item1, this.item2, this.options.stringThreshold, this.options.comparisonThreshold)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @unsafe This function is unsafe and may be innacurate.
     * @function: Compares two media item arrays.
     * @param item1: Array of media items.
     * @param item2: Array of media items.
     * @returns: Array of arrays of media items that are similar/can match.
     */
    public syncArray(item1:Media[], item2:Media[]):Media[][] {
        const results:Media[][] = [];
        for (let i = 0 ; i < item1.length; i++) {
            for (let j = 0; j < item2.length; j++) {
                if (this.compare(item1[i], item2[j], this.options.stringThreshold, this.options.comparisonThreshold)) {
                    results.push([item1[i], item2[j]]);
                }
            }
        }
        return results;
    }
}

export function sync(item1:Media, item2:Media, opts?:Options):boolean {
    const sync = new AniSync(item1, item2, opts);
    return sync.sync();
}

export function syncArray(item1:Media[], item2:Media[], opts?:Options):Media[][] {
    const sync = new AniSync(null, null, opts);
    return sync.syncArray(item1, item2);
}

interface Options {
    stringThreshold?:number; // The threshold at which to match the titles of each media.
    comparisonThreshold?:number; // Threshold at which the average of each media comparison must be above to be considered a match.
}

export type { Options };