import mongoose from "mongoose";
import { createClient } from "redis";

function connectToMongoDB() {
  mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("✅ MongoDb connected successfully");
  }).catch(error => {
    console.log("❌ Error in connecting to Database");
    
  })
}

const redisClient = createClient();

redisClient.on("error", (err) => console.log("Redis Client Error", err));

async function connectToRedis() {
  await redisClient.connect();
  await redisClient.set("status", "connected");
  const value = await redisClient.get("status");
  if (value) {
    console.log(`✅ Redis message: ${value}`);
  } else {
    console.log(`❌ Error in connecting to Redis`);
  }
}

export { connectToMongoDB, connectToRedis, redisClient };
