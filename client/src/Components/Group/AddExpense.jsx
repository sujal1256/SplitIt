import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function AddExpense({getExpenses, setSelectedMembers, selectedMembers}) {
  const [showForm, setShowForm] = useState(false);
  const [isMobile] = useState(window.innerWidth < 768);
  const [expenseTitle, setExpenseTitle] = useState([]);
  const [amount, setAmount] = useState("");
  const group = useSelector(store => store.group);
  const user = useSelector(store => store.user);
  const logged = user.user;


  const addExpense = async () => {
    if (!expenseTitle || selectedMembers?.length === 0) {
      toast.error("Fill in all the fields!", {
        className: "toast-mobile",
      });
      return;
    }

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
    }

    getExpenses();

    setExpenseTitle("");
    setAmount("");
    setSelectedMembers(group?.group?.members);
  };
  return (
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
        <div className="flex justify-center w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
          <div className="border-2 border-text-colour p-3 rounded-lg text-white bg-primary m-2 w-full sm:full">
            <h2 className="text-center text-xl font-bold pb-4 cursor-pointer">
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
              <p className="text-xl font-semibold">
                Group Owner : {group?.group?.groupOwner?.userName}
              </p>
              <div className="flex flex-wrap gap-2">
                <p className="text-xl font-semibold">
                  Select members to split the expense with:
                </p>
                {group?.group?.members
                  .filter((member) => member.memberId !== logged.user?.userId)
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
                className="bg-secondary border-2 border-black text-black px-4 py-2 rounded-lg text-xl"
              >
                Add Expense
              </button>
              {isMobile && (
                <button
                  onClick={() => setShowForm(false)} // Hide the form on click
                  className="bg-secondary border-2 border-black text-black px-4 py-2 rounded-lg text-xl mt-2 hover:bg-primary"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddExpense;
