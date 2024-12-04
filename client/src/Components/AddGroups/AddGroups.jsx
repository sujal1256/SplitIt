import React, { useState ,useEffect} from 'react';
import {toast} from 'react-toastify';
import {checkUserLoggedIn} from '../../utils/userLoggedIn.jsx';

function AddGroups() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newMembers, setNewMembers] = useState([{ name: '', email: '' }]);
  const [groupDesc, setGroupDesc] = useState('');

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
    console.log(groups);
  }

  useEffect(() => {
    getGroups();
  }, [logged]);

  async function handleCreateGroup(event){
    event.preventDefault();  // Prevent form default submission

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

      const newGroup = {
      id: data.newGroupId, 
      groupName: newGroupName,
      members: newMembers.map(member => ({ memberName: member.name })), 
      
    };
    setGroups((prevGroups) => [...prevGroups, newGroup]);
      
    } else {
      toast.error("Error in creating group");
    }

    setIsModalOpen(false); 
    setNewGroupName(''); 
    setNewMembers([{ name: '', email: '' }]);
  }

  const addMemberField = () => {
     if (newMembers.length < 3) 
      { 
        setNewMembers([...newMembers, { name: '', email: '' }]); 
      } 
      else 
      { 
        toast.error("You can add at most 3 members"); 
      } 
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
    <>
      <div className="fixed bottom-5 right-5">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-30 h-11 cursor-pointer font-semibold bg-amber-600 text-white border-2 border-gray-400 rounded-lg shadow-lg"
        >
          Create Group
        </button>
      </div>

      {/* Groups Display */}
      <div className="w-[90%] text-center m-12 flex flex-wrap gap-10 justify-center">
        {groups?.map((group) => (
          <div
            key={group.id}
            className="w-[calc(50%-30px)] border-2 border-gray-300 bg-gradient-to-l from-amber-600 via-amber-500 to-amber-400 rounded-lg p-4 shadow-md text-start hover:border-amber-500 hover:shadow-xl"
          >
            <h3 className="font-semibold text-center text-xl">
              Group Name : {group.groupName}
            </h3>
            <div className="members">
              {group.members.map((member, index) => (
                <div key={index} className="member">
                  <p>
                    <bold>Member</bold> : {member.memberName}
                  </p>
                </div>
              ))}
            </div>
            <h3>Group Description : {group.groupDescription}</h3>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-2/3 p-5 rounded-lg shadow-lg">
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
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                    className="w-1/2 border-2 border-gray-300 p-2 rounded-lg" 
                    required
                  />
                  <input
                    type="text"
                    placeholder="Email"
                    value={member.email}
                    onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                    className="w-1/2 border-2 border-gray-300 p-2 rounded-lg" 
                    required
                  />
                </div>
              ))}

              <h2 className="text-lg font-semibold mb-4 mt-3">Group Description</h2>
              <input
                type="text"
                placeholder="Description"
                value={groupDesc}
                onChange={(e) => setGroupDesc(e.target.value)}
                className="w-full border-2 border-gray-300 p-2 rounded-lg mb-4"
              />
              <button
                onClick={addMemberField}
                type="button"
                className="bg-amber-600 text-white py-2 px-5 mt-3 rounded-lg"
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
                  className="bg-amber-600 text-white py-2 px-4 rounded-lg"
                >
                  Save Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddGroups;
