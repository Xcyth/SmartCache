# SmartCache

SmartCache is a simple, efficient caching system implemented in TypeScript.

## Features

- Customizable cache expiry times
- Option to keep expired cache data
- Callback function for when data is removed
- Regular cache invalidation

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install SmartCache.

```bash
npm install @xcyth/smartcache
```

## Usage

```typescript
/*
 * Copyright (c) Ritam Choudhuri 2024.
 */

// Importing the Cache class from the index file
import Cache from './index';

// Creating a new instance of the Cache class with some options
const cache = new Cache({
    maxEntries: 10, // Maximum number of entries in the cache
    expiresIn: 10000, // Global expiry time for all cache entries
    onRemove: (key, value) => { // Callback function to be executed when an entry is removed
        console.log(`Cache value with key: ${key} removed, value: ${value}`)
    },
    safeMode: true, // Safe mode enabled
    keepExpired: true, // Keep expired entries in the cache
    globalExpiry: 10000 // Global expiry time for all cache entries
});

// Setting a cache entry with key 'key1' and value 'value1' with an expiry time of 5000ms
cache.set('key1', 'value1', { expiry: 5000 });

try {
    // Attempting to set a complex cache entry with key 'ea'
    cache.set('ea', {
        bin: [0o1100101, 0o1100001, 0o1110011, 0o1110100, 0o1100101, 0o1110010, 0o0100000, 0o1100101, 0o1100111, 0o1100111, 0o0111111],
        dec: [101, 97, 115, 116, 101, 114, 32, 101, 103, 103, 63],
        hex: [0x65, 0x61, 0x73, 0x74, 0x65, 0x72, 0x20, 0x65, 0x67, 0x67, 0x3F],
        oct: [0o145, 0o141, 0o163, 0o164, 0o145, 0o162, 0o40, 0o145, 0o147, 0o147, 0o77],
        str: '???'
    });
} catch (e) {
    // Catching and logging any errors that occur when setting the cache entry
    console.log("Maybe it's supposed to throw an error, maybe not. Who knows?")
}

// Setting a cache entry with key 'key3' and value 8554126652 with an expiry time of 25000ms
cache.set('key3', 8554126652, { expiry: 25000 });

// Logging the values of some cache entries
console.log(cache.get('key1'));
console.log(cache.get('ea'));
console.log(cache.get('key3'));

// Logging the size of the cache
console.log(cache.size);
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://opensource.org/licenses/MIT)