import { boolean } from "zod";
import { redisClient } from "../config/redis.config";


// set expiration time 
const DEFAULT_EXPIRATION = 60 * 5; // 5 minites

export class CacheService{

    /**
     * T -> generic type
     * @param -> key => Cache Key
    */

    static async get<T>(key: string) : Promise<T | null >{
        try {
            // Check if Redis client is connected
            if (!redisClient.isOpen) {
                console.warn('Redis client is not connected, skipping cache get');
                return null;
            }
            
            console.log('CacheService.get called with key:', key);
            const data = await redisClient.get(key);
            if(data){
                console.log('Cache hit for key:', key);
                return JSON.parse(data) as T;
            }
            console.log('Cache miss for key:', key);
            return null;
        } catch (error) {
            console.error('Error getting from cache:', error);
            return null;
        }
    }



    /**
     * Set Data in cache
     * @param key -> cache key
     * @param data -> data to be cached
     * @param expiration -> default exp
    */

    static async set(key: string, data: any, expiration : number=  DEFAULT_EXPIRATION) : Promise<void>{
        try {
            // Check if Redis client is connected
            if (!redisClient.isOpen) {
                console.warn('Redis client is not connected, skipping cache set');
                return;
            }
            
            console.log('CacheService.set called with key:', key, 'expiration:', expiration);
            await redisClient.setEx(key,expiration,JSON.stringify(data));
            console.log('Data cached successfully for key:', key);
        } catch (error) {
            console.error('Error setting cache:', error);
        }
    }


    /**
     * 
     * Delete function
     * @param key -> cache key or pattern
    */
    
    static async delete(key: string) : Promise<void>{
        try {
            // Check if Redis client is connected
            if (!redisClient.isOpen) {
                console.warn('Redis client is not connected, skipping cache delete');
                return;
            }
            
            console.log('CacheService.delete called with key:', key);
            await redisClient.del(key);
            console.log('Cache deleted for key:', key);
        } catch (error) {
            console.error('Error deleting from cache:', error);
        }
    }


    /** 
     * clear keys of matching pattern
     * @param pattern
    */
   static async clearPattern(pattern: string): Promise<void>{
    try {
        // Check if Redis client is connected
        if (!redisClient.isOpen) {
            console.warn('Redis client is not connected, skipping cache clear pattern');
            return;
        }
        
        console.log('CacheService.clearPattern called with pattern:', pattern);
        let count = 0;
        for await( const key of redisClient.scanIterator({MATCH: pattern, COUNT: 100})){
            await redisClient.del(key);
            count++;
        }
        console.log('Cleared', count, 'cache entries matching pattern:', pattern);
    } catch (error) {
        console.error('Error clearing cache pattern:', error);
    }
   }


   /**
    * create a cache key in redis
   */
  static createSearchKey(params: Record<string,any>): string {
    
        const normalisedParams = {...params};

        // sorting keys to get consistent hashing
        const sortedKeys = Object.keys(normalisedParams).sort();

        const keyParts = sortedKeys.map(key =>{
            const value = normalisedParams[key];
            if(value == undefined || value == '' || value == null){
                return "";
            }
            return `${key}:${value}`;
        }).filter(Boolean)

        const key = `search:${keyParts.join(':')}`;
        console.log('Created cache key:', key, 'from params:', JSON.stringify(params));
        return key;
    
  }
}