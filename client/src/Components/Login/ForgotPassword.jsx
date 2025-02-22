import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import { validateEmail } from "../../utils/regexCheck";
import loginBack from "../Assets/loginBack.jpeg";
import { useNavigate, useSearchParams } from "react-router-dom";

function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleForgotPassword(e) {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      toast.error("Please enter your email", { className: "toast-mobile" });
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address", {
        className: "toast-mobile",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/v1/user/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({ userEmail: email }),
          headers: { "Content-Type": "application/json" },
        }
      );      
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        toast.success("OTP sent to your email", { className: "toast-mobile" });

        // ✅ Navigate only after successful OTP request
        setLoading(false);
        navigate(`otp?email=${email}`);
      } else {
        toast.error(data.message, { className: "toast-mobile" });
      }
    } catch (error) {
      console.log("❌ Error in sending reset link", error);
      toast.error("Something went wrong. Try again.", {
        className: "toast-mobile",
      });
    }
  }

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBack})`, backgroundSize: "cover" }}
    >
      <form
        action=""
        className="w-full max-w-[420px] mx-auto bg-primary mb-10 p-10 rounded-lg shadow-lg text-white"
      >
        <h1 className="text-3xl text-center">Forgot Password</h1>
        <div className="relative w-full h-12 my-7">
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            value={email}
            className="w-full h-full bg-transparent border-white outline-none border-2 border-opacity-10 rounded-full text-lg text-white px-5 py-3 placeholder-white"
          />
          <FaUser className="absolute right-5 top-1/2 transform -translate-y-1/2 text-lg text-white" />
        </div>
        <button
          type="submit"
          className={`w-full h-11 bg-white hover:bg-secondary border-none outline-none rounded-full shadow-lg cursor-pointer text-lg text-gray-800 font-bold mt-4 ${
            loading ? "opacity-50" : "opacity-100"
          }`}
          onClick={handleForgotPassword}
          disabled={loading}
        >
          Send OTP
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
