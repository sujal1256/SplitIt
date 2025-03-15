import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleResetPassword(e) {
    e.preventDefault();
    setLoading(true);

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields", { className: "toast-mobile" });
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", { className: "toast-mobile" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/v1/user/reset-password",
        {
          method: "POST",
          body: JSON.stringify({ userEmail: email, newPassword }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successfully", { className: "toast-mobile" });
        navigate("/login");
      } else {
        toast.error(data.message, { className: "toast-mobile" });
      }
    } catch (error) {
      console.log("❌ Error in resetting password", error);
      toast.error("Something went wrong. Try again.", { className: "toast-mobile" });
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1A1E2B]">
      <div className="w-full max-w-[420px] mx-auto p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-400">Create a new password for your account</p>
        </div>
        
        <form className="bg-[#242A3A] p-6 rounded-lg shadow-lg">
          {email && (
            <div className="mb-4">
              <div className="bg-[#1A1E2B] p-3 rounded-lg border border-gray-700 mb-5">
                <p className="text-gray-400 text-sm">Resetting password for:</p>
                <p className="text-white font-medium truncate">{email}</p>
              </div>
            </div>
          )}
          
          <div className="relative w-full mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
              required
              value={newPassword}
              className="w-full bg-[#1A1E2B] text-white border border-gray-700 rounded-lg pl-10 py-3 focus:outline-none focus:border-[#FF6B35]"
            />
            <div 
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {!showNewPassword ? (
                <FaEyeSlash className="text-gray-400" />
              ) : (
                <FaEye className="text-gray-400" />
              )}
            </div>
          </div>

          <div className="relative w-full mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              value={confirmPassword}
              className="w-full bg-[#1A1E2B] text-white border border-gray-700 rounded-lg pl-10 py-3 focus:outline-none focus:border-[#FF6B35]"
            />
            <div 
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {!showConfirmPassword ? (
                <FaEyeSlash className="text-gray-400" />
              ) : (
                <FaEye className="text-gray-400" />
              )}
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 bg-[#FF6B35] hover:bg-[#FF7F50] transition-colors duration-200 text-white font-bold rounded-lg ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            <a href="/login" className="text-[#FF6B35] hover:underline">
              Back to login page
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;