"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncArray = exports.sync = void 0;
const API_1 = require("./API");
class AniSync extends API_1.default {
    /**
     * @constructor
     * @param item1: Optional media item.
     * @param item2: Optional media item.
     * @param opts: Optional options object.
     */
    constructor(item1, item2, opts) {
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
    sync(item1, item2) {
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
        }
        else {
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
    syncArray(item1, item2) {
        const results = [];
        for (let i = 0; i < item1.length; i++) {
            for (let j = 0; j < item2.length; j++) {
                if (this.compare(item1[i], item2[j], this.options.stringThreshold, this.options.comparisonThreshold)) {
                    results.push([item1[i], item2[j]]);
                }
            }
        }
        return results;
    }
}
exports.default = AniSync;
function sync(item1, item2, opts) {
    const sync = new AniSync(item1, item2, opts);
    return sync.sync();
}
exports.sync = sync;
function syncArray(item1, item2, opts) {
    const sync = new AniSync(null, null, opts);
    return sync.syncArray(item1, item2);
}
exports.syncArray = syncArray;
//# sourceMappingURL=AniSync.js.map