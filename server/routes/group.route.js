import express from "express";
import {
  handleAddMemberToGroup,
  handleCreateGroup,
  handleGetGroup,
  handleDelete,
  storeInvitedUser
} from "../controllers/group.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const groupRouter = express.Router();
groupRouter.route("/create-group").post(verifyJWT, handleCreateGroup);
groupRouter.route("/add-member-to-group").post(verifyJWT, handleAddMemberToGroup);
groupRouter.route("/get-group-details").get(verifyJWT, handleGetGroup);
groupRouter.route("/store-invited-user").post(storeInvitedUser);
groupRouter.route("/delete-group").delete(verifyJWT, handleDelete);

export { groupRouter };
