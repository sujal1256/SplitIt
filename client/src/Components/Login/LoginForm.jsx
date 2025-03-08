import React, { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { validateEmail } from "../../utils/regexCheck";
import { Link } from "react-router-dom";

function LoginForm() {
  const [loginUtil, setLoginUtils] = useState({
    loginEmail: "",
    loginPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    if (!loginUtil.loginEmail || !loginUtil.loginPassword) {
      toast.error("Please fill all the fields", {
        className: "toast-mobile",
      });
      return;
    }
    if (!validateEmail(loginUtil.loginEmail)) {
      toast.error("Please enter a valid email address", {
        className: "toast-mobile",
      });
      return;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/v1/user/login",
        {
          method: "POST",
          body: JSON.stringify({
            userEmail: loginUtil.loginEmail,
            password: loginUtil.loginPassword,
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
        document.cookie = `accessToken=${data?.data?.accessToken}`;
        localStorage.setItem("accessToken", data?.data?.accessToken);
        window.location.href = "/";
      } else {
        toast.error(data.message, {
          className: "toast-mobile",
        });
      }
    } catch (error) {
      console.log("❌  Error in loggin In", error);
    }
  }

  return (
    <div className="flex justify-center items-center bg-cover bg-center min-h-screen bg-[#131623]">
      <div className="w-full max-w-xl px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Log <span className="text-[#FF8333]">In</span>
          </h1>
          <p className="text-gray-300">
            Welcome back to SplitIt! Track and manage your expenses
          </p>
        </div>

        <div className="bg-[#1D2232] rounded-lg shadow-xl p-6 md:p-8">
          <form action="">
            <div className="relative w-full mb-6">
              <input
                type="text"
                placeholder="Email"
                onChange={(e) =>
                  setLoginUtils({
                    ...loginUtil,
                    loginEmail: e.target.value,
                  })
                }
                required
                value={loginUtil.loginEmail}
                className="w-full h-12 bg-[#131623] border-[#2A2F45] outline-none border-2 rounded-lg text-white px-5 py-3 placeholder-gray-400"
              />
              <FaEnvelope className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="relative w-full mb-6">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={loginUtil.loginPassword}
                onChange={(e) => {
                  setLoginUtils({
                    ...loginUtil,
                    loginPassword: e.target.value,
                  });
                }}
                required
                className="w-full h-12 bg-[#131623] border-[#2A2F45] outline-none border-2 rounded-lg text-white px-5 py-3 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center text-gray-300 text-sm">
                <input 
                  type="checkbox" 
                  className="mr-2 h-4 w-4 accent-[#FF8333]" 
                />
                Remember me
              </label>
              <Link
                to={"/changepassword?" + "email=" + loginUtil?.loginEmail}
                className="text-[#FF8333] text-sm hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#FF8333] hover:bg-[#E67321] transition-colors duration-300 border-none outline-none rounded-lg shadow-lg cursor-pointer text-white font-bold text-lg"
              onClick={handleLogin}
            >
              Log In
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-300">
                Don't have an account?{" "}
                <Link
                  to={"/signup"}
                  className="text-[#FF8333] font-semibold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;