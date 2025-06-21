import express, { json, urlencoded } from "express";
import dotenv from "dotenv";
import { userRouter } from "./routes/user.route.js";
import { groupRouter } from "./routes/group.route.js";
import { expenseRouter } from "./routes/expense.route.js";
import { connectToMongoDB, connectToRedis } from "./connect.db.js";
import cookieParser from "cookie-parser";
// import { storeInvitedUser } from "./controllers/group.controller.js";
import { mailRouter } from "./routes/mails.route.js";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT;



app.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Content-type", "application/json");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Handle preflight requests
  }
  next();
});


app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cookieParser());

// Serve static files from the 'public' directory
app.use(express.static("./public"));

connectToMongoDB();
connectToRedis();

// app.get("/invite", storeInvitedUser);
app.get("/",(req, res)=>res.send("Deployed"));
app.get("/check", (req, res) =>
  res.send(process.env.BACKEND_URL + "\n" + process.env.FRONTEND_URL)
);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/group", groupRouter);
app.use("/api/v1/expense", expenseRouter);
app.use("/api/v1/mail", mailRouter);

app.listen(PORT, () => {
  console.log(`✅ The server is listening to port ${PORT}`);
});
