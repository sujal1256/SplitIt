import React from "react";

function MobileExpense({ expense, logged, getExpenses }) {
  // Extract date information
  const expenseDate = new Date(expense.createdAt);
  const month = expenseDate.toLocaleString("default", { month: "short" });
  const day = expenseDate.getDate();

  // Determine user relationship to the expense
  const isUserPayer = expense.memberWhoPaid?._id === logged?.user?.userId;
  const isUserIncluded = expense.membersIncluded.find(
    (e) => e.memberId === logged?.user?.userId
  );

  // Determine balance color
  const balanceColor =
    isUserPayer ? "text-green-500" : "text-red-400";

  if (!isUserIncluded && !isUserPayer) {
    return null; // Skip rendering if the user is not involved.
  }

  return (
    <div className="flex justify-between border-b border-gray-800 py-3 px-4">
      <div className="flex gap-2">
        <div className="flex flex-col items-center mr-3">
          <div className="text-sm">{month}</div>
          <div className="text-sm">{day}</div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-700 rounded-md flex items-center justify-center">
              <span className="text-xs">📝</span>
            </div>
            <span className="font-medium">{expense.expenseName}</span>
          </div>

          <div className="text-sm text-gray-400 mt-1">
            {isUserPayer ? "You" : expense.memberWhoPaid.userName} paid{" "}
            {expense.amountPaid}
          </div>
        </div>
      </div>

      {expense.membersIncluded.length > 1 && (
        <div className={`flex flex-col items-end ${balanceColor}`}>
          <span className="text-sm">
            {isUserPayer ? "You Lent" : "You Owe"}
          </span>
          <span className="text-lg font-bold">
            ₹{isUserPayer ? expense.totalAmountLent?.toFixed(2) : expense.amountToBePaid?.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}

export default MobileExpense;