import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { checkUserLoggedIn } from "../../utils/userLoggedIn";
import { useDispatch, useSelector } from "react-redux";
import { addGroup, removeGroup } from "../../redux/group.slice.js";
import { toast } from "react-toastify";
import background from "../Assets/newGroupBack.jpg";
import TotalExpenses from "./TotalExpenses.jsx";

function NewGroup() {
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [conversionRate, setConversionRate] = useState(1); // Default to INR to INR (no conversion)
  const [showConverter, setShowConverter] = useState(false);
  const [tempCurrency, setTempCurrency] = useState("INR"); // Temporary currency selection while modal is open
  const logged = checkUserLoggedIn();
  const [searchParams] = useSearchParams();
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [expenseTitle, setExpenseTitle] = useState([]);
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState([]);
  const [totalTransaction, setTotalTransaction] = useState(0);
  const [memberTransactions, setMembersTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const group = useSelector((store) => store.group);

  const [selectedMembers, setSelectedMembers] = useState([]);

  const dispatch = useDispatch();

  async function getExpenses() {
    try {
      const response = await fetch(
        `api/v1/expense/get-all-expenses?groupId=${searchParams.get("g")}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("data", data);

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
        `/api/v1/group/get-group-details?groupId=${searchParams.get("g")}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        // console.log("group response:  ", data?.data);
        dispatch(addGroup(data?.data));
        localStorage.setItem("group", JSON.stringify(data?.data));
      }
    } catch (error) {
      console.log("Error in getting group", error);
    }
  }

  useEffect(() => {
    getExpenses();
    getGroup().then(() => {
      setSelectedMembers(JSON.parse(localStorage.getItem("group"))?.members);
    });

    return () => {
      localStorage.removeItem("group");
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const addExpense = async () => {
    if (!expenseTitle || !expenseDate || selectedMembers.length === 0) {
      toast.error("Fill in all the fields!");
      return;
    }

    const response = await fetch("/api/v1/expense/add-expense", {
      method: "POST",
      body: JSON.stringify({
        groupId: group?.group?._id,
        memberWhoPaid: logged?.user?.userId,
        membersIncluded: selectedMembers,
        amountPaid: Number.parseInt(amount),
        expenseName: expenseTitle,
      }),
      headers: { "Content-type": "application/json" },
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      toast.success("Expense added");
    } else {
      toast.error("Error while adding expense");
    }

    getExpenses();

    setExpenseTitle("");
    setExpenseDate("");
    setAmount("");
    setSelectedMembers(group?.group?.members);
  };

  const handleDelete = async (expenseId) => {
    console.log("expenseId", expenseId);

    const response = await fetch("/api/v1/expense/delete-expense", {
      method: "DELETE",
      body: JSON.stringify({
        expenseId,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      toast.success("Expense deleted");
    } else {
      toast.error("Error while deleting expense");
    }
  };

  // Hardcoded conversion rates
  const conversionRates = {
    INR: 1,
    USD: 0.012, // Example: 1 INR = 0.012 USD
    EUR: 0.011, // Example: 1 INR = 0.011 EUR
  };

  // Convert amounts to the selected currency
  const convertAmount = (amount) => (amount * conversionRate).toFixed(2);

  return (
    <div
      className=" h-screen"
    >
      <div className="border-2 border-text-colour p-3 rounded-lg text-white bg-primary m-2 text-center">
        <h1 className="text-3xl">{group?.group?.groupName}</h1>
        <h2>
        {totalTransaction < 0 
          ? `You Owe ${selectedCurrency} ${Math.abs(totalTransaction).toFixed(2)}` 
          : `You Lent ${selectedCurrency} ${totalTransaction.toFixed(2)}`}
      </h2>
      </div>

      {/* Extra Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-2">
      <div className="border-2 border-text-colour p-2 sm:p-3 rounded-lg text-white bg-primary w-2/3 sm:w-auto text-center">
        <h2>Settle up</h2>
      </div>
      <div
        className="border-2 border-text-colour p-2 sm:p-3 rounded-lg text-white bg-primary cursor-pointer w-2/3 sm:w-auto text-center"
        onClick={() => setShowConverter(true)}
      >
        <h2>Converted to {selectedCurrency}</h2>
      </div>
      <div className="border-2 border-text-colour p-2 sm:p-3 rounded-lg text-white bg-primary w-2/3 sm:w-auto text-center">
        <h2>Balance</h2>
      </div>
    </div>


    <div className="flex flex-col items-center">
      {/* Responsive Input Form */}
      {isMobile && !showForm ? (
        <button
          onClick={() => setShowForm(true)} // Show the form on click (for phone screens)
          className="bg-primary text-white px-4 py-2 rounded-lg text-xl border-2 border-text-colour mb-4"
        >
          Add New Expense
        </button>
      ) : null}

      {(showForm || !isMobile) && (
        <div className="flex justify-center w-full md:w-2/3">
          <div className="border-2 border-text-colour p-3 rounded-lg text-white bg-primary m-2 w-full">
            <h2 className="text-center text-xl font-bold pb-4">
              Add New Expense
            </h2>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Expense Title"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                className="p-2 border rounded-lg text-black"
              />
              <input
                type="text"
                placeholder="Amount Paid"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="p-2 border rounded-lg text-black"
              />
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="p-2 border rounded-lg text-black"
              />
              <p className="text-xl font-semibold">
                Group Owner : {group?.group?.groupOwner?.userName}
              </p>
              <div className="flex flex-wrap gap-2">
                <p className="text-xl font-semibold">
                  Select members to split the expense with:
                </p>
                {group.group?.members
                  .filter(
                    (member) =>
                      member.memberId !== logged.user?.userId
                  )
                  .map((member) => (
                    <label
                      key={member._id}
                      className="flex items-center gap-2 text-xl font-semibold"
                    >
                      <input
                        type="checkbox"
                        value={member.name}
                        checked={selectedMembers?.some(
                          (selected) => selected._id === member._id
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMembers([...selectedMembers, member]);
                          } else {
                            setSelectedMembers(
                              selectedMembers.filter(
                                (selected) => selected._id !== member._id
                              )
                            );
                          }
                        }}
                      />
                      {member.memberName}
                    </label>
                  ))}
              </div>
              <button
                onClick={addExpense}
                className="bg-primary text-white px-4 py-2 rounded-lg text-xl"
              >
                Add Expense
              </button>
              {isMobile && (
                <button
                  onClick={() => setShowForm(false)} // Hide the form on click
                  className="bg-secondary text-white px-4 py-2 rounded-lg text-xl mt-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>

    <div className="flex flex-wrap justify-center gap-4 md:gap-16">
  {/* Expenses Div */}
  <div className="border-2 border-text-colour p-3 rounded-lg text-white bg-primary w-full md:w-[60%] lg:w-[50%] m-3">
    <h2 className="text-center text-xl font-semibold">Expenses</h2>
    <div className="text-start">
      {expenses.map((expense, index) => (
        <div
          key={expense?._id}
          className="border-b border-gray-300 p-1 flex items-center"
        >
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
            Delete
          </button>
        </div>
      ))}
    </div>
  </div>

        {/* Total Expenses Div */}
        <TotalExpenses
          totalTransaction={totalTransaction}
          memberTransactions={memberTransactions}
          selectedCurrency={selectedCurrency}
        />
      </div>

      {/* Currency Converter Modal */}
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

export default NewGroup;
