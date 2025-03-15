import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import noGroupfound from "../Assets/noGroupFound.jpg";
import NewGroup from "./NewGroup.jsx";
import DeleteConfirmation from "./DeleteConfirmation";

function Groups() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMembers, setNewMembers] = useState([{ name: "", email: "" }]);
  const [groups, setGroups] = useState();
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    groupId: null,
    groupName: ""
  });

  async function getGroups() {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/v1/user/get-all-groups",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
      }
    );
    const data = await response.json();
    setGroups(data?.data);
  }

  async function handleDelete(groupId) {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/v1/group/delete-group",
      {
        method: "DELETE",
        body: JSON.stringify({
          groupId: groupId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
      }
    );

    const data = await response.json();

    if (response.ok) {
      getGroups();
    } else {
      toast.error("Error in deleting the group", {
        className: "toast-mobile",
      });
    }
    
    // Close delete modal
    setDeleteModal({
      isOpen: false,
      groupId: null,
      groupName: ""
    });
  }

  // Open delete confirmation
  const openDeleteConfirmation = (e, group) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModal({
      isOpen: true,
      groupId: group._id,
      groupName: group.groupName
    });
  };

  // Close delete confirmation
  const closeDeleteConfirmation = () => {
    setDeleteModal({
      isOpen: false,
      groupId: null,
      groupName: ""
    });
  };

  // Confirm delete
  const confirmDelete = () => {
    if (deleteModal.groupId) {
      handleDelete(deleteModal.groupId);
    }
  };

  useEffect(() => {
    getGroups();
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white">
      {/* Header */}
      <div className="w-full pt-6 pb-8 px-4">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-white">Your </span>
            <span className="text-[#ff7a45]">Groups</span>
          </h1>
          <p className="text-gray-300">
            Manage and track expenses with your groups
          </p>
        </div>
      </div>

      {/* Create Group Button */}
      <div className="bottom-5 right-5 fixed z-10">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 rounded-lg font-semibold bg-[#ff7a45] text-white hover:bg-[#ff9d78] transition duration-200 shadow-lg"
        >
          Create Group
        </button>
      </div>

      {/* Groups Grid */}
      <div className="w-full flex justify-center items-center pb-20">
        <div className="w-[90%] max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-2 place-content-center">
          {groups?.length > 0 ? (
            groups.map((group) => (
              <Link
              key={group._id}
              to={"/group?g=" + group._id}
              className="block group"
              >
                <div className="bg-[#242a3a] border border-[#2a3040] rounded-lg p-4 pb-6 pt-8 shadow-md hover:shadow-lg hover:border-[#ff7a45] transition-all duration-200 relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div>
                        <h3 className="font-medium text-white">
                          {group.groupName}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {group.groupDescription || "No description provided"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[#ff7a45] font-bold text-lg block">
                        {group.members.length}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {group.members.length === 1 ? "member" : "members"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      Created {new Date(group.createdAt).toLocaleDateString()}
                    </div>

                    <div className="flex -space-x-2">
                      {group.members.slice(0, 4).map((member, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full border-2 border-[#242a3a] overflow-hidden"
                          style={{
                            backgroundColor: [
                              "#4A6FDC",
                              "#9C5BF5",
                              "#FF7F7F",
                              "#50C878",
                              "#FFD166",
                            ][index % 5],
                          }}
                        >
                          <div className="w-full h-full flex items-center justify-center text-white text-xs font-medium">
                            {member.memberName?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        </div>
                      ))}

                      {group.members.length > 4 && (
                        <div className="w-8 h-8 rounded-full border-2 border-[#242a3a] bg-[#2a3040] flex items-center justify-center text-white text-xs font-medium">
                          +{group.members.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => openDeleteConfirmation(e, group)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-opacity duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <div className="flex flex-col items-center justify-center text-center bg-[#242a3a] border border-[#2a3040] p-8 rounded-lg">
                <img
                  src={noGroupfound}
                  alt="No Groups Found"
                  className="w-48 h-48 object-contain mb-6 opacity-70"
                />
                <h2 className="text-xl font-semibold text-white mb-2">
                  You have no groups yet
                </h2>
                <p className="text-gray-300 mb-6">
                  It only takes a few seconds to create a group and add members.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 rounded-lg font-semibold bg-[#ff7a45] text-white hover:bg-[#ff9d78] transition duration-200"
                >
                  Create Your First Group
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {isModalOpen && (
        <NewGroup
          setIsModalOpen={setIsModalOpen}
          newMembers={newMembers}
          setNewMembers={setNewMembers}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation 
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={confirmDelete}
        groupName={deleteModal.groupName}
      />
    </div>
  );
}

export default Groups;