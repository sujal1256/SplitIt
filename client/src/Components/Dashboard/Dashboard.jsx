import React from "react";
import Navbar from "../Navbar/Navbar.jsx";
import AddGroups from '../AddGroups/AddGroups.jsx'
import { checkUserLoggedIn } from "../../utils/userLoggedIn.jsx";

function Dashboard() {
 
  
  return (
    <>
    
    <Navbar/>
    <AddGroups/>
    </>
  );
}

export default Dashboard;
