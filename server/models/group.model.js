import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  memberName: {
    type: String,
    required: true,
  },
  memberEmail: {
    type: String,
    required: true,
  },
  memberRole: {
    type: String,
    enum: ["User", "Admin"],
    default: "User",
  },
});

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  groupOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: {
    type: [memberSchema],
    required: true,
  },
  groupDesciption: {
    type: String,
  },
});

const Group = mongoose.model("Group", groupSchema);

export { Group };
