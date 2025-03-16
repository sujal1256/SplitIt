import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { MdOutlineCalendarMonth } from "react-icons/md";

function ExpenseSidebar({ expense, onClose, loggedUser }) {
  if (!expense) return null;

  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const isUserPayer = expense.memberWhoPaid?._id === loggedUser?.user?.userId;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-80 bg-[#1a2030] shadow-lg border-l border-gray-700 z-40 transition-all duration-300 overflow-y-auto">
      <div className="sticky top-0 bg-[#1f2937] p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Expense Details</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white rounded-full p-1"
        >
          <IoCloseOutline size={24} />
        </button>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Expense header */}
        <div className="bg-[#232a3b] p-4 rounded-lg">
          <h3 className="text-xl font-medium mb-2">{expense.expenseName}</h3>
          <div className="flex items-center gap-2 text-gray-300 mb-2">
            <MdOutlineCalendarMonth />
            <span>{formatDate(expense.createdAt)}</span>
          </div>
          <div className="text-2xl font-bold text-[#ff5733]">
            ₹{expense.amountPaid}
          </div>
        </div>

        {/* Paid by */}
        <div>
          <h4 className="text-sm text-gray-400 mb-2">PAID BY</h4>
          <div className="flex items-center gap-3 bg-[#232a3b] p-3 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-[#323a4d] flex items-center justify-center">
              <FaUser />
            </div>
            <div>
              <p className="font-medium">
                {isUserPayer ? "You" : expense.memberWhoPaid?.userName}
              </p>
              <p className="text-sm text-gray-400">Paid ₹{expense.amountPaid}</p>
            </div>
          </div>
        </div>

        {/* Split details */}
        <div>
          <h4 className="text-sm text-gray-400 mb-2">SPLIT BETWEEN</h4>
          <div className="space-y-2">
            {expense.membersIncluded.map((member) => {
              const isCurrentUser = member.memberId === loggedUser?.user?.userId;
              const amountOwed = expense.amountPaid / expense.membersIncluded.length;
              
              return (
                <div key={member.memberId} className="flex items-center justify-between bg-[#232a3b] p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#323a4d] flex items-center justify-center">
                      <FaUser />
                    </div>
                    <p className="font-medium">
                      {isCurrentUser ? "You" : member.memberName}
                    </p>
                  </div>
                  {member.memberId === expense.memberWhoPaid?._id ? (
                    <div className="text-sm font-medium text-green-400">
                      Paid ₹{expense.amountPaid}
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-red-400">
                      Owes ₹{amountOwed.toFixed(2)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes section if there are any */}
        {expense.description && (
          <div>
            <h4 className="text-sm text-gray-400 mb-2">NOTES</h4>
            <div className="bg-[#232a3b] p-3 rounded-lg">
              <p>{expense.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpenseSidebar;