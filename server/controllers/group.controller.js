import { Group } from "../models/group.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
    // const {email} = req.body;

    // if(!email){
    //     return res.status(400).json(new ApiError(400, "Group name is required"));
    // }

}

export { handleCreateGroup, handleAddMemberToGroup};
