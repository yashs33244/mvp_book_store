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
            return next();
        }

        // create a cache key from URL and query parameter
        const cacheKey = CacheService.createSearchKey({
            url:req.originalUrl,
            ...req.query
        });

        try {
            // try to get cache respone
            const cachedData = await CacheService.get(cacheKey);
            if(cacheKey){
                return res.json(cachedData);
            }

            // store the original JSON method
            const originalSend = res.json;
            
            // overide res.json method to cache the response before sending
            res.json = function(body: any){
                // restore the original method
                res.json = originalSend;

                // cache the response 
                CacheService.set(cacheKey, body, duration);
                
                // call orignal method
                return originalSend.call(this, body);
            }
            next();

        } catch (error) {
            console.log(error);        
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
            await CacheService.clearPattern(pattern);
            next();
        } catch (error) {
            console.log(error);
            next();
        }
    }
    }