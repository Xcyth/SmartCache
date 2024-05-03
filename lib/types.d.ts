/*
 * Copyright (c) Ritam Choudhuri 2024.
 */

export interface CacheData {
    data: any;
    expiry: number | null;
    expired: boolean;
}

export interface Options {
    maxEntries?: number | null;
    globalExpiry?: number | null;
    expiresIn?: number | null;
    keepExpired?: boolean;
    onRemove?: (key: string, value: CacheValue) => void;
    safeMode?: boolean; // If true, the cache will not override existing keys.
}

export interface GetOptions {
    raw?: boolean;
    includeExpired?: boolean;
}

export interface CountOptions {
    invalidateExpired?: boolean;
}

export interface SetOptions {
    expiry?: number | null;
    force?: boolean; // If true, the cache will override existing keys.
}

export interface InvalidateCacheOptions {
    full: boolean;
}