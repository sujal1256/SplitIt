import express from "express";

import { handleCheckLoggedIn, handleGetGroups, handleLogin, handleRegister, handleLogout } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const userRouter = express.Router();

userRouter.route("/register").post(handleRegister);

userRouter.route("/login").post(handleLogin);
userRouter.route("/logout").post(verifyJWT, handleLogout);

userRouter.route("/checkLoggedIn").get(verifyJWT, handleCheckLoggedIn)
userRouter.route("/get-all-groups").get(verifyJWT, handleGetGroups);


export { userRouter };
    