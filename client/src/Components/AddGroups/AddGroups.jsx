import React, { useState } from 'react';


function AddGroups() {
  // State to hold the groups and their members
  const [groups, setGroups] = useState([]);

  // Function to add a new group with member details
  const addGroup = () => {
    const newGroup = {
      id: groups.length + 1,
      name: `Group ${groups.length + 1}`,
      members: [
        { name: 'John Doe', role: 'Admin' },
        { name: 'Jane Smith', role: 'Member' }
      ]
    };
    setGroups([...groups, newGroup]);
  };

  return (
    <>
      {/* Button to add a new group */}
      <div className="<w-20 h-12 cursor-pointer font-semibold bg-amber-600 text-white border-2 border-gray-400 fixed bottom-5 right-5 rounded-lg shadow-lg">
        <button onClick={addGroup} className="p-2">Add Group</button>
      </div>

      {/* Render the groups */}
      <div className="w-[90%] text-center m-12 flex flex-wrap gap-10 justify-center">
        {groups.map(group => (
          <div key={group.id} className="w-[calc(50%-30px)] border-2 border-gray-300 bg-gradient-to-l from-amber-600 via-amber-500 to-amber-400 rounded-lg p-4 shadow-md box-border text-center hover:border-amber-500 hover:shadow-xl">
            <h3>{group.name}</h3>
            <div className="members">
              {group.members.map((member, index) => (
                <div key={index} className="member">
                  <p>Name: {member.name}</p>
                  <p>Role: {member.role}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </>
  );
}

export default AddGroups;
