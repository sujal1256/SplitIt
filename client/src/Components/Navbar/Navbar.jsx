import React, { useState } from 'react';
import logo from '../Assets/logo.png';
import { Link } from 'react-router-dom';
import { checkUserLoggedIn } from "../../utils/userLoggedIn";

function Navbar() {
    
  const logged = checkUserLoggedIn();
  const handleLogout = () => {
    logged.loggedIn = false;
    console.log("User logged out");
  };

  console.log(logged);
  
    return (
        <>
            <nav className="bg-primary p-5 sticky top-0 z-1000">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img src={logo} alt="Logo" className="h-10 mr-2" />
                        <h1 className="text-white text-2xl font-bold">Split-It</h1>
                    </div>

                    {/* Navigation Links */}
                    <ul className="list-none m-0 p-0 flex">
                        {logged ? (
                            // Show all tabs if the user is logged in
                            <>
                                <li className="ml-5">
                                    <Link
                                        to="/"
                                        className="text-white no-underline text-lg font-medium transition-transform duration-300 ease-in-out hover:text-text-colour hover:-translate-y-1"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li className="ml-5">
                                    <Link
                                        to="/about"
                                        className="text-white no-underline text-lg font-medium transition-transform duration-300 ease-in-out hover:text-text-colour hover:-translate-y-1"
                                    >
                                        About
                                    </Link>
                                </li>
                                <li className="ml-5">
                                    <Link
                                        to="/contact"
                                        className="text-white no-underline text-lg font-medium transition-transform duration-300 ease-in-out hover:text-text-colour hover:-translate-y-1"
                                    >
                                        Contact
                                    </Link>
                                </li>
                                <li className="ml-5">
                                    <Link
                                    onClick={handleLogout}
                                        to="/"
                                        className="text-white no-underline text-lg font-medium transition-transform duration-300 ease-in-out hover:text-text-colour hover:-translate-y-1"
                                    >
                                        Log Out
                                    </Link>
                                </li>
                            </>
                        ) : <li className="ml-5">
                        <Link
                            to="/login"
                            className="text-white no-underline text-lg font-medium transition-transform duration-300 ease-in-out hover:text-text-colour hover:-translate-y-1"
                        >
                            Login
                        </Link>
                    </li>}
              
                    </ul>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
