import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import { validateEmail } from "../../utils/regexCheck";
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

      if (response.ok) {
        toast.success("OTP sent to your email", { className: "toast-mobile" });
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
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1A1E2B]">
      <div className="w-full max-w-[420px] mx-auto p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
          <p className="text-gray-400">Enter your email to receive a verification code</p>
        </div>
        
        <form className="bg-[#242A3A] p-6 rounded-lg shadow-lg">
          <div className="relative w-full mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
              value={email}
              className="w-full bg-[#1A1E2B] text-white border border-gray-700 rounded-lg pl-10 py-3 focus:outline-none focus:border-[#FF6B35]"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 bg-[#FF6B35] hover:bg-[#FF7F50] transition-colors duration-200 text-white font-bold rounded-lg ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={handleForgotPassword}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Remember your password?{" "}
            <a href="/login" className="text-[#FF6B35] hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;