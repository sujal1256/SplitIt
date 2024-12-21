import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { checkUserLoggedIn } from "../../utils/userLoggedIn";
import { useDispatch, useSelector } from "react-redux";
import { addGroup, removeGroup } from "../../redux/group.slice.js";
import { toast } from "react-toastify";
import background from "../Assets/newGroupBack.jpg";

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
      className=" h-screen "
      style={{ backgroundImage: `url(${background})`, backgroundSize: "cover" }}
    >
      <div className="border-2 border-text-colour p-3 rounded-lg text-white bg-primary m-2 text-center">
        <h1 className="text-3xl">{group?.group?.groupName}</h1>
        <h2>
          {/* You owe {selectedCurrency} {convertAmount(totalOwe)} overall */}
        </h2>
      </div>

      {/* Extra Tabs */}
      <div className="flex justify-center space-x-11 mb-2">
        <div className="border-2 border-text-colour p-3 rounded-lg text-white bg-primary">
          <h2>Settle up</h2>
        </div>
        <div
          className="border-2 border-text-colour p-3 rounded-lg text-white bg-primary cursor-pointer"
          onClick={() => setShowConverter(true)}
        >
          <h2>Converted to {selectedCurrency}</h2>
        </div>
        <div className="border-2 border-text-colour p-3 rounded-lg text-white bg-primary">
          <h2>Balance</h2>
        </div>
      </div>

      {/* Input Form */}
      <div className="flex justify-center">
        <div className="border-2 border-text-colour p-3 rounded-lg text-white bg-primary m-2 w-2/3 ">
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

            {/* </select> */}

            <div className="flex flex-wrap gap-2 ">
              <p className="text-xl font-semibold">
                {" "}
                Select members to split the expense with:{" "}
              </p>
              <br />

              {/* FIXME: this should not be slice(1) */}
              {group.group?.members
                .filter((member, index) => index > 0) // Replace this condition with your specific filter logic
                .map((member) => (
                  <label
                    key={member.id}
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
              className="bg-primary text-white px-4 py-2 rounded-lg text-xl "
            >
              Add Expense
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-16">
        {/* Expenses Div */}
        <div className="border-2 border-text-colour p-3 rounded-lg text-white bg-primary w-[calc(50%-30px)]">
          <h2 className="text-center text-xl font-semibold">Expenses</h2>
          <div>
            {expenses.map((expense, index) => (
              <div
                key={index}
                className="border-b border-gray-300 py-2 flex items-center"
              >
                <div className="flex-1">
                  <p className="font-semibold">{expense.expenseName}</p>
                  <button onClick={() => handleDelete(expense._id)}>
                    Delete
                  </button>
                  {/*FIXME: <p className="text-sm text-gray-200">{expense.date}</p> */}
                </div>
                <p className="text-right font-bold text-lg">
                  {/* + should be in green color and - should be in red color */}
                  {expense.memberWhoPaid == logged?.user?.userId
                    ? `+ ${expense.totalAmountLent.toFixed(2)}`
                    : `- ${expense.amountToBePaid.toFixed(2)}`}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total Expenses Div */}
        <div className="border-2 border-text-colour p-3 rounded-lg text-white bg-primary w-[calc(30%-30px)]">
          <h2 className="text-center text-xl font-semibold">Total Expenses</h2>
          <p className="text-center text-lg mt-3">
            {/*FIXME: It should be green if positive and red if negative */}
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
