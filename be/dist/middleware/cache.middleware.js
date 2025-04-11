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
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCache = exports.cacheMiddleware = void 0;
const cache_service_1 = require("../services/cache.service");
/**
 * Middleware to cache api responses
 * @param duration -> cache TTL
*/
const cacheMiddleware = (duration = 300) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // skip caching for non-GET methods
        if (req.method !== "GET") {
            console.log('Cache middleware: Skipping cache for non-GET method:', req.method);
            return next();
        }
        // create a cache key from URL and query parameter
        const cacheKey = cache_service_1.CacheService.createSearchKey(Object.assign({ url: req.originalUrl }, req.query));
        console.log('Cache middleware: Checking cache for key:', cacheKey);
        try {
            // try to get cache response
            const cachedData = yield cache_service_1.CacheService.get(cacheKey);
            if (cachedData) {
                console.log('Cache middleware: Cache hit for key:', cacheKey);
                return res.json(cachedData);
            }
            console.log('Cache middleware: Cache miss for key:', cacheKey);
            // store the original JSON method
            const originalSend = res.json;
            // overide res.json method to cache the response before sending
            res.json = function (body) {
                // restore the original method
                res.json = originalSend;
                // cache the response 
                cache_service_1.CacheService.set(cacheKey, body, duration).catch(error => {
                    console.error('Error caching response:', error);
                });
                // call original method
                return originalSend.call(this, body);
            };
            next();
        }
        catch (error) {
            console.error('Cache middleware error:', error);
            // Continue without caching if there's an error
            next();
        }
    });
};
exports.cacheMiddleware = cacheMiddleware;
/**
 * clear cache for a specific route
 * @param pattern -> cache key for pattern to clear
*/
const clearCache = (pattern) => {
    return (_req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('Clear cache middleware: Clearing cache for pattern:', pattern);
            yield cache_service_1.CacheService.clearPattern(pattern);
            console.log('Clear cache middleware: Cache cleared for pattern:', pattern);
            next();
        }
        catch (error) {
            console.error('Error clearing cache:', error);
            // Continue without clearing cache if there's an error
            next();
        }
    });
};
exports.clearCache = clearCache;
