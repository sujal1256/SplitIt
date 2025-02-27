import React from "react";
import { FaTrash } from "react-icons/fa";

function DesktopExpense({ expense, logged, getExpenses }) {
  const handleDelete = async (expenseId) => {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/v1/expense/delete-expense",
      {
        method: "DELETE",
        body: JSON.stringify({
          expenseId,
        }),
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
      }
    );

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      getExpenses();
    } else {
      toast.error("Error while deleting expense", {
        className: "toast-mobile",
      });
    }
  };

  const isUserPayer = expense.memberWhoPaid?._id === logged?.user?.userId;
  const isUserIncluded = expense.membersIncluded.find(
    (e) => e.memberId === logged?.user?.userId
  );

  const balanceColor = isUserPayer ? "text-green-500" : "text-red-400";

  if (!isUserIncluded && !isUserPayer) {
    return null;
  }

  return (
    <div className="grid grid-cols-6 border-b border-gray-500 hover:bg-gray-50">
      <div className="p-4 flex items-center">{expense.expenseName}</div>
      <div className="p-4 flex items-center ">
        {expense.memberWhoPaid?.userName}
      </div>
      <div className="p-4 flex items-center">
        {new Date(expense.createdAt).getDate()}/
        {new Date(expense.createdAt).getMonth() + 1}/
        {new Date(expense.createdAt).getFullYear()}
      </div>
      {expense.membersIncluded.length > 1 && (
        <div
          className={`font-bold text-lg p-2 rounded-lg flex items-center ${balanceColor}`}
        >
          {isUserPayer
            ? `+ ${expense.totalAmountLent?.toFixed(2)}`
            : `- ${expense.amountToBePaid?.toFixed(2)}`}
        </div>
      )}

      <div className="flex items-center pl-5">{expense.amountPaid}</div>
      <div className="flex items-center">
        <button
          onClick={() => handleDelete(expense._id)}
          className="text-red-500"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

export default DesktopExpense;
