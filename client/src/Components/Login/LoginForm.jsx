import React, { useState } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { validateEmail } from "../../utils/regexCheck";
import { Link } from "react-router-dom";

function LoginForm({ registerLink }) {
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
    <form action="">
      <h1 className="text-3xl text-center">Login</h1>
      <div className="relative w-full h-12 my-7">
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
          className="w-full h-full bg-transparent border-white outline-none border-2 border-opacity-10 rounded-full text-lg text-white px-5 py-3 placeholder-white"
        />
        <FaUser className="absolute right-5 top-1/2 transform -translate-y-1/2 text-lg" />
      </div>
      <div className="relative w-full h-12 my-7">
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
          className="w-full h-full bg-transparent border-white outline-none border-2 border-opacity-10 rounded-full text-lg text-white px-5 py-3 placeholder-white"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-5 top-1/2 transform -translate-y-1/2 text-lg text-white"
        >
          {showPassword ? (
            <FaEye className="text-white" />
          ) : (
            <FaEyeSlash className="text-white" />
          )}
        </button>
      </div>
      <div className="flex justify-between text-sm my-0 mx-0.5">
        <label>
          <input type="checkbox" className="accent-white mr-1" />
          Remember me
        </label>
        <Link to={"/changepassword?" + "email=" + loginUtil?.loginEmail} className="text-white no-underline hover:underline">
          Forgot Password
        </Link>
      </div>
      <button
        type="submit"
        className="w-full h-11 bg-white hover:bg-secondary border-none outline-none rounded-full shadow-lg cursor-pointer text-lg text-gray-800 font-bold mt-4"
        onClick={handleLogin}
      >
        Login
      </button>
      <div className="text-sm text-center my-5">
        <p>
          Don't have an account?{" "}
          <a
            href="#"
            onClick={registerLink}
            className="text-white no-underline font-semibold hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </form>
  );
}

export default LoginForm;
