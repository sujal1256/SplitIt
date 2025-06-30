import { redisClient } from "../connect.db.js";
import { Expense } from "../models/expense.model.js";
import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

async function handleAddExpense(req, res) {
  const { groupId, memberWhoPaid, membersIncluded, amountPaid, expenseName } =
    req.body;

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
  // logged in user
  const userId = req.user.userId;
  if (!groupId) {
    return res.status(500).json(new ApiError(500, "Group Id not provided"));
  }
  if (!userId) {
    return res.status(500).json(new ApiError(500, "User Id not provided"));
  }
  try {
    const cachedExpenses = await redisClient.get(`expenses:${groupId}:${userId}`)
    if (cachedExpenses){
      return res.status(200).json(
        new ApiResponse(
          200,
          JSON.parse(cachedExpenses),
          "Expenses fetched successfully from cache"
        )
      )
    }
    const group = await Group.findOne({ _id: groupId });
    const expenses = await Expense.find({ expenseGroup: groupId });
    let totalExpenses = 0;
    let yourExpenses = 0;
    const formattedExpenses = await Promise.all(
      expenses.map(async (e) => {
        const n = e.membersIncluded.length;
        totalExpenses += e.amountPaid;
        if (e.membersIncluded.find((m) => m.memberId == userId)) {
          yourExpenses += e.amountPaid / n;
        }
        let isUserIncluded = e.membersIncluded.find((m) => m.memberId == userId);

        if (e.memberWhoPaid == userId) {
          return {
            _id: e._id,
            expenseName: e.expenseName,
            amountPaid: e.amountPaid,
            amountLent: e.amountPaid / n,
            amountLentTo: e.membersIncluded.map((m) => {
              return {
                memberEmail: m.memberEmail,
                memberId: m.memberId,
                memberName: m.memberName,
                memberRole: m.memberRole,
              };
            }),
            membersIncluded: e.membersIncluded,
            totalAmountLent:
              e.amountPaid - (isUserIncluded ? e.amountPaid / n : 0),
            memberWhoPaid: await User.findOne({ _id: e.memberWhoPaid }),
            createdAt: e.createdAt,
            updatedAt: e.updatedAt,
          };
        } else {
          return {
            _id: e._id,
            expenseName: e.expenseName,
            amountPaid: e.amountPaid,
            amountOwedFrom: e.membersIncluded.map((m) => {
              if (m.memberId != e.memberWhoPaid) {
                return {
                  memberEmail: m.memberEmail,
                  memberId: m.memberId,
                  memberName: m.memberName,
                  memberRole: m.memberRole,
                };
              }
            }),
            membersIncluded: e.membersIncluded,
            amountToBePaid: e.amountPaid / n,
            memberWhoPaid: await User.findOne({ _id: e.memberWhoPaid }),
            createdAt: e.createdAt,
            updatedAt: e.updatedAt,
          };
        }
      })
    );

    let balance = 0;
    formattedExpenses.forEach((e) => {
      if (e.memberWhoPaid._id == userId) {
        balance += e.totalAmountLent;
      } else {
        if (e.amountOwedFrom.find((m) => m.memberId == userId)) {
          balance -= e.amountToBePaid;
        }
      }
    });

    const totalTransaction = formattedExpenses.reduce((acc, e) => {
      if (e.memberWhoPaid._id == userId) {
        return acc + e.totalAmountLent;
      } else {
        return acc - e.amountToBePaid;
      }
    }, 0);

    const memberTransaction = group?.members
      .filter((e) => e.memberId.toString() !== userId.toString())
      .map((m) => {
        let transaction = 0;

        formattedExpenses.forEach((t) => {
          const isUserPaid = t.memberWhoPaid.equals(userId);
          const isMemberPaid = t.memberWhoPaid.equals(m.memberId);

          if (isUserPaid) {
            const isAmountLent = t?.amountLentTo?.find(
              (member) => member.memberId.toString() === m.memberId.toString()
            );
            if (isAmountLent) {
              transaction += t.amountLent;
            }
          } else if (isMemberPaid) {
            const isAmountOwed = t?.amountOwedFrom?.find(
              (member) => member.memberId.toString() === m.memberId.toString()
            );

            if (isAmountOwed) {
              transaction -= t.amountToBePaid;
            }
          }
        });

        return {
          memberName: m.memberName,
          memberId: m.memberId,
          transaction,
        };
      });
    const obj = {
      totalTransaction,
      formattedExpenses,
      memberTransaction,
      totalExpenses,
      yourExpenses,
      balance,
    }
    await redisClient.set(`expenses:${groupId}:${userId}`, 
      JSON.stringify(obj), "EX", 3600)
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalTransaction,
          formattedExpenses,
          memberTransaction,
          totalExpenses,
          yourExpenses,
          balance,
        },
        "Expenses fetched successfully"
      )
    );
  }
  catch (error) {
    return res.status(400).json(new ApiError(400, `❌ Error while fetching expenses ${error.message}`))
  }
}

async function handleDeleteExpense(req, res) {
  const { expenseId } = req.body;
  if (!expenseId) {
    return res
      .status(400)
      .json(new ApiError(400, "Expense Id is not sent correctly"));
  }

  const expense = await Expense.deleteOne({ _id: expenseId });

  return res.status(200).json(new ApiResponse(200, expense, "Expense deleted"));
}

export { handleAddExpense, handleGetAllExpenses, handleDeleteExpense };
