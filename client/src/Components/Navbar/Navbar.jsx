import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addUser, removeUser } from "../../redux/user.slice";
import { checkUserLoggedIn } from "../../utils/userLoggedIn";
import LogoutConfirmationDialog from "./LogoutConfirmationDialog";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [showPasswordToast, setShowPasswordToast] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  const handleLogoutClick = () => {
    setIsLogoutConfirmOpen(true);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsLogoutConfirmOpen(false);
    
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/v1/user/logout",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
      }
    );
    const json = await response.json();

    if (response.ok) {
      toast.success("Logged out", {
        className: "toast-mobile",
      });
      localStorage.removeItem("accessToken");
      document.cookie =
        "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      localStorage.removeItem("logged");
      dispatch(removeUser());

      window.location.href = "/";
    } else {
      toast.error("Error logging out", {
        className: "toast-mobile",
      });
    }
  };

  useEffect(() => {
    if (searchParams.get("passwordSent") === "true" && !showPasswordToast) {
      toast.success("Password is sent to your email", {
        className: "toast-mobile",
      });
      setShowPasswordToast(true);
    }

    // const handleClickOutside = (event) => {
    //   if (menuRef.current && !menuRef.current.contains(event.target)) {
    //     setIsMenuOpen(false);
    //   }
    // };

    // document.addEventListener("mousedown", handleClickOutside);
    // return () => {
    //   document.removeEventListener("mousedown", handleClickOutside);
    // };
  }, [searchParams, showPasswordToast]);

  useEffect(() => {
    async function saveLogged() {
      try {
        const logged = await checkUserLoggedIn();
        localStorage.setItem("logged", JSON.stringify(logged));
        dispatch(addUser(logged));
      } catch (error) {
        console.error("Error saving logged state:", error);
      }
    }

    saveLogged();
    const interval = setInterval(() => {
      saveLogged();
    }, 300000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const logged = user.user;

  return (
    <>
      <nav className="py-4 px-6 bg-[#0d121f] border-b border-gray-800">
        <div className="mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-orange-400">Split<span className="text-white">It</span></span>
          </Link>
          
          {/* Center Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-white hover:text-orange-400 transition duration-300">Home</Link>
            <Link to="/about" className="text-white hover:text-orange-400 transition duration-300">About</Link>
          </div>
          
          {/* Authentication Buttons */}
          <div className="flex items-center space-x-4">
            {logged?.loggedIn ? (
              <>
                <p className="hidden md:block text-white font-medium mr-4">
                  Welcome, {logged.user?.userName}!
                </p>
                <button 
                  onClick={handleLogoutClick}
                  className="text-white hover:text-orange-400 transition duration-300"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-orange-400 transition duration-300">Log In</Link>
                <Link 
                  to="/signup" 
                  className="px-6 py-2 border border-orange-400 rounded text-orange-400 hover:bg-orange-400 hover:text-white transition duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            ref={menuRef}
          >
            ☰
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-[#0d121f] p-4 rounded-md">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-white hover:text-orange-400 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-white hover:text-orange-400 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {logged?.loggedIn ? (
                <button 
                  onClick={handleLogoutClick}
                  className="text-white hover:text-orange-400 transition duration-300 text-left"
                >
                  Log Out
                </button>
              ) : (
                <Link 
                  to="/login" 
                  className="text-white hover:text-orange-400 transition duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmationDialog 
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Navbar;