import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addGroup, removeGroup } from "../../redux/group.slice.js";
import { toast } from "react-toastify";
import TotalExpenses from "./TotalExpenses.jsx";
import Expense from "./Expense.jsx";
import AddExpense from "./AddExpense.jsx";

function GroupDetails() {
  const [selectedCurrency, setSelectedCurrency] = useState("INR");

  const [showConverter, setShowConverter] = useState(false);
  const [tempCurrency, setTempCurrency] = useState("INR");
  const user = useSelector((store) => store.user);

  const logged = user.user;
  const [searchParams] = useSearchParams();
  const [expenses, setExpenses] = useState([]);
  const [totalTransaction, setTotalTransaction] = useState(0);
  const [memberTransactions, setMembersTransactions] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const group = useSelector((store) => store.group);

  const dispatch = useDispatch();

  async function getExpenses() {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/expense/get-all-expenses?groupId=${searchParams.get("g")}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        setExpenses(data?.data?.formattedExpenses);
        setTotalTransaction(data?.data?.totalTransaction);
        setMembersTransactions(data?.data?.memberTransaction);
      }
    } catch (error) {
      console.log("Error in getting the groups", error.message);
    }
  }

  async function getGroup() {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/group/get-group-details?groupId=${searchParams.get("g")}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          credentials: "include",
        }
      );
      const data = await response.json();

      if (response.ok) {
        dispatch(addGroup(data?.data));
        localStorage.setItem("group", JSON.stringify(data?.data));
      }
    } catch (error) {
      console.log("Error in getting group", error);
    }
  }

  useEffect(() => {
    getGroup().then(() => {
      setSelectedMembers(JSON.parse(localStorage.getItem("group"))?.members);
    });
    getExpenses();

    return () => {
      localStorage.removeItem("group");
      dispatch(removeGroup());
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className=" h-screen">
      <div className="border-2 border-text-colour p-3 rounded-lg text-white bg-primary m-2 text-center">
        <h1 className="text-3xl">{group?.group?.groupName}</h1>
        <h2>
          {totalTransaction < 0
            ? `You Owe ${selectedCurrency} ${Math.abs(totalTransaction).toFixed(
                2
              )}`
            : `You Lent ${selectedCurrency} ${totalTransaction.toFixed(2)}`}
        </h2>
      </div>

      <AddExpense
        getExpenses={getExpenses}
        group={group}
        setSelectedMembers={setSelectedMembers}
        selectedMembers={selectedMembers}
      />

      <div className="flex flex-wrap justify-center gap-4 md:gap-16 ">
        {/* Expenses Div */}
        <div className="border-2 border-text-colour p-3 rounded-lg text-white bg-primary w-full sm:w-[75%] md:w-[65%] lg:w-[50%] m-3">
          <h2 className="text-center text-xl font-semibold">Expenses</h2>
          <div className="text-start">
            {expenses.map((expense) => (
              <Expense key={expense?._id} expense={expense} logged={logged} />
            ))}
          </div>
        </div>

        <TotalExpenses
          totalTransaction={totalTransaction}
          memberTransactions={memberTransactions}
          selectedCurrency={selectedCurrency}
        />
      </div>

      {showConverter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg">
            <h2 className="text-center text-xl font-bold mb-4">
              Select Currency
            </h2>
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
    </div>
  );
}

export default GroupDetails;
