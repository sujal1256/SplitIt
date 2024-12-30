import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { checkUserLoggedIn } from "../../utils/userLoggedIn.jsx";
import { Link } from "react-router-dom";
import noGroupfound from "../Assets/noGroupFound.jpg";
import NewGroup from "./NewGroup.jsx";

function Groups() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMembers, setNewMembers] = useState([{ name: "", email: "" }]);
  const logged = checkUserLoggedIn();
  const [groups, setGroups] = useState();


  async function getGroups() {
    const response = await fetch("/api/v1/user/get-all-groups", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${logged.user?.userId}`,
      },
    });
    const data = await response.json();

    setGroups(data?.data);
  }

  async function handleDelete(groupId) {
    const response = await fetch("/api/v1/group/delete-group", {
      method: "DELETE",
      body: JSON.stringify({
        groupId: groupId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Group Deleted", {
        className: "toast-mobile",});
      getGroups();
    } else {
      toast.error("Error in deleting the group", {
        className: "toast-mobile",});
    }
  }

  useEffect(() => {
    getGroups();
  }, [isModalOpen]);

  return (
    <div >
      <div className="bottom-5 right-5 fixed z-10">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-32 h-11 cursor-pointer font-semibold bg-primary text-black border-2 border-text-colour rounded-lg shadow-lg hover:bg-secondary"
        >
          Create Group
        </button>
      </div>

      {/* Groups Display */}
      <div className="w-full flex justify-center items-center sm:py-12">
        <div className="w-[90%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 py-2 place-content-center">
          {groups?.length > 0 ? (
            groups.map((group) => (
              <div
              key={group._id}
              className="group border-2 border-primary bg-gradient-to-l from-primary to-secondary rounded-lg p-4 shadow-md text-start hover:border-accent hover:shadow-xl relative"
            >
              <Link to={"/group?g=" + group._id} className="block h-full w-full">
                <h3 className="font-semibold text-center text-lg sm:text-xl">
                  Group Name: {group.groupName}
                </h3>
                <div className="members">
                  {group.members.map((member, index) => (
                    <div key={index} className="member">
                      <p>Member: {member.memberName}</p>
                    </div>
                  ))}
                </div>
                <h3>Group Description: {group.groupDescription}</h3>
              </Link>
              <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(group._id);
              }}
              className="w-16 h-11 cursor-pointer font-semibold bg-primary text-white border-2 border-secondary hover:bg-text-colour rounded-lg shadow-lg absolute bottom-4 right-4 
                        block sm:block md:hidden group-hover:block"
            >
              Delete
            </button>
            </div>

            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center bg-white p-5 rounded-md ">
            <img
              src={noGroupfound}
              alt="No Data Icon"
              className="w-2/3 sm:w-1/2 m-auto"
            />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              You have no groups yet
            </h2>
            <p className="text-black">
              It only takes a few seconds to create a group and add members.
            </p>
          </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <NewGroup
          setIsModalOpen={setIsModalOpen}
          newMembers={newMembers}
          setNewMembers={setNewMembers}
        />
      )}
    </div>
  );
}

export default Groups;
