import express from "express";

import { handleCheckLoggedIn, handleLogin, handleRegister } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const userRouter = express.Router();

userRouter.route("/register").post(handleRegister);

userRouter.route("/login").post(handleLogin);
userRouter.route("/checkLoggedIn").get(verifyJWT, handleCheckLoggedIn)

export { userRouter };
