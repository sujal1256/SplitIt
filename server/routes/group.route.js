import express from "express";
import {
  handleAddMemberToGroup,
  handleCreateGroup,
} from "../controllers/group.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const groupRouter = express.Router();
groupRouter.route("")
groupRouter.route("/create-group").post(verifyJWT, handleCreateGroup);
groupRouter.route("/add-member-to-group").post(verifyJWT, handleAddMemberToGroup);

export { groupRouter };
