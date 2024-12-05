import express from "express";
import {
  handleAddMemberToGroup,
  handleCreateGroup,
  handleGetAllMembers,
} from "../controllers/group.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const groupRouter = express.Router();
groupRouter.route("/create-group").post(verifyJWT, handleCreateGroup);
groupRouter.route("/add-member-to-group").post(verifyJWT, handleAddMemberToGroup);
groupRouter.route("/get-all-members").get(verifyJWT, handleGetAllMembers);

export { groupRouter };
