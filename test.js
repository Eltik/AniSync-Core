const { syncArray } = require("./built/AniSync");

const AniList = require("./built/providers/AniList").default;
const Kitsu = require("./built/providers/Kitsu").default;
const a = new AniList("ANIME", "TV");
const b = new Kitsu("ANIME");

a.search("classroom of the elite").then((data1) => {
    console.log("AniList: " + data1.length + " results.");
    b.search("classroom of the elite").then((data2) => {
        console.log("Kitsu: " + data2.length + " results.");
        const data = syncArray(data1, data2, {
            stringThreshold: 0.95,
            comparisonThreshold: 0.95,
        });
        console.log("Received " + data.length + " results.");
        data.map((element, index) => {
            console.log(`Match ${index + 1}: ${element[0].title.romaji} - ${element[1].title.romaji}`);
        })
    });
})