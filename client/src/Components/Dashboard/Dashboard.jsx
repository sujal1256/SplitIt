import React from "react";
import Navbar from "../Navbar/Navbar.jsx";
import AddGroups from '../AddGroups/AddGroups.jsx'
import LandingPage from "../LandingPage/LandingPage.jsx";
import About from "../About/About.jsx";
import Footer from "../Footer/Footer.jsx";

function Dashboard() {
 
  
  return (
    <>
    <Navbar/>
    {/* <LandingPage/> */}
    {/* <AddGroups/> */}
    <About/>
    <Footer/>
    </>
  );
}

export default Dashboard;
