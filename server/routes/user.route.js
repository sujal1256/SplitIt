import express from "express";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const userRouter = express.Router();

userRouter.route("/register").post(async (req, res) => {
  const { userName, userEmail, password } = req.body;

  // Check if values are valid or not
  if ([userEmail, userName, password].some((e) => e.trim() == null)) {
    return res.status(400).json(new ApiError(400, "Values not provided"));
  }

  // Check if the email already exists
  const user = await User.findOne({ userEmail });
  if (user) {
    return res.status(400).json(new ApiError(400, "Duplicate Email"));
  }

  // Creating a new user
  const newUser = new User({ userName, userEmail, password });
  await newUser.save();

  return res
    .status(201)
    .json(new ApiResponse(201, { data: newUser }, "User created successfully"));
});

export { userRouter };
