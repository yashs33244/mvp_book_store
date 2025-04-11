import { createClient } from 'redis'

// create redis client
const redisClient = createClient({
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
})

// connect to redis
const connectToRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect()
            console.log('Connected to Redis')
        }
    } catch (error) {
        console.error('Error connecting to Redis', error)
        // Try to reconnect after 5 seconds
        setTimeout(connectToRedis, 5000)
    }
}

// Handle Redis errors
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err)
})

// Handle Redis reconnection
redisClient.on('reconnecting', () => {
    console.log('Redis Client reconnecting...')
})

// Handle Redis connection
redisClient.on('connect', () => {
    console.log('Redis Client connected')
})

// Initialize Redis connection
connectToRedis().catch(err => {
    console.error('Failed to initialize Redis connection:', err)
})

// following singleton pattern by exporting the redisClient and connectToRedis functions
export { redisClient, connectToRedis };





