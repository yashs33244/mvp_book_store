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
exports.connectToRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
// create redis client
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.error('Redis connection failed after 10 retries');
                return new Error('Redis connection failed');
            }
            return Math.min(retries * 100, 3000);
        }
    }
});
exports.redisClient = redisClient;
// connect to redis
const connectToRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!redisClient.isOpen) {
            yield redisClient.connect();
            console.log('Connected to Redis');
        }
    }
    catch (error) {
        console.error('Error connecting to Redis', error);
        // Try to reconnect after 5 seconds
        setTimeout(connectToRedis, 5000);
    }
});
exports.connectToRedis = connectToRedis;
// Handle Redis errors
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});
// Handle Redis reconnection
redisClient.on('reconnecting', () => {
    console.log('Redis Client reconnecting...');
});
// Handle Redis connection
redisClient.on('connect', () => {
    console.log('Redis Client connected');
});
// Initialize Redis connection
connectToRedis().catch(err => {
    console.error('Failed to initialize Redis connection:', err);
});
