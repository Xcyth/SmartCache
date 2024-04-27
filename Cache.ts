/*
 * Copyright (c) Ritam Choudhuri 2024.
 */

import type { CacheData, GetOptions, InvalidateCacheOptions, Options, SetOptions, CountOptions } from './types';

class Cache {
    private readonly _cache: Map<string, CacheData>;
    private _options: Options;

    constructor(options: Options = {} as Options) {
        this._options = options;
        this._cache = new Map();

        setTimeout(() => {
            this.invalidateCache(null, { full: false });
        }, 10 * 1000); // Deletes expired keys every 10 seconds

        if (this._options.globalExpiry) {
            setInterval(() => {
                this.invalidateCache(null, { full: true });
            }, this._options.globalExpiry);
        }

        console.log('[SmartCache Log]: Cache created');
    }

    get instance() {
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

        const newData: CacheData = { data: cachedData.data, expiry: null, expired: true };

        if (this._options.keepExpired) {
            this._cache.set(key, newData);
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

    set(key: string, data: any, options: SetOptions = { expiry: null, force: false }) {
        const { expiry: expiresIn, force } = options;

        if (this._options.safeMode && this._cache.has(key) && !force) {
            return Cache.throwErr('Key already exists in cache. Use force option to override');
        }

        if (this._options.maxEntries && this._cache.size >= this._options.maxEntries) {
            return Cache.throwErr('Cache limit reached');
        }

        return this._cache.set(key, Cache.createCacheData(data, expiresIn));
    }

    get(key: string, options?: GetOptions) {
        let cachedData: CacheData | undefined = this._cache.get(key);

        if (!cachedData) {
            return Cache.throwErr('Key not found in cache');
        }

        if (this.isExpired(key)) {
            this.remove(key);
            cachedData = this._cache.get(key);

            if (!((options?.includeExpired) && this._options.keepExpired)) {
                return Cache.throwErr('Key not found in cache');
            }
        }

        if (options?.raw) {
            return cachedData;
        } else {
            return cachedData?.data;
        }
    }

    getOrElse(key: string, consumer: Function) {
        let cachedData: CacheData | undefined = this._cache.get(key);

        if (!cachedData || this.isExpired(key)) {

            let value = consumer();

            this.set(key, value)

            return value;
        }

        return cachedData?.data;
    }


    delete(key: string) {
        if (!this._cache.has(key)) return Cache.throwErr('Key not found in cache')

        if (this._options.safeMode) {
            this.remove(key);
        } else {
            this._cache.delete(key);
        }
    }

    clear() {
        this._cache.clear();
    }

    get size() {
        return this._cache.size;
    }

    // Returns the number of non-expired keys in the cache
    get count(options: CountOptions = { invalidateExpired: false }) {
        let ret = 0;

        this._cache.forEach((data, key) => {
            if (!data.expired) {
                ret++;
            } else if (options.invalidateExpired) {
                this.invalidateCache(key, { full: false })
            }
        });

        return ret;
    }
}

export default Cache;