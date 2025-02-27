import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addGroup, removeGroup } from "../../redux/group.slice.js";
import { toast } from "react-toastify";
import { MdOutlineMessage } from "react-icons/md";
import TotalExpenses from "./TotalExpenses.jsx";
import DesktopExpense from "./DesktopExpense.jsx";
import AddExpense from "./AddExpense.jsx";
import ExpenseSummaryCards from "./ExpenseSummaryCards.jsx";
import MobileExpense from "./MobileExpense.jsx";
import { FaPlus } from "react-icons/fa";

function GroupDetails() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const user = useSelector((store) => store.user);
  const logged = user.user;
  const [searchParams] = useSearchParams();
  const [expenses, setExpenses] = useState([]);
  const [totalTransaction, setTotalTransaction] = useState(0);
  const [memberTransactions, setMembersTransactions] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState();
  const [yourExpenses, setYourExpenses] = useState();
  const [balance, setBalance] = useState();
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
        setTotalExpenses(data?.data?.totalExpenses);
        setYourExpenses(data?.data?.yourExpenses);
        setBalance(data?.data?.balance);
      }
    } catch (error) {
      console.log("Error in getting the groups", error.message);
    }
  }
  console.log(expenses);

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

  // Close modal if clicked outside
  const handleCloseModal = (e) => {
    if (e.target.classList.contains("modal-backdrop")) {
      setShowAddExpense(false);
    }
  };

  return (
    <div className="min-h-screen h-fit flex flex-col bg-slate-200 p-4">
      <div className="border-2 border-text-colour p-3 rounded-lg text-white bg-primary m-5 text-center max-w-4xl mx-auto w-full">
        <h1 className="text-3xl">{group?.group?.groupName}</h1>
        {/* FIXME: Show the total Owe from the group */}
        {/* <h2>
          {totalTransaction < 0
            ? `You Owe ${selectedCurrency} ${Math.abs(totalTransaction).toFixed(
                2
              )}`
            : `You Lent ${selectedCurrency} ${totalTransaction.toFixed(2)}`}
        </h2> */}
      </div>
      <ExpenseSummaryCards
        totalTransaction={totalTransaction}
        memberTransactions={memberTransactions}
        totalExpenses={totalExpenses}
        yourExpenses={yourExpenses}
        balance={balance}
      />

      <div className="w-full max-w-4xl mx-auto my-4 border">
        {isMobile ? (
          <div className="bg-primary text-white p-4 rounded-t-lg flex gap-2 font-medium text-lg">
            Expenses{" "}
            <span className="text-sm flex items-center text-slate-300">
              ({expenses?.length} expenses)
            </span>
          </div>
        ) : (
          <div className="bg-primary text-white p-4 grid grid-cols-6 ">
            <div>Description</div>
            <div>Paid By</div>
            <div>Date</div>
            <div>Amount</div>
            <div>Total Amount</div>
          </div>
        )}

        <div className="border border-gray-500">
          {expenses.map((expense) => {
            return isMobile ? (
              <MobileExpense
                key={expense?._id}
                expense={expense}
                logged={logged}
                getExpenses={getExpenses}
              />
            ) : (
              <DesktopExpense
                key={expense?._id}
                expense={expense}
                logged={logged}
                getExpenses={getExpenses}
              />
            );
          })}
        </div>

        <div
          className="w-fit mt-4 mx-auto"
          onClick={() => setShowAddExpense(true)}
        >
          <p className="text-gray-400 bg-gray-300 rounded-full p-3 text-center">
            <FaPlus />
          </p>
        </div>
      </div>

      {showAddExpense && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg w-11/12 md:w-3/4 lg:w-2/5 max-w-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Add New Expense
            </h2>

            <AddExpense
              getExpenses={getExpenses}
              setSelectedMembers={setSelectedMembers}
              selectedMembers={selectedMembers}
              onClose={() => setShowAddExpense(false)}
            />
          </div>
        </div>
      )}
      <div className="fixed bottom-20 right-44">
        <button
          className="fixed flex items-center gap-2 bg-primary text-white p-4 rounded-lg shadow-md hover:bg-green-700"
          onClick={() => setShowAddExpense(true)}
        >
          <MdOutlineMessage size={24} /> Add Expense
        </button>
      </div>
    </div>
  );
}

export default GroupDetails;
