import mongoose from "mongoose";

function connectToMongoDB() {
  mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("✅ MongoDb connected successfully");
  }).catch(error => {
    console.log("✅ Error in connecting to Database");
    
  })
}

export { connectToMongoDB };
