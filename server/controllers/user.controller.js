import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

async function handleRegister(req, res) {
  try {
    const { userName, userEmail, password } = req.body;

    // Check if values are valid or not
    if ([userEmail, userName, password].some((e) => e.trim() == null)) {
      return res.status(400).json(new ApiError(400, "❌ Values not provided"));
    }

    // Check if the email already exists
    const user = await User.findOne({ userEmail });
    if (user) {
      return res.status(400).json(new ApiError(400, "❌ Duplicate Email"));
    }

    // Creating a new user
    const newUser = new User({ userName, userEmail, password });
    await newUser.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, { data: newUser }, "User created successfully")
      );
  } catch (error) {
    console.log("Error in registering the user", error);
    return res.status(400).json(new ApiError(400, "❌ Error in registering"));
  }
}



async function handleLogin(req, res) {
  try {
    const { userEmail, password } = req.body;
    if (!userEmail || !password) {
      return res
        .status(400)
        .json(
          new ApiError(400, "❌ Fields not provided properly while logging in")
        );
    }

    const user = await User.findOne({userEmail});
    if(!user){
      return res.status(400).json(new ApiError(400, "❌ User not found"));

    }
    
    if (!(await user.isPasswordCorrect(password))) {
      return res.status(400).json(new ApiError(400, "❌ Incorrect Password"));
    }

    const token = await user.generateAccessToken();
    res.cookie("accessToken", token);
    
    res.setHeader("Authorization", "Bearer " + token);

    return res.status(200).json(new ApiResponse(200, user, "User Logged In"));  
  } catch (error) {
    console.log("Error while logging in", error);
    return res.status(400).json(new ApiError(400, "❌ Error in logging in"));
  }
}

export { handleRegister, handleLogin };
