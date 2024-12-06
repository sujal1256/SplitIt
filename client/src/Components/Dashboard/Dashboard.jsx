import React from "react";
import Navbar from "../Navbar/Navbar.jsx";
import AddGroups from '../AddGroups/AddGroups.jsx'
import LandingPage from "../LandingPage/LandingPage.jsx";
import NewGroup from "../NewGroup/NewGroup.jsx";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer.jsx";

function Dashboard() {
 
  
  return (
    <>
    
    <Navbar/>
    {/* <LandingPage/> */}
    {/* <AddGroups/> */}
    {/* <About/> */}
    <Outlet />
    {/* <NewGroup/> */}
    {/* <Footer/> */}
    </>
  );
}

export default Dashboard;
