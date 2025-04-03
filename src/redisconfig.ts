import Redis from "ioredis";
const dotenv = require('dotenv');

dotenv.config({ path: '../scripts.env' });

export const redisClient = new Redis({
  host: process.env.REDIS_URL,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASS,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis');
});
  
export const TestRedisConnection = async () => {
  try {
    console.log("Testing Redis connection...");

    // Set a test value
    const setResult = await redisClient.set("url-shortner", "true");
    console.assert(setResult === "OK", "Failed to set value in Redis");

    // Get the test value
    const getResult = await redisClient.get("url-shortner");
    console.assert(getResult === "true", "Failed to get value from Redis");
    console.log("✅ Redis connection successful!");

    // Close the connection
    redisClient.disconnect();
  } catch (error) {
    console.error("❌ Redis connection failed:", error);
  }
}
