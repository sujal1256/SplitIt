import React, { useState } from "react";
import { toast } from "react-toastify";
import { validateEmail } from "../../utils/regexCheck.js";
import { useSelector } from "react-redux";

function NewGroup({ setIsModalOpen }) {
  const user = useSelector((state) => state.user.user);
  const [newGroupName, setNewGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [members, setMembers] = useState([user?.user.userEmail]);
  const [currentEmail, setCurrentEmail] = useState("");

  async function handleCreateGroup(event) {
    event.preventDefault();

    if (members.length === 0) {
      toast.error("Please add at least one member", {
        className: "toast-mobile",
      });
      return;
    }

    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/v1/group/create-group",
      {
        method: "POST",
        body: JSON.stringify({
          groupName: newGroupName,
          members: members,
          groupDescription: groupDesc,
        }),
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
      }
    );
    const data = await response.json();

    if (response.ok) {
      toast.success(data.message, {
        className: "toast-mobile",
      });
    } else {
      toast.error("Error in creating group", {
        className: "toast-mobile",
      });
    }

    setIsModalOpen(false);
  }

  const handleAddMember = () => {
    // Validate email before adding
    if (!validateEmail(currentEmail)) {
      toast.error("Please enter a valid email address", {
        className: "toast-mobile",
      });
      return;
    }

    // Check for duplicates
    if (members.includes(currentEmail)) {
      toast.error("This email has already been added", {
        className: "toast-mobile",
      });
      return;
    }

    // Add current email to the list
    setMembers([...members, currentEmail]);

    // Clear the input field
    setCurrentEmail("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddMember();
    }
  };

  const handleRemoveMember = (index) => {
    const updatedMembers = [...members];
    updatedMembers.splice(index, 1);
    setMembers(updatedMembers);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-2 sm:p-0 z-50">
      <div className="bg-[#1a202c] text-white w-full max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden border border-gray-700 flex flex-col max-h-[90vh]">
        <div className="p-4 sm:p-5 overflow-y-auto flex-grow">
          <h2 className="text-xl font-semibold mb-4 text-[#FF6B35]">
            Create New Group
          </h2>

          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div>
              <label
                htmlFor="groupName"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Group Name
              </label>
              <input
                id="groupName"
                type="text"
                placeholder="Enter group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full bg-[#2d3748] border-2 border-gray-700 p-2 rounded-lg text-white placeholder-gray-400 focus:border-[#FF6B35] focus:outline-none"
                required
              />
            </div>

            <div>
              <label
                htmlFor="groupDescription"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Group Description (Optional)
              </label>
              <input
                id="groupDescription"
                type="text"
                placeholder="Enter description"
                value={groupDesc}
                onChange={(e) => setGroupDesc(e.target.value)}
                className="w-full bg-[#2d3748] border-2 border-gray-700 p-2 rounded-lg text-white placeholder-gray-400 focus:border-[#FF6B35] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Add Members
              </label>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={currentEmail}
                  onChange={(e) => setCurrentEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-grow bg-[#2d3748] border-2 border-gray-700 p-2 rounded-lg text-white placeholder-gray-400 focus:border-[#FF6B35] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="bg-[#FF6B35] hover:bg-[#ff8355] text-white p-2 rounded-lg min-w-[80px]"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Display added members */}
            {members.length > 0 && (
              <div className="bg-[#2d3748] rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-2 bg-[#1e2633] border-b border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300">
                    Members ({members.length})
                  </h4>
                </div>
                <div className="p-2 max-h-40 overflow-y-auto">
                  {members.length > 0 ? (
                    <ul className="space-y-1">
                      {members.map((email, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center px-2 py-1 rounded hover:bg-[#1a202c]  border-gray-700 border-b"
                        >
                          <span className="text-sm text-gray-200 break-all">
                            {email}
                          </span>
                          {email !== user.user.userEmail ? (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(index)}
                              className="text-gray-400"
                              aria-label="Remove member"
                            >
                              ×
                            </button>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm italic">
                      No members added yet
                    </p>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="p-4 bg-[#1e2633] border-t border-gray-700 flex justify-end gap-2">
          <button
            onClick={() => setIsModalOpen(false)}
            type="button"
            className="bg-[#2d3748] hover:bg-gray-700 text-white py-2 px-4 rounded-lg border border-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            type="button"
            className="bg-[#FF6B35] hover:bg-[#ff8355] text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newGroupName || members.length === 0}
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewGroup;
