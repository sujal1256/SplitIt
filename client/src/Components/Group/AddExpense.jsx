import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function AddExpense({
  getExpenses,
  setSelectedMembers,
  selectedMembers,
  onClose,
}) {
  const [expenseTitle, setExpenseTitle] = useState("");
  const [amount, setAmount] = useState("");
  const group = useSelector((store) => store.group);
  const user = useSelector((store) => store.user);
  const logged = user.user;

  const addExpense = async () => {
    if (!expenseTitle || selectedMembers?.length === 0) {
      toast.error("Fill in all the fields!", {
        className: "toast-mobile",
      });
      return;
    }

    if (amount <= 0) {
      toast.error("Invalid Amount", {
        className: "toast-mobile",
      });
      return;
    }
    console.log(selectedMembers)

    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/v1/expense/add-expense",
        {
          method: "POST",
          body: JSON.stringify({
            groupId: group?.group?._id,
            memberWhoPaid: logged?.user?.userId,
            membersIncluded: selectedMembers,
            amountPaid: Number.parseInt(amount),
            expenseName: expenseTitle,
          }),
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          credentials: "include",
        }
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        toast.error("Error while adding expense", {
          className: "toast-mobile",
        });
      } else {
        toast.success("Expense added successfully!");
        getExpenses();
        setExpenseTitle("");
        setAmount("");
        setSelectedMembers(group?.group?.members);
        if (onClose) onClose();
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("An error occurred while adding expense");
    }
  };

  return (
    <div className="w-full text-white">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Expense Title"
          value={expenseTitle}
          onChange={(e) => setExpenseTitle(e.target.value)}
          className="p-2 border rounded-lg text-black w-full"
        />
        <input
          type="number"
          placeholder="Amount Paid"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 border rounded-lg text-black w-full"
        />
        <p className="text-lg font-semibold">
          Group Owner: {group?.group?.groupOwner?.userName}
        </p>
        <div className="mt-2">
          <p className="text-lg font-semibold mb-2">
            Select members to split the expense with:
          </p>
          <div className="flex flex-wrap gap-3">
            {group?.group?.members.map((member) => (
              <label
                key={member._id}
                className="flex items-center gap-2"
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
                  className="w-4 h-4"
                />
                <span>{member.memberName}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={addExpense}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
          >
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddExpense;
