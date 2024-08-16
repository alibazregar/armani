import * as redis from "redis";
export const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
} as redis.RedisClientOptions);
redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("error", (err) => console.log(err))
redisClient.connect().then(() => {
  console.log("Connected to Redis");
});
