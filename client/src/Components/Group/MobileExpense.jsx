import React from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

function MobileExpense({ expense, logged, getExpenses, onSelectExpense }) {
  const handleDelete = async (e, expenseId) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    
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
    <div 
      className="p-3 border-b border-gray-700 hover:bg-[#121724] cursor-pointer transition-colors"
      onClick={() => onSelectExpense(expense)}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium">{expense.expenseName}</div>
        <div className={`font-bold ${balanceColor}`}>
          {isUserPayer
            ? `+ ${expense.totalAmountLent?.toFixed(2)}`
            : `- ${expense.amountToBePaid?.toFixed(2)}`}
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-400">
        <div>Paid by {expense.memberWhoPaid?.userName}</div>
        <div className="flex items-center gap-4">
          <span>
            {new Date(expense.createdAt).getDate()}/
            {new Date(expense.createdAt).getMonth() + 1}/
            {new Date(expense.createdAt).getFullYear()}
          </span>
          <button
            onClick={(e) => handleDelete(e, expense._id)}
            className="text-red-500 p-1"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileExpense;