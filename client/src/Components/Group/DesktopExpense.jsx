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

  // Determine user relationship to the expense
  const isUserPayer = expense.memberWhoPaid?._id === logged?.user?.userId;
  const isUserIncluded = expense.membersIncluded.find(
    (e) => e.memberId === logged?.user?.userId
  );

  // Determine balance color
  const balanceColor =
    isUserIncluded && expense.membersIncluded.length === 1
      ? "text-gray-400"
      : isUserPayer && isUserIncluded
      ? "text-green-500"
      : isUserIncluded
      ? "text-red-500"
      : "text-gray-400";

  return (
    <div className="grid grid-cols-5 border-b border-gray-500 hover:bg-gray-50">
      <div className="p-4 flex items-center">{expense.expenseName}</div>
      <div className="p-4 flex items-center ">
        {expense.memberWhoPaid?.userName}
      </div>
      <div className="p-4 flex items-center">
        {new Date(expense.createdAt).getDate()}/
        {new Date(expense.createdAt).getMonth() + 1}/
        {new Date(expense.createdAt).getFullYear()}
      </div>
      {isUserIncluded && expense.membersIncluded.length > 1 ? (
        <div
          className={`font-bold text-lg p-2 rounded-lg flex items-center ${balanceColor}`}
        >
          {isUserPayer
            ? `+ ${expense.totalAmountLent?.toFixed(2)}`
            : `- ${expense.amountToBePaid?.toFixed(2)}`}
        </div>
      ) : (
        <div className="flex pl-9 justify-left items-center text-2xl text-gray-400">
          =
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
