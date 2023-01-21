# AniSync Core
AniSync Core is a library that allows you to sync your anime list with other services. This library specifically is used for the core functionality of AniSync, but can be used for other projects as well.

## Installation
AniSync Core is available on NPM. You may also clone the repository and build it yourself.
```bash
npm install anisync-core
git clone https://github.com/Eltik/AniSync-Core.git
```
To add AniSync Core to your project, simply import it.
```typescript
// ES6
import AniSync from 'anisync-core';

// CommonJS
const AniSync = require('anisync-core').default;
```

## How it Works
AniSync Core is relatively simple. The main function will take two media objects:
```typescript
interface Media {
    title: {
        english?:string;
        romaji?:string;
        native?:string;
    },
    data?:any
}
```
The English title, romaji title, and native title all don't have to be filled out completely. However, to improve accuracy, it is recommended to input all fields if possible. The data field is used to store any additional information that may be needed for the sync. For example, for AniList this may be the MAL ID, AniList ID, etc. After inputting the valid parameters, using [Dice's Coefficient](https://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient) (courtesy of the NPM package [string-similarity](https://www.npmjs.com/package/string-similarity)), the library will find the best match between the each media's title. If the match is above a certain threshold, the media will be considered a match. That's about it.

## Documentation
### Syncing
Syncing requires two media objects, with the `sync()` function returning a boolean and the `syncArray()` function returning an array of media objects. It is recommended to use the `sync()` function since the `syncArray()` function might not be entirely accurate.
```typescript
import { sync, syncArray } from 'anisync-core';
const aniList = {
    title: {
        english: 'Attack on Titan',
        romaji: 'Shingeki no Kyojin',
        native: '進撃の巨人'
    },
    data: {
        id: 16498
    }
};
const kitsu = {
    title: {
        english: undefined,
        romaji: 'Shingeki no Kyojin',
        native: '進撃の巨人'
    },
    data: {
        id: 16498
    }
};

sync(aniList, kitsu); // true
syncArray([aniList, kitsu]); // [{ title: { english: 'Attack on Titan', romaji: 'Shingeki no Kyojin', native: '進撃の巨人' }, data: { id: 16498 }}, {...}]
```

### Configuration
The AniSync object can take custom options: the `stringThreshold` field and `comparisonThreshold` field. The `stringThreshold` field can be a decimal from `0-1` and changes the threshold at which two titles can be matched. For example, `Attack on Titan` and `Attack on` might return a comparison amount of 0.8, but if you don't want to add it, you can just increase the `stringThreshold` to 0.9. The `comparisonThreshold` field is a decimal from `0-1` as well, and changes the threshold at which two media objects can be matched. It's a bit confusing, but essentially the `compare()` function in the `API.ts` file takes the average comparison of two medias (the amount of successful matches for each English/Romaji/Native title divided by the amount of attempts) and compares it to the `comparisonThreshold`. If it's above the threshold, the media objects are considered a match.
```typescript
import AniSync from 'anisync-core';
const anisync = new AniSync({
    stringThreshold: 0.9,
    comparisonThreshold: 0.85
});
```

## Contribution
AniSync is still a work-in-progress and sometimes doesn't map titles correctly (Classroom of the Elite and its seasons, for example; dubbed the COTE test by Consumet) so contribution would very much be appreciated. Please open a (Pull Request)[https://github.com/Eltik/AniSync-Core/pulls] if you would like to contribute.