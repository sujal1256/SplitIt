import { Group } from "../models/group.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import nodemailer from "nodemailer";
import { sendEmail } from "../utils/mailer.js";

async function handleCreateGroup(req, res) {
  const { groupName, groupDescription } = req.body;
  if (!groupName) {
    return res.status(400).json(new ApiError(400, "Group name is required"));
  }

  const user = req.user;

  const group = new Group({
    groupName,
    groupOwner: user.userId,
    groupDescription,
    members: [
      {
        memberName: user.userName,
        memberEmail: user.userEmail,
        memberRole: "Admin",
      },
    ],
  });

  await group.save();

  return res
    .status(200)
    .json(new ApiResponse(200, group, "Group Created Successfully"));
}

async function handleAddMemberToGroup(req, res) {
  try {
    const { email, groupId } = req.body;

    if (!email) {
      return res.status(400).json(new ApiError(400, "Email is required"));
    }

    const user = req.user;

    const group = await Group.findOne({ _id: groupId });

    sendEmail(email, group);

    return res
      .status(200)
      .json(new ApiResponse(200, group, "Mail send successfully"));
  } catch (error) {
    console.log("❌ Error in adding the user");
  }
}

async function storeInvitedUser(req, res) {
  try {
    const { groupId, memberName, memberEmail } = req.body;
    const group = await Group.findOne({ _id: groupId });

    if (!group) {
      return res.status(500).json(new ApiError(500, "Group not found"));
    }
    group.members.push({
      memberEmail: memberEmail,
      memberName,
    });
    await group.save();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Mail sent successfully"));
  } catch (error) {
    console.log("❌ Error in storing the invited user");
  }
}
export { handleCreateGroup, handleAddMemberToGroup, storeInvitedUser };
