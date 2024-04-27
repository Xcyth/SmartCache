/*
 * Copyright (c) Ritam Choudhuri 2024.
 */

import type {CacheData, GetOptions, InvalidateCacheOptions, Options, SetOptions} from './types';

class Cache {
    private readonly _cache: Map<string, CacheData>;
    private _options: Options;

    constructor(options: Options = {} as Options) {
        this._options = options;
        this._cache = new Map();
        setTimeout(() => {
            this.invalidateCache( null, { full: false } );
        }, 10 * 1000); // Deletes expired keys every 10 seconds

        if (this._options.globalExpiry) {
            setInterval(() => {
                this.invalidateCache( null, { full: true } );
            }, this._options.globalExpiry);
        }

        console.log('[SmartCache Log]: Cache created');
    }

    getInstance() {
        return this._cache;
    }

    private static createCacheData(data: any, expiresIn: number | null | undefined): CacheData {
        let returnData: CacheData;

        if (!expiresIn) {
            returnData = {
                data,
                expiry: null,
                expired: false
            };
        } else {
            returnData = {
                data,
                expiry: Date.now() + expiresIn,
                expired: false
            };
        }

        return returnData;
    }

    private static throwErr(error: string) {
        throw new Error(`[SmartCache Error]: ${error}`);
    }

    private isExpired(key: any) {
        const cachedData: CacheData | undefined = this._cache.get(key);

        if (!cachedData) {
            return Cache.throwErr('Key not found in cache');
        }

        if (cachedData.expiry && cachedData.expiry < Date.now()) {
            return true;
        }
    }

    private remove(key: any) {
        const cachedData = this._cache.get(key);
        if (!cachedData) return;
        if (this._options.keepExpired) {
            this._cache.set(key, { data: cachedData.data, expiry: null, expired: true });
        } else {
            this._cache.delete(key);
            if (this._options.onRemove) {
                this._options.onRemove(key, cachedData.data);
            }
        }
    }

    private invalidateCache(key: string | null = null, options: InvalidateCacheOptions) {
        if (key) {

            if (this._cache.has(key)) {
                this.remove(key);
            } else {
                Cache.throwErr('Key not found in cache');
            }

            return;

        }

        if (this._cache.size < 1) return;

        this._cache.forEach((data, key) => {
            if (this.isExpired(key)) {
                this.remove(key)
            }
        });

        if (options.full) {
            this._cache.forEach((data, key) => {
                this.remove(key)
            });
        }
    }

    // TODO Check if key is present in cache before setting and if safe mode is on, throw error. If force is true, overwrite the data
    // TODO Check if cache limit is reached before setting. If true and maxEntries has a data, throw error
    set(key: string, data: any, options: SetOptions = { expiry: null, force: false }) {
        const { expiry: expiresIn, force } = options;

        // if (this._cache.size >= this._options.maxEntries && !force) {
        //     Cache.throwErr('Cache limit reached');
        // }

        return this._cache.set(key, Cache.createCacheData(data, expiresIn));
    }

    get(key: string, options?: GetOptions) {
        const cachedData: CacheData | undefined = this._cache.get(key);

        if (!cachedData) {
            return Cache.throwErr('Key not found in cache');
        }

        if (this.isExpired(key)) {
            this._cache.delete(key);
            if (!this._options.onRemove) {
                return undefined;
            }
            return this._options.onRemove(key, cachedData.data);
        }

        if (options?.raw) {
            return cachedData;
        } else {
            return cachedData.data;
        }
    }


}

export default Cache;