import React from "react";

function TotalExpenses({
  memberTransactions,
  totalTransaction,
  selectedCurrency,
}) {
  return (
    <div className="border-2 border-text-colour p-3 rounded-lg text-white bg-primary w-[calc(30%-30px)]">
      <h2 className="text-center text-xl font-semibold">Total Expenses</h2>
      <p className="text-center text-lg mt-3">
        {selectedCurrency} {totalTransaction.toFixed(2)}
      </p>
      <div>
        {memberTransactions?.map((transaction) => {
          return (
            <div className="flex gap-4">
              <p>{transaction.memberName}</p>
              <p>{transaction.transaction.toFixed(2)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TotalExpenses;
