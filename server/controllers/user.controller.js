import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

async function handleRegister(req, res) {
  try {
    console.log(req.body);
    const { userName, userEmail, password, phoneNumber } = req.body;

    // Check if values are valid or not
    if (
      !phoneNumber ||
      [userEmail, userName, password].some((e) => e.trim() == null)
    ) {
      return res.status(400).json(new ApiError(400, "Values not provided"));
    }

    // Check if the email already exists
    const user = await User.findOne({ userEmail });
    if (user) {
      return res.status(400).json(new ApiError(400, "User already registered"));
    }

    // Creating a new user
    const newUser = new User({ userName, userEmail, password, phoneNumber });
    await newUser.save();

    console.log("User created successfully");

    return res
      .status(201)
      .json(
        new ApiResponse(201, { data: newUser }, "User created successfully")
      );
  } catch (error) {
    console.log("❌Error in registering the user", error);
    return res.status(400).json(new ApiError(400, "Error in registering"));
  }
}

async function handleLogin(req, res) {
  try {
    const { userEmail, password } = req.body;
    if (!userEmail || !password) {
      return res
        .status(400)
        .json(
          new ApiError(400, "Fields not provided properly while logging in")
        );
    }

    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(400).json(new ApiError(400, "User not found"));
    }

    if (!(await user.isPasswordCorrect(password))) {
      return res.status(400).json(new ApiError(400, "Incorrect Password"));
    }

    const token = await user.generateAccessToken();
    res.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: "None",
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, { user, accessToken: token }, "User Logged In")
      );
  } catch (error) {
    console.log("Error while logging in", error);
    return res.status(400).json(new ApiError(400, "❌ Error in logging in"));
  }
}

async function handleLogout(req, res) {
  res.clearCookie("accessToken");
  return res.status(200).json(new ApiResponse(200, {}, "Logged out"));
}
async function handleGetGroups(req, res) {
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json(new ApiError(400, "User not found"));
  }

  const groups = await Group.find({
    "members.memberId": userId,
  });

  res
    .status(200)
    .json(new ApiResponse(200, groups, "Group fetched successfully"));
}

async function handleCheckLoggedIn(req, res) {
  if (req.user == null) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User is not logged In"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User is logged In"));
}

export {
  handleRegister,
  handleLogin,
  handleCheckLoggedIn,
  handleGetGroups,
  handleLogout,
};
