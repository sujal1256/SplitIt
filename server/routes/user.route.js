import express from "express";

import { handleLogin, handleRegister } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const userRouter = express.Router();

userRouter.route("/register").post(handleRegister);

userRouter.route("/login").post(handleLogin);
userRouter.route("/checkHeader").get(verifyJWT, (req, res) => {
    return res.send("Hello");
});

export { userRouter };
