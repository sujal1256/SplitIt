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
import ShimmerGroupDetails from "./ShimmerGroupDetails.jsx";
import Skeleton from "react-loading-skeleton";

function GroupDetails() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showShimmer, setShowShimmer] = useState(true);
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
        setShowShimmer(false);
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

  // Close modal if clicked outside
  const handleCloseModal = (e) => {
    if (e.target.classList.contains("modal-backdrop")) {
      setShowAddExpense(false);
    }
  };

  return (
    <div className="min-h-screen h-fit flex flex-col bg-[#121724] p-4 text-white pt-12">
      <div className="border border-gray-700 p-4 rounded-lg bg-[#1a2030] mb-6 max-w-4xl mx-auto w-full">
        <h1 className="md:text-4xl text-2xl font-semibold text-center">
          {group?.group != null ? group?.group?.groupName : <Skeleton baseColor="#2a3142" highlightColor="#3a4152" />}
        </h1>
      </div>

      <ExpenseSummaryCards
        totalTransaction={totalTransaction}
        memberTransactions={memberTransactions}
        totalExpenses={totalExpenses}
        yourExpenses={yourExpenses}
        balance={balance}
      />

      <div className="w-full max-w-4xl mx-auto my-4 border border-gray-700 rounded-lg overflow-hidden">
        {isMobile ? (
          <div className="bg-[#1f2937] p-4 rounded-t-lg flex gap-2 font-medium text-lg">
            Expenses{" "}
            <span className="text-sm flex items-center text-gray-400">
              ({expenses?.length} expenses)
            </span>
          </div>
        ) : (
          <div className="bg-[#1f2937] p-4 grid grid-cols-6 font-medium">
            <div>Description</div>
            <div>Paid By</div>
            <div>Date</div>
            <div>Amount</div>
            <div>Total Amount</div>
            <div></div>
          </div>
        )}

        <div className="bg-[#1a2030]">
          {(!showShimmer)? (
            expenses.map((expense) => {
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
            })
          ) : (
            <Skeleton height={45} count={8} baseColor="#2a3142" highlightColor="#3a4152" />
          )}
        </div>

        <div
          className="w-full py-3 flex justify-center bg-[#1a2030] border-t border-gray-700"
        >
          <button 
            onClick={() => setShowAddExpense(true)}
            className="text-gray-400 bg-[#2a3142] hover:bg-[#323a4d] rounded-full p-2.5 flex items-center justify-center transition-colors"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {showAddExpense && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 modal-backdrop"
          onClick={handleCloseModal}
        >
          <div
            className="bg-[#1a2030] rounded-lg w-11/12 md:w-3/4 lg:w-2/5 max-w-2xl p-6 border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-white">
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
      <div className="fixed bottom-5 right-5">
        <button
          className="flex items-center gap-2 bg-[#ff5733] text-white p-3 rounded-lg shadow-md hover:bg-[#e84c2b] transition-colors"
          onClick={() => setShowAddExpense(true)}
        >
          <MdOutlineMessage size={20} /> Add Expense
        </button>
      </div>
    </div>
  );
}

export default GroupDetails;