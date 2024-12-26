import React from "react";

function TotalExpenses({
  memberTransactions,
  totalTransaction,
  selectedCurrency,
}) {
  return (
      <div className="border-2 border-text-colour p-3 rounded-lg text-white bg-primary w-full md:w-[30%] lg:w-[25%] m-3">
        <h2 className="text-center text-xl font-semibold">Total Expenses</h2>
        <p className="text-center text-lg mt-0">
          {selectedCurrency} {totalTransaction.toFixed(2)}
        </p>
        <hr />
        <div>
          {memberTransactions?.map((transaction) => (
            <div
              key={transaction.memberName}
              className="flex gap-4 items-center justify-center mt-1 text-lg font-semibold"
            >
              <p>{transaction.memberName}</p>
              <p>{transaction.transaction.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
  );
}

export default TotalExpenses;
