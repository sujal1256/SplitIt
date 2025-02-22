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

function RegisterForm({ loginLink }) {
  const [registerUtil, setRegisterUtils] = useState({
    registerUsername: "",
    registerEmail: "",
    registerPhone: "",
    registerPassword: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        loginLink();
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
    <form action="">
      <h1 className="text-3xl text-center p-2">Registration</h1>
      <div className="relative w-full h-8 my-7">
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
          className="w-full h-full bg-transparent border-white outline-none border-2 border-opacity-10 rounded-full text-lg text-white p-5 placeholder-white"
        />
        <FaUser className="absolute right-5 top-1/2 transform -translate-y-1/2 text-lg" />
      </div>

      <div className="relative w-full h-8 my-7">
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
          className="w-full h-full bg-transparent border-white outline-none border-2 border-opacity-10 rounded-full text-lg text-white p-5 placeholder-white"
        />
        <FaEnvelope className="absolute right-5 top-1/2 transform -translate-y-1/2 text-lg" />
      </div>

      <div className="relative w-full h-8 my-7">
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
          className="w-full h-full bg-transparent border-white outline-none border-2 border-opacity-10 rounded-full text-lg text-white p-5 placeholder-white"
        />
        <FaPhone className="absolute right-5 top-1/2 transform -translate-y-1/2 text-lg" />
      </div>

      <div className="relative w-full h-8 my-7">
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
          className="w-full h-full bg-transparent border-white outline-none border-2 border-opacity-10 rounded-full text-lg text-white p-5 placeholder-white"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-5 top-1/2 transform -translate-y-1/2 text-lg text-white"
        >
          {showPassword ? (
            <FaEye className="text-white my-full" />
          ) : (
            <FaEyeSlash className="text-white" />
          )}
        </button>
      </div>

      <div className="flex justify-between text-sm my-0 mx-0.5">
        <label>
          <input
            type="checkbox"
            className="accent-white mr-1"
            onChange={() => setAgreedToTerms(!agreedToTerms)}
          />
          I agree to the Terms of Service
        </label>
      </div>

      <button
        type="submit"
        className="w-full h-11 bg-white hover:bg-secondary border-none outline-none rounded-full shadow-lg cursor-pointer text-lg text-gray-800 font-bold mt-4"
        onClick={handleRegister}
      >
        Register
      </button>
      <div className="text-sm text-center my-5">
        <p>
          Already have an account?{" "}
          <a
            href="#"
            onClick={loginLink}
            className="text-white no-underline font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </form>
  );
}

export default RegisterForm;
