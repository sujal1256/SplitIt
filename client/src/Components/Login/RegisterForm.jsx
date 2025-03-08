import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { validateEmail, validatePhoneNumber } from "../../utils/regexCheck";
import { Link, useNavigate } from "react-router-dom";

function RegisterForm() {
  const [registerUtil, setRegisterUtils] = useState({
    registerUsername: "",
    registerEmail: "",
    registerPhone: "",
    registerPassword: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    if (
      !registerUtil.registerUsername ||
      !registerUtil.registerEmail ||
      !registerUtil.registerPhone ||
      !registerUtil.registerPassword
    ) {
      toast.error("Please fill all the fields", {
        className: "toast-mobile",
      });
      return;
    }

    if (!validatePhoneNumber(registerUtil.registerPhone)) {
      toast.error("Please enter a valid phone number", {
        className: "toast-mobile",
      });
      return;
    }
    if (!validateEmail(registerUtil.registerEmail)) {
      toast.error("Please enter a valid email address", {
        className: "toast-mobile",
      });
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the terms of service", {
        className: "toast-mobile",
      });
      return;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/v1/user/register",
        {
          method: "POST",
          body: JSON.stringify({
            userName: registerUtil.registerUsername,
            userEmail: registerUtil.registerEmail,
            password: registerUtil.registerPassword,
            phoneNumber: registerUtil.registerPhone,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        toast.success("Signed Up successfully", {
          className: "toast-mobile",
        });
        navigate("/login");
      } else {
        toast.error(data.message, {
          className: "toast-mobile",
        });
      }
    } catch (error) {
      console.log("❌ Error in registering", error);
    }
  }

  return (
    <div className="flex justify-center items-center bg-cover bg-center min-h-screen bg-[#131623]">
      <div className="w-full max-w-xl px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sign <span className="text-[#FF8333]">Up</span>
          </h1>
          <p className="text-gray-300">
            Join SplitIt to start tracking and managing expenses with friends
          </p>
        </div>

        <div className="bg-[#1D2232] rounded-lg shadow-xl p-6 md:p-8">
          <form action="">
            <div className="relative w-full mb-6">
              <input
                type="text"
                placeholder="Username"
                value={registerUtil.registerUsername}
                onChange={(e) => {
                  setRegisterUtils({
                    ...registerUtil,
                    registerUsername: e.target.value,
                  });
                }}
                required
                className="w-full h-12 bg-[#131623] border-[#2A2F45] outline-none border-2 rounded-lg text-white px-5 py-3 placeholder-gray-400"
              />
              <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="relative w-full mb-6">
              <input
                type="email"
                placeholder="Email"
                required
                value={registerUtil.registerEmail}
                onChange={(e) => {
                  setRegisterUtils({
                    ...registerUtil,
                    registerEmail: e.target.value,
                  });
                }}
                className="w-full h-12 bg-[#131623] border-[#2A2F45] outline-none border-2 rounded-lg text-white px-5 py-3 placeholder-gray-400"
              />
              <FaEnvelope className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="relative w-full mb-6">
              <input
                type="number"
                placeholder="Phone Number"
                value={registerUtil.registerPhone}
                onChange={(e) => {
                  setRegisterUtils({
                    ...registerUtil,
                    registerPhone: e.target.value,
                  });
                }}
                required
                className="w-full h-12 bg-[#131623] border-[#2A2F45] outline-none border-2 rounded-lg text-white px-5 py-3 placeholder-gray-400"
              />
              <FaPhone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="relative w-full mb-6">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={registerUtil.registerPassword}
                onChange={(e) => {
                  setRegisterUtils({
                    ...registerUtil,
                    registerPassword: e.target.value,
                  });
                }}
                className="w-full h-12 bg-[#131623] border-[#2A2F45] outline-none border-2 rounded-lg text-white px-5 py-3 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="terms"
                className="mr-2 h-4 w-4 accent-[#FF8333]"
                onChange={() => setAgreedToTerms(!agreedToTerms)}
              />
              <label htmlFor="terms" className="text-gray-300 text-sm">
                I agree to the{" "}
                <a href="#" className="text-[#FF8333] hover:underline">
                  Terms of Service
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#FF8333] hover:bg-[#E67321] transition-colors duration-300 border-none outline-none rounded-lg shadow-lg cursor-pointer text-white font-bold text-lg"
              onClick={handleRegister}
            >
              Sign Up
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#FF8333] font-semibold hover:underline"
                >
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;