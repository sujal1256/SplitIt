import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendInviteEmail } from "../utils/mailer.js";

async function handleCreateGroup(req, res) {
  const { groupName, groupDescription, members } = req.body;
  console.log(req.body);
  
  if (!groupName) {
    return res.status(400).json(new ApiError(400, "Group name is required"));
  }

  if (!members) {
    return res.status(400).json(new ApiError(400, "members are not sent"));
  }

  console.log(members);
  

  const user = req.user;

  const group = new Group({
    groupName,
    groupOwner: user.userId,
    groupDescription,
    members: [
      {
        memberId: user.userId,
        memberName: user.userName,
        memberEmail: user.userEmail,
        memberRole: "Admin",
      },
    ],
  });

  await group.save();

  members.map((member) => {
    sendInviteEmail(member, group);
  });

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

    const group = await Group.findOne({ _id: groupId });

    sendInviteEmail(email, group);

    return res
      .status(200)
      .json(new ApiResponse(200, group, "Mail send successfully"));
  } catch (error) {
    console.log("❌ Error in adding the user");
  }
}
async function storeInvitedUser(req, res) {
  try {
    const { q: groupId, name: memberName, email: memberEmail } = req.query;
    console.log(groupId, memberEmail, memberName);
    
    if ((!groupId || !memberName, !memberEmail)) {
      return res.status(500).json(new ApiError(500, "Data not sent properly"));
    }
    const group = await Group.findOne({ _id: groupId });

    if (!group) {
      return res.status(500).json(new ApiError(500, "Group not found"));
    }
    let user = await User.findOne({ userEmail: memberEmail });
    if (!user) {
      user = new User({
        userName: memberName,
        userEmail: memberEmail,
        password: 123,
      });

      await user.save();
    }

    const member = group.members.find((m) => m.memberEmail == user.userEmail);

    if (member) {
      return res.status(200).redirect("http://localhost:5173");
    }

    group.members.push({
      memberEmail,
      memberName,
      memberId: user._id,
    });

    await group.save();

    return res.status(200).redirect("http://localhost:5173");
  } catch (error) {
    console.log(error);

    console.log("❌ Error in storing the invited user");
  }
}
export { handleCreateGroup, handleAddMemberToGroup, storeInvitedUser };
