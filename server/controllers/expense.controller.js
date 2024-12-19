import { Expense } from "../models/expense.model.js";
import { Group } from "../models/group.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

async function handleAddExpense(req, res) {
  const { groupId, memberWhoPaid, membersIncluded, amountPaid, expenseName } =
    req.body;

  console.log(req.body);
  
    

  if (
    !groupId ||
    !memberWhoPaid ||
    !membersIncluded ||
    !amountPaid ||
    !expenseName
  ) {
    return res.status(500).json(new ApiError(500, "Input not provided"));
  }
  const group = await Group.findOne({ _id: groupId });

  membersIncluded.map((member) => {
    if (!group.members.find((m) => m.memberId == member.memberId)) {
      return res
        .status(500)
        .json(new ApiError(500, "Member not found in the group"));
    }
  });

  const expense = new Expense({
    expenseName,
    memberWhoPaid,
    membersIncluded,
    amountPaid,
    expenseGroup: groupId,
  });

  await expense.save();

  return res
    .status(201)
    .json(new ApiResponse(201, expense, "Expense created successfully"));
}

async function handleGetAllExpenses(req, res) {
  const { groupId } = req.query;
  const userId = req.user.userId;

  if (!groupId) {
    return res.status(500).json(new ApiError(500, "Group Id not provided"));
  }
  if (!userId) {
    return res.status(500).json(new ApiError(500, "User Id not provided"));
  }

  const expenses = await Expense.find({ expenseGroup: groupId });

  // const formattedExpenses = expenses.map((e) => {
  //   const n = membersIncluded.length();
  //   if (e.memberWhoPaid == userId) {
  //     return {
  //       expenseName: e.expenseName,
  //       amountPaid: e.amountPaid,
  //       amountLentTo: membersIncluded.map((m) => {
  //         return { ...m, amountLent: e.amountPaid / n };
  //       }),
  //       totalAmountLent: e.amountPaid - e.amountPaid / n,
  //       memberWhoPaid: e.memberWhoPaid,
  //     };
  //   } else {
  //     return {
  //       expenseName: e.expenseName,
  //       amountPaid: e.amountPaid,
  //       amountOwedFrom: membersIncluded.map((m) => {
  //         if (m.memberId != e.memberWhoPaid) {
  //           return { ...m, amountBorrowed: e.amountPaid / n };
  //         }
  //       }),
  //       totalAmountLent: e.amountPaid - e.amountPaid / n,
  //       memberWhoPaid: e.memberWhoPaid,
  //     };
  //   }
  // });

  return res
    .status(200)
    .json(new ApiResponse(200, expenses, "Expenses fetched successfully"));
}

export { handleAddExpense, handleGetAllExpenses };
