import express from "express";

import { handleLogin, handleRegister } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.route("/register").post(handleRegister);
userRouter.route("/login").post(handleLogin);

export { userRouter };
