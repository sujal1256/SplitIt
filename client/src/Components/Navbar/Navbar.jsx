import React, { useState } from "react";
import logo from "../Assets/logo.png";
import { Link } from "react-router-dom";
import { checkUserLoggedIn } from "../../utils/userLoggedIn";
import { toast } from "react-toastify";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const logged = checkUserLoggedIn();

  const handleLogout = async () => {
    const response = await fetch("/api/v1/user/logout", {
      method: "POST",
      headers: { "Content-type": "application/json" },
    });
    const json = await response.json();

    if (response.ok) {
      toast.success("Logged out");
    } else {
      toast.error("Error logging out");
    }
  };

  return (
    <>
      <nav className="bg-primary p-4 sticky top-0 z-50 shadow-lg">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-8 md:h-10 mr-2" />
            <h1 className="text-white text-xl md:text-2xl font-bold">
              Split-It
            </h1>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white text-2xl focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>

          {/* Navigation Links */}
          <ul
            className={`${
              isMenuOpen ? "block" : "hidden"
            } md:flex list-none m-0 py-2 absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-primary md:bg-transparent md:flex-row md:items-center transition-all duration-300`}
          >
            {logged.loggedIn ? (
              <>
                <li className="ml-5">
                  <Link
                    to="/"
                    className="block text-white no-underline text-lg font-medium transition-transform duration-300 ease-in-out hover:text-text-colour hover:-translate-y-1"
                  >
                    Home
                  </Link>
                </li>
                <li className="ml-5">
                  <Link
                    to="/about"
                    className="block text-white no-underline text-lg font-medium transition-transform duration-300 ease-in-out hover:text-text-colour hover:-translate-y-1"
                  >
                    About
                  </Link>
                </li>
                <li className="ml-5">
                  <Link
                    to="/contact"
                    className="block text-white no-underline text-lg font-medium transition-transform duration-300 ease-in-out hover:text-text-colour hover:-translate-y-1"
                  >
                    Contact
                  </Link>
                </li>
                <li className="ml-5 relative group">
                  {/* Welcome Text */}
                  <p className="text-lg text-white font-bold cursor-pointer">
                    Welcome {logged.user?.userName} !!
                  </p>

                  {/* Dropdown Menu */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-primary border border-text-colour rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                      onClick={handleLogout}
                      to="/"
                      className="block px-4 py-2 text-sm font-medium text-white no-underline hover:bg-secondary hover:text-text-colour rounded-lg"
                    >
                      LOGOUT
                    </Link>
                  </div>
                </li>
              </>
            ) : (
              <li className="ml-5">
                <Link
                  to="/login"
                  className="block text-white no-underline text-lg font-medium transition-transform duration-300 ease-in-out hover:text-text-colour hover:-translate-y-1"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
