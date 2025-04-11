import { NextFunction, Request, Response } from "express";
import { CacheService } from "../services/cache.service";

/**
 * Middleware to cache api responses
 * @param duration -> cache TTL
*/

export const cacheMiddleware = (duration: number = 300) =>{
    return async (req: Request, res: Response, next: NextFunction) => {
        
        // skip caching for non-GET methods
        if(req.method !== "GET"){
            console.log('Cache middleware: Skipping cache for non-GET method:', req.method);
            return next();
        }

        // create a cache key from URL and query parameter
        const cacheKey = CacheService.createSearchKey({
            url:req.originalUrl,
            ...req.query
        });

        console.log('Cache middleware: Checking cache for key:', cacheKey);

        try {
            // try to get cache response
            const cachedData = await CacheService.get(cacheKey);
            if(cachedData){
                console.log('Cache middleware: Cache hit for key:', cacheKey);
                return res.json(cachedData);
            }

            console.log('Cache middleware: Cache miss for key:', cacheKey);

            // store the original JSON method
            const originalSend = res.json;
            
            // overide res.json method to cache the response before sending
            res.json = function(body: any){
                // restore the original method
                res.json = originalSend;

                // cache the response 
                CacheService.set(cacheKey, body, duration).catch(error => {
                    console.error('Error caching response:', error);
                });
                
                // call original method
                return originalSend.call(this, body);
            }
            next();

        } catch (error) {
            console.error('Cache middleware error:', error);
            // Continue without caching if there's an error
            next();
        }
    }
}

/**
 * clear cache for a specific route
 * @param pattern -> cache key for pattern to clear
*/
export const clearCache = (pattern: string)=>{
    return async(_req: Request, _res: Response, next:NextFunction) =>{
        try {
            console.log('Clear cache middleware: Clearing cache for pattern:', pattern);
            await CacheService.clearPattern(pattern);
            console.log('Clear cache middleware: Cache cleared for pattern:', pattern);
            next();
        } catch (error) {
            console.error('Error clearing cache:', error);
            // Continue without clearing cache if there's an error
            next();
        }
    }
}