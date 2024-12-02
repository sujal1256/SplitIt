import React, { useState } from 'react';

function AddGroups() {
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newMembers, setNewMembers] = useState([{ name: '', email: '' }]);

  const addGroup = () => {
    const newGroup = {
      id: groups.length + 1,
      name: newGroupName || `Group ${groups.length + 1}`,
      members: newMembers.filter(member => member.name.trim() && member.email.trim()),
    };
    setGroups([...groups, newGroup]);
    setIsModalOpen(false); // Close the modal
    setNewGroupName(''); // Reset the form
    setNewMembers([{ name: '', email: '' }]);
  };

  const addMemberField = () => {
    setNewMembers([...newMembers, { name: '', email: '' }]);
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
        {groups.map(group => (
          <div
            key={group.id}
            className="w-[calc(50%-30px)] border-2 border-gray-300 bg-gradient-to-l from-amber-600 via-amber-500 to-amber-400 rounded-lg p-4 shadow-md text-center hover:border-amber-500 hover:shadow-xl"
          >
            <h3>{group.name}</h3>
            <div className="members">
              {group.members.map((member, index) => (
                <div key={index} className="member">
                  <p>Name: {member.name}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-2/3 p-5 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Create New Group</h2>
            <input
              type="text"
              placeholder="Group Name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full border-2 border-black-600 p-2 rounded-lg mb-4"
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
                />
            
                <input
                  type="text"
                  placeholder="Email"
                  value={member.email}
                  onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                  className="w-1/2 border-2 border-gray-300 p-2 rounded-lg"
                />
              </div>
            ))}
            <button
              onClick={addMemberField}
              className="bg-amber-600 text-white py-2 px-5 mt-3 rounded-lg"
            >
              Add Member
            </button>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-black py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={addGroup}
                className="bg-amber-600 text-white py-2 px-4 rounded-lg"
              >
                Save Group
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddGroups;
