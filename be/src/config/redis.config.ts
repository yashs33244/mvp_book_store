import {createClient } from 'redis'

// create redis client
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
})


// connect to redis
const connectToRedis = async () => {
    try {
        await redisClient.connect()
        console.log('Connected to Redis')
    } catch (error) {
        console.error('Error connecting to Redis', error)
        setTimeout(connectToRedis, 5000)
    }
}


// handle redis connection errors
redisClient.on('error', (err) => {
    console.error('Redis error', err)
})
// following singleton pattern by exporting the redisClient and connectToRedis functions

export { redisClient,connectToRedis };





