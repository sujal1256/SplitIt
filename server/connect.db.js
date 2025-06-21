import mongoose from "mongoose";
import { createClient } from "redis";

function connectToMongoDB() {
  mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("✅ MongoDb connected successfully");
  }).catch(error => {
    console.log("❌ Error in connecting to Database");
    
  })
}

async function connectToRedis(){
  const redis_client = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();
  await redis_client.set("status", "connected");
  const value = await redis_client.get("status");
  if(value){
    console.log(`✅ Redis message: ${value}`)
  }
  else{
    console.log(`❌ Error in connecting to Redis`);
  }

}

export { connectToMongoDB, connectToRedis };
