import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
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

const expenseSchema = new mongoose.Schema(
  {
    expenseName: {
      type: String,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    membersIncluded: {
      // including the one who paid
      type: [memberSchema],
      required: true,
    },
    memberWhoPaid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    expenseGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

export { Expense };
