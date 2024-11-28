import express from "express";
import { handleCreateGroup } from "../controllers/group.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const groupRouter = express.Router();

groupRouter.route("/create-group").post(verifyJWT, handleCreateGroup);

export { groupRouter };
