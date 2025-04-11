"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const redis_config_1 = require("../config/redis.config");
// set expiration time 
const DEFAULT_EXPIRATION = 60 * 5; // 5 minites
class CacheService {
    /**
     * T -> generic type
     * @param -> key => Cache Key
    */
    static get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if Redis client is connected
                if (!redis_config_1.redisClient.isOpen) {
                    console.warn('Redis client is not connected, skipping cache get');
                    return null;
                }
                console.log('CacheService.get called with key:', key);
                const data = yield redis_config_1.redisClient.get(key);
                if (data) {
                    console.log('Cache hit for key:', key);
                    return JSON.parse(data);
                }
                console.log('Cache miss for key:', key);
                return null;
            }
            catch (error) {
                console.error('Error getting from cache:', error);
                return null;
            }
        });
    }
    /**
     * Set Data in cache
     * @param key -> cache key
     * @param data -> data to be cached
     * @param expiration -> default exp
    */
    static set(key_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (key, data, expiration = DEFAULT_EXPIRATION) {
            try {
                // Check if Redis client is connected
                if (!redis_config_1.redisClient.isOpen) {
                    console.warn('Redis client is not connected, skipping cache set');
                    return;
                }
                console.log('CacheService.set called with key:', key, 'expiration:', expiration);
                yield redis_config_1.redisClient.setEx(key, expiration, JSON.stringify(data));
                console.log('Data cached successfully for key:', key);
            }
            catch (error) {
                console.error('Error setting cache:', error);
            }
        });
    }
    /**
     *
     * Delete function
     * @param key -> cache key or pattern
    */
    static delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if Redis client is connected
                if (!redis_config_1.redisClient.isOpen) {
                    console.warn('Redis client is not connected, skipping cache delete');
                    return;
                }
                console.log('CacheService.delete called with key:', key);
                yield redis_config_1.redisClient.del(key);
                console.log('Cache deleted for key:', key);
            }
            catch (error) {
                console.error('Error deleting from cache:', error);
            }
        });
    }
    /**
     * clear keys of matching pattern
     * @param pattern
    */
    static clearPattern(pattern) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            try {
                // Check if Redis client is connected
                if (!redis_config_1.redisClient.isOpen) {
                    console.warn('Redis client is not connected, skipping cache clear pattern');
                    return;
                }
                console.log('CacheService.clearPattern called with pattern:', pattern);
                let count = 0;
                try {
                    for (var _d = true, _e = __asyncValues(redis_config_1.redisClient.scanIterator({ MATCH: pattern, COUNT: 100 })), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const key = _c;
                        yield redis_config_1.redisClient.del(key);
                        count++;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                console.log('Cleared', count, 'cache entries matching pattern:', pattern);
            }
            catch (error) {
                console.error('Error clearing cache pattern:', error);
            }
        });
    }
    /**
     * create a cache key in redis
    */
    static createSearchKey(params) {
        const normalisedParams = Object.assign({}, params);
        // sorting keys to get consistent hashing
        const sortedKeys = Object.keys(normalisedParams).sort();
        const keyParts = sortedKeys.map(key => {
            const value = normalisedParams[key];
            if (value == undefined || value == '' || value == null) {
                return "";
            }
            return `${key}:${value}`;
        }).filter(Boolean);
        const key = `search:${keyParts.join(':')}`;
        console.log('Created cache key:', key, 'from params:', JSON.stringify(params));
        return key;
    }
}
exports.CacheService = CacheService;
