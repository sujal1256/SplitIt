import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import loginBack from "../Assets/loginBack.jpeg";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBack})`, backgroundSize: "cover" }}
    >
      <form className="w-full max-w-[420px] mx-auto bg-primary mb-10 p-10 rounded-lg shadow-lg text-white">
        <h1 className="text-3xl text-center">Reset Password</h1>
        <div className="relative w-full h-12 my-7">
          <input
            type="password"
            placeholder="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
            required
            value={newPassword}
            className="w-full h-full bg-transparent border-white outline-none border-2 border-opacity-10 rounded-full text-lg text-white px-5 py-3 placeholder-white"
          />
          <FaLock className="absolute right-5 top-1/2 transform -translate-y-1/2 text-lg text-white" />
        </div>
        <div className="relative w-full h-12 my-7">
          <input
            type="password"
            placeholder="Confirm New Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            value={confirmPassword}
            className="w-full h-full bg-transparent border-white outline-none border-2 border-opacity-10 rounded-full text-lg text-white px-5 py-3 placeholder-white"
          />
          <FaLock className="absolute right-5 top-1/2 transform -translate-y-1/2 text-lg text-white" />
        </div>
        <button
          type="submit"
          className={`w-full h-11 bg-white hover:bg-secondary border-none outline-none rounded-full shadow-lg cursor-pointer text-lg text-gray-800 font-bold mt-4 ${
            loading ? "opacity-50" : "opacity-100"
          }`}
          onClick={handleResetPassword}
          disabled={loading}
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
