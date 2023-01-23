const { syncArray } = require("./built/AniSync");

const AniList = require("./built/providers/AniList").default;
const Kitsu = require("./built/providers/Kitsu").default;
const a = new AniList("ANIME", "TV");
const b = new Kitsu("ANIME");

a.search("86").then((data1) => {
    console.log("AniList: " + data1.length + " results.");
    b.search("86").then((data2) => {
        console.log("Kitsu: " + data2.length + " results.");
        const data = syncArray(data1, data2, {
            stringThreshold: 0.75,
            comparisonThreshold: 0.7,
        });
        console.log("Received " + data.length + " results.");
        data.map((element, index) => {
            console.log(`Match ${index + 1}: ${element[0].title.romaji} - ${element[1].title.romaji}`);
        })

        if (data.length === 0) {
            console.log("No matches found.");
        }
    });
})