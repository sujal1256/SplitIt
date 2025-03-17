import React, { useEffect, useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import { validateEmail } from "../../utils/regexCheck";
import { useNavigate, useSearchParams } from "react-router-dom";

function InviteMember() {
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("q");
  const email = searchParams.get("email") || "";
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true); // Added state for checking user
  const [existingUser, setExistingUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function handleCheckExistingUser() {
      if (!email) {
        toast.error("Something went wrong", { className: "toast-mobile" });
        setCheckingUser(false);
        return;
      }
      try {
        setCheckingUser(true);
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/user/check-user?email=${encodeURIComponent(email)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();
        console.log(data);

        if (response.status >= 200 && response.status < 300) {
          setExistingUser(true);
          setName(data?.data.userName);
        } else {
          setExistingUser(false);
        }
      } catch (error) {
        console.log(error.message);
        setExistingUser(false);
      } finally {
        setCheckingUser(false);
      }
    }

    handleCheckExistingUser();
  }, [email]);

  async function handleInviteMember(e) {
    e.preventDefault();
    setLoading(true);

    if (!existingUser && (!name || !password || !email)) {
      toast.error("Please fill all fields", { className: "toast-mobile" });
      setLoading(false);
      return;
    }

    if (existingUser && !email) {
      toast.error("Email is required", { className: "toast-mobile" });
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Invalid email address", { className: "toast-mobile" });
      setLoading(false);
      return;
    }

    try {
      const payload = existingUser
        ? { groupId, email, name }
        : { groupId, name, email, password };

      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/v1/group/store-invited-user",
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();

      if (response.ok) {
        toast.success("Added to Group", {
          className: "toast-mobile",
        });
        navigate("/login");
      } else {
        toast.error(data.message, { className: "toast-mobile" });
      }
    } catch (error) {
      console.log("❌ Error inviting member", error);
      toast.error("Something went wrong. Try again.", {
        className: "toast-mobile",
      });
    }
    setLoading(false);
  }

  // Show loader while checking user existence
  if (checkingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1A1E2B]">
        <div className="w-full max-w-[420px] mx-auto p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6B35] mx-auto"></div>
          <p className="text-white mt-4">Checking user information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1A1E2B]">
      <div className="w-full max-w-[420px] mx-auto p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Join Group</h1>
          {!existingUser ? (
            <p className="text-gray-400">
              Create your account to join the group
            </p>
          ) : (
            <p className="text-gray-400">
              Join this group with your existing account
            </p>
          )}
        </div>

        {!existingUser ? (
          <form className="bg-[#242A3A] p-6 rounded-lg shadow-lg">
            <div className="relative w-full mb-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                required
                value={name}
                className="w-full bg-[#1A1E2B] text-white border border-gray-700 rounded-lg pl-10 py-3 focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            <div className="relative w-full mb-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="text"
                value={email}
                disabled
                placeholder="Email"
                className="w-full bg-[#1A1E2B] text-gray-400 border border-gray-700 rounded-lg pl-10 py-3"
              />
            </div>

            <div className="relative w-full mb-6">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                value={password}
                className="w-full bg-[#1A1E2B] text-white border border-gray-700 rounded-lg pl-10 py-3 focus:outline-none focus:border-[#FF6B35]"
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? (
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
              onClick={handleInviteMember}
              disabled={loading}
            >
              {loading ? "Processing..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <div className="bg-[#242A3A] p-6 rounded-lg shadow-lg">
            <div className="bg-[#1A1E2B] p-4 rounded-lg mb-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[#FF6B35] rounded-full p-2">
                  <FaUser className="text-white" />
                </div>
                <p className="text-white font-medium">{name}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#FF6B35] rounded-full p-2">
                  <FaEnvelope className="text-white" />
                </div>
                <p className="text-white font-medium">{email}</p>
              </div>
            </div>

            <button
              className={`w-full py-3 bg-[#FF6B35] hover:bg-[#FF7F50] transition-colors duration-200 text-white font-bold rounded-lg ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              onClick={handleInviteMember}
              disabled={loading}
            >
              {loading ? "Processing..." : "Join Group"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InviteMember;
