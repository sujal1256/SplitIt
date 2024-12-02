import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar.jsx";
import AddGroups from "../AddGroups/AddGroups.jsx";
import { checkUserLoggedIn } from "../../utils/userLoggedIn.jsx";

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const logged = checkUserLoggedIn();
  
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
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <>
      <Navbar />
      {groups.map((group) => {
        return <p key={group._id}>{group.groupName}</p>;
      })}
      <AddGroups />
    </>
  );
}

export default Dashboard;
