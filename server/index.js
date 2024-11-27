import express, { json, urlencoded } from "express";
import dotenv from "dotenv";
import { userRouter } from "./routes/user.route.js";
import { connectToMongoDB } from "./connect.db.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT;

app.use(urlencoded({ extended: false }));
app.use(cookieParser());
connectToMongoDB();

app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log(`✅ The server is listening to port ${PORT}`);
});
