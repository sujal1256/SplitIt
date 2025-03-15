import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaKey } from "react-icons/fa";

const OTPLogin = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    if (!otp) {
      toast.error("Please enter the OTP", {
        className: "toast-mobile",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/v1/user/verify-otp",
        {
          method: "POST",
          body: JSON.stringify({ otp, userEmail: email }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data.message, {
          className: "toast-mobile",
        });
        setLoading(false);
        return;
      }

      toast.success("OTP verified successfully!", {
        className: "toast-mobile",
      });

      navigate("/reset-password?email=" + email);
    } catch (error) {
      console.log("❌ Error verifying OTP", error);
      toast.error("Something went wrong. Try again.", {
        className: "toast-mobile",
      });
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1A1E2B]">
      <div className="w-full max-w-[420px] mx-auto p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Verify OTP</h1>
          <p className="text-gray-400">
            Enter the verification code sent to your email
          </p>
        </div>
        
        <form className="bg-[#242A3A] p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <div className="bg-[#1A1E2B] p-3 rounded-lg border border-gray-700 mb-5">
              <p className="text-gray-400 text-sm">Code sent to:</p>
              <p className="text-white font-medium truncate">{email}</p>
            </div>
          </div>
          
          <div className="relative w-full mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaKey className="text-gray-400" />
            </div>
            <input
              type="number"
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
              required
              value={otp}
              className="w-full bg-[#1A1E2B] text-white border border-gray-700 rounded-lg pl-10 py-3 focus:outline-none focus:border-[#FF6B35] text-center"
              maxLength="6"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 bg-[#FF6B35] hover:bg-[#FF7F50] transition-colors duration-200 text-white font-bold rounded-lg ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Didn't receive the code?{" "}
            <a href={`/forgot-password?email=${email}`} className="text-[#FF6B35] hover:underline">
              Resend OTP
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPLogin;