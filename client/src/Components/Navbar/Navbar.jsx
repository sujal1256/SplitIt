import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../Assets/logo.png";
import { checkUserLoggedIn } from "../../utils/userLoggedIn";
import { toast } from "react-toastify";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // Get the current location
  const logged = checkUserLoggedIn();

  const handleLogout = async () => {
    const response = await fetch("/api/v1/user/logout", {
      method: "POST",
      headers: { "Content-type": "application/json" },
    });
    const json = await response.json();

    if (response.ok) {
      toast.success("Logged out");
      window.location.href = "/";
    } else {
      toast.error("Error logging out");
    }
  };

  const getLinkClass = (path) =>
    location.pathname === path
      ? "block text-text-colour no-underline text-lg font-medium transition-transform duration-300 ease-in-out hover:-translate-y-1" // Highlighted link style
      : "block text-white no-underline text-lg font-medium transition-transform duration-300 ease-in-out hover:text-text-colour hover:-translate-y-1"; // Default link style

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

          <div className="flex justify-between items-stretch ">
          {/* Welcome Text */}
          {logged.loggedIn ? (
            <p className="text-base md:text-2xl text-text-colour font-bold cursor-pointer pt-1 pr-2">
              WELCOME {logged.user?.userName.toUpperCase()} !!
            </p>
          ) : null}

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
                  <Link to="/" className={getLinkClass("/")}>
                    Home
                  </Link>
                </li>
                <li className="ml-5">
                  <Link to="/about" className={getLinkClass("/about")}>
                    About
                  </Link>
                </li>
                <li className="ml-5">
                  <Link to="/contact" className={getLinkClass("/contact")}>
                    Contact
                  </Link>
                </li>
                <li className="ml-5">
                  <Link onClick={handleLogout}
                      to="/"
                      className={getLinkClass("/logOut")}>
                    LogOut
                  </Link>
                </li>
              </>
            ) : (
              <li className="ml-5">
                <Link to="/login" className={getLinkClass("/login")}>
                  Login
                </Link>
              </li>
            )}
          </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
