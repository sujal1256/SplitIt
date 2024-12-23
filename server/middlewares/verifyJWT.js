import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

async function verifyJWT(req, res, next) {
  try {
    const token = req.cookies["accessToken"];
    const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedUser) {
      return res.status(401).json(new ApiError(401, "Token expired"));
    }
    req.user = decodedUser;
    next();
  } catch (error) {
    console.log("Error while verifying the token");
    return res
      .status(401)
      .json(new ApiError(401, "Error while verifying the token"));
  }
}

export { verifyJWT };
