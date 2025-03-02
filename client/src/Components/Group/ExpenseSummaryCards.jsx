import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const ExpenseSummaryCards = ({ balance, yourExpenses, totalExpenses }) => {
  let negative = balance > 0 ? "" : "-";

  return (
    <div className="flex gap-3 p-4 w-full max-w-4xl mx-auto justify-center overflow-x-auto flex-nowrap">
      <div className="w-28 sm:w-36 md:w-40 lg:w-48 rounded-lg border border-gray-200 shadow-sm p-3 sm:p-5 bg-white flex-shrink-0">
        <div className="flex flex-col justify-around">
          <span className="text-green-700 font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
            Total Expenses
          </span>
          <span className="text-gray-900 font-bold text-md sm:text-2xl">
            {totalExpenses ? `₹${totalExpenses?.toFixed(2)}` : <Skeleton />}
          </span>
        </div>
      </div>

      <div className="w-28 sm:w-36 md:w-40 lg:w-48 rounded-lg border border-gray-200 shadow-sm p-3 sm:p-5 bg-white flex-shrink-0">
        <div className="flex flex-col justify-around">
          <span className="text-green-700 font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
            Your Expenses
          </span>
          <span className="text-gray-900 font-bold text-md sm:text-2xl">
            {yourExpenses ? `₹${yourExpenses?.toFixed(2)}` : <Skeleton />}
          </span>
        </div>
      </div>

      <div className="w-28 sm:w-36 md:w-40 lg:w-48 rounded-lg border border-gray-200 shadow-sm p-3 sm:p-5 bg-white flex ">
        <div className="flex flex-col justify-around">
          <span className="text-green-700 font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
            Balance
          </span>
          <span
            className={`${
              balance > 0 ? "text-green-600" : "text-red-600"
            } font-bold text-md sm:text-2xl`}
          >
            {balance?`${negative}₹${Math.abs(balance)?.toFixed(2)}`:<Skeleton/>}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummaryCards;
