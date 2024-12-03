import React from "react";
import Navbar from "../Navbar/Navbar.jsx";
import AddGroups from '../AddGroups/AddGroups.jsx'
import LandingPage from "../LandingPage/LandingPage.jsx";

function Dashboard() {
 
  
  return (
    <>
    <Navbar/>
    <LandingPage/>
    <AddGroups/>
    </>
  );
}

export default Dashboard;
