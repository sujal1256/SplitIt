import React, { useState } from "react";

function NewGroup() {
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [conversionRate, setConversionRate] = useState(1); // Default to INR to INR (no conversion)
  const [showConverter, setShowConverter] = useState(false);
  const [tempCurrency, setTempCurrency] = useState("INR"); // Temporary currency selection while modal is open

  // Hardcoded conversion rates
  const conversionRates = {
    INR: 1,
    USD: 0.012, // Example: 1 INR = 0.012 USD
    EUR: 0.011, // Example: 1 INR = 0.011 EUR
  };

  // Hardcoded expenses data
  const expenses = [
    {
      id: 1,
      name: "Haridwar hotel",
      date: "Nov 13",
      oweOrLent: -133.34, // Lent amount in INR
    },
    {
      id: 2,
      name: "Photo",
      date: "Nov 13",
      oweOrLent: -66.67, // Lent amount in INR
    },
    {
      id: 3,
      name: "Chai kachori",
      date: "Nov 13",
      oweOrLent: -180.0, // Lent amount in INR
    },
    {
      id: 4,
      name: "Chai",
      date: "Nov 13",
      oweOrLent: -46.67, // Lent amount in INR
    },
    {
      id: 5,
      name: "Ganga Aarti",
      date: "Nov 13",
      oweOrLent: 186.66, // Owe amount in INR
    },
  ];

  // Calculate totals
  const totalOwe = expenses.reduce(
    (total, expense) => (expense.oweOrLent > 0 ? total + expense.oweOrLent : total),
    0
  );

  const totalLent = expenses.reduce(
    (total, expense) => (expense.oweOrLent < 0 ? total + Math.abs(expense.oweOrLent) : total),
    0
  );

  const totalExpenses = expenses.reduce((total, expense) => total + Math.abs(expense.oweOrLent), 0);

  // Convert amounts to the selected currency
  const convertAmount = (amount) => (amount * conversionRate).toFixed(2);

  return (
    <>
      <div className="border-2 border-amber-800 p-3 rounded-lg text-white bg-amber-600 m-2 text-center">
        <h1>Uttarakhand</h1>
        <h2>
          You owe {selectedCurrency} {convertAmount(totalOwe)} overall
        </h2>
      </div>

      {/* Extra Tabs */}
      <div className="flex justify-center space-x-11 mb-2">
        <div className="border-2 border-amber-800 p-3 rounded-lg text-white bg-amber-600">
          <h2>Settle up</h2>
        </div>
        <div
          className="border-2 border-amber-800 p-3 rounded-lg text-white bg-amber-600 cursor-pointer"
          onClick={() => setShowConverter(true)}
        >
          <h2>Converted to {selectedCurrency}</h2>
        </div>
        <div className="border-2 border-amber-800 p-3 rounded-lg text-white bg-amber-600">
          <h2>Balance</h2>
        </div>
      </div>

      <div className="flex justify-center gap-16">
        {/* Expenses Div */}
        <div className="border-2 border-amber-800 p-3 rounded-lg text-white bg-amber-600 w-[calc(50%-30px)]">
          <h2 className="text-center text-xl font-semibold">Expenses</h2>
          <div>
            {expenses.map((expense, index) => (
              <div key={index} className="border-b border-gray-300 py-2 flex items-center">
                <div className="flex-1">
                  <p className="font-semibold">{expense.name}</p>
                  <p className="text-sm text-gray-200">{expense.date}</p>
                 
                  
                </div>
                <p className="text-right font-bold text-lg">
                  {expense.oweOrLent > 0
                    ? `Owe: ${selectedCurrency} ${convertAmount(expense.oweOrLent)}`
                    : `Lent: ${selectedCurrency} ${convertAmount(Math.abs(expense.oweOrLent))}`}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total Expenses Div */}
        <div className="border-2 border-amber-800 p-3 rounded-lg text-white bg-amber-600 w-[calc(30%-30px)]">
          <h2 className="text-center text-xl font-semibold">Total Expenses</h2>
          <p className="text-center text-lg mt-3">
            {selectedCurrency} {convertAmount(totalExpenses)}
          </p>
        </div>
      </div>

      {/* Currency Converter Modal */}
      {showConverter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg">
            <h2 className="text-center text-xl font-bold mb-4">Select Currency</h2>
            <select
              value={tempCurrency}
              onChange={(e) => setTempCurrency(e.target.value)}
              className="border p-2 rounded-lg w-full mb-4"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-amber-600 text-white px-4 py-2 rounded-lg"
                onClick={() => {
                  setSelectedCurrency(tempCurrency);
                  setConversionRate(conversionRates[tempCurrency]);
                  setShowConverter(false);
                }}
              >
                Apply
              </button>
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                onClick={() => setShowConverter(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NewGroup;
