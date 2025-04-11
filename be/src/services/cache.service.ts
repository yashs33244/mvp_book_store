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
            const data = await redisClient.get(key);
            if(data){
                return JSON.parse(data) as T;
            }
            return null;
        } catch (error) {
            console.log(error);
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
            await redisClient.setEx(key,expiration,JSON.stringify(data));
        } catch (error) {
            console.log(error);
        }
    }


    /**
     * 
     * Delete function
     * @param key -> cache key or pattern
    */
    
    static async delete(key: string) : Promise<void>{
        try {
            await redisClient.del(key);
        } catch (error) {
            console.log(error);
        }
    }


    /** 
     * clear keys of matching pattern
     * @param pattern
    */
   static async clearPattern(pattern: string): Promise<void>{
    try {
        for await( const key of redisClient.scanIterator({MATCH: pattern, COUNT: 100})){
            await redisClient.del(key);
        }
    } catch (error) {
        console.log(error);
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

        return `search:${keyParts.join(':')}`;
    
  }
}