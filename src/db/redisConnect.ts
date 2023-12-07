import * as redis from "redis";
export const redisClient = redis.createClient();
redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.connect().then(()=>{
    console.log("Connected to Redis")
});
