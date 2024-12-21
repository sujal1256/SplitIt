import React from "react";
import Navbar from "../Navbar/Navbar.jsx";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer.jsx";

function Dashboard() {
 
  
  return (
    <>
    
    <Navbar/>
    <Outlet />
    {/* <Footer/> */}
    </>
  );
}

export default Dashboard;
