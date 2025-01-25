import React from "react";
import { FaTrash } from "react-icons/fa";

function Expense({ expense, logged }) {
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
      toast.success("Expense deleted", {
        className: "toast-mobile",
      });
      getExpenses();
    } else {
      toast.error("Error while deleting expense", {
        className: "toast-mobile",
      });
    }
  };
  
  return (
    <div className="border-b border-gray-300 p-1 flex items-center">
      <div className="flex-1">
        <p className="font-semibold">{expense.expenseName}</p>
        {/* FIXME: <p className="text-sm text-gray-200">{expense.date}</p> */}
      </div>
      <p
        className={`text-right font-bold text-lg bg-background-color p-1 border-2 border-text-colour rounded-lg ${
          expense.memberWhoPaid == logged?.user?.userId
            ? "text-green-500"
            : "text-red-500"
        }`}
      >
        {expense.memberWhoPaid == logged?.user?.userId
          ? `+ ${expense.totalAmountLent.toFixed(2)}`
          : `- ${expense.amountToBePaid.toFixed(2)}`}
      </p>
      <button
        onClick={() => handleDelete(expense._id)}
        className="border-2 border-text-colour p-1 ml-2 rounded-lg text-sm text-text-colour bg-secondary"
      >
        <FaTrash />
      </button>
    </div>
  );
}

export default Expense;
