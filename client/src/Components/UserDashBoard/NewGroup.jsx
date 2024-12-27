import React, { useState } from "react";
import { toast } from "react-toastify";
import { validateEmail } from "../../utils/regexCheck.js";
function NewGroup({ setIsModalOpen, newMembers, setNewMembers }) {
  const [newGroupName, setNewGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");

  async function handleCreateGroup(event) {
    event.preventDefault();

    if (newMembers.some((member) => validateEmail(member.email) === false)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const response = await fetch("api/v1/group/create-group", {
      method: "POST",
      body: JSON.stringify({
        groupName: newGroupName,
        members: newMembers,
        groupDescription: groupDesc,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await response.json();

    if (response.ok) {
      toast.success(data.message);
    } else {
      toast.error("Error in creating group");
    }

    setIsModalOpen(false);
    setNewGroupName("");
    setNewMembers([{ name: "", email: "" }]);
  }

  const addMemberField = () => {
    setNewMembers([...newMembers, { name: "", email: "" }]);
  };

  const removeLastMemberField = () => {
    if (newMembers.length > 1) {
      setNewMembers(newMembers.slice(0, -1));
    } else {
      toast.error("You need to have at least one member");
    }
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...newMembers];
    updatedMembers[index][field] = value;
    setNewMembers(updatedMembers);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 p-5 rounded-lg shadow-lg h-2/3 overflow-y-auto pt-8">
        <h2 className="text-lg font-semibold mb-4">Create New Group</h2>
        <form onSubmit={handleCreateGroup}>
          <input
            type="text"
            placeholder="Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="w-full border-2 border-gray-300 p-2 rounded-lg mb-4"
            required
          />

          <h3 className="font-semibold mb-2">Members</h3>
          {newMembers.map((member, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                type="text"
                placeholder="Name"
                value={member.name}
                onChange={(e) =>
                  handleMemberChange(index, "name", e.target.value)
                }
                className="w-full sm:w-1/2 border-2 border-gray-300 p-2 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Email"
                value={member.email}
                onChange={(e) =>
                  handleMemberChange(index, "email", e.target.value)
                }
                className="w-full sm:w-1/2 border-2 border-gray-300 p-2 rounded-lg"
                required
              />
            </div>
          ))}

          <button
            onClick={addMemberField}
            type="button"
            className="bg-primary border-text-colour text-white py-2 px-5 mt-3 rounded-lg"
          >
            Add Member
          </button>
          <button
            onClick={removeLastMemberField}
            type="button"
            className="bg-gray-300 text-black py-2 px-5 mt-3 rounded-lg ml-2"
          >
            Remove Last Member
          </button>

          <h2 className="text-lg font-semibold mb-4 mt-3">Group Description</h2>
          <input
            type="text"
            placeholder="Description"
            value={groupDesc}
            onChange={(e) => setGroupDesc(e.target.value)}
            className="w-full border-2 border-gray-300 p-2 rounded-lg mb-4"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              type="button"
              className="bg-gray-300 text-black py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary border-text-colour text-white py-2 px-4 rounded-lg"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewGroup;
