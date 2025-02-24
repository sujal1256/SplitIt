import React, { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { validateEmail } from "../../utils/regexCheck";
import loginBack from "../Assets/loginBack.jpeg";
import { useNavigate, useSearchParams } from "react-router-dom";

function InviteMember() {
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("q");
  const email = searchParams.get("email") || "";
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleInviteMember(e) {
    e.preventDefault();
    setLoading(true);

    if (!name || !password || !email) {
      toast.error("Please fill all fields", { className: "toast-mobile" });
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Invalid email address", { className: "toast-mobile" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/v1/group/store-invited-user",
        {
          method: "POST",
          body: JSON.stringify({ groupId, name, email, password }),
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response);
      
      const data = await response.json();
      console.log(data);

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

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBack})`, backgroundSize: "cover" }}
    >
      <form className="w-full max-w-[420px] mx-auto bg-primary mb-10 p-10 rounded-lg shadow-lg text-white">
        <h1 className="text-3xl text-center">Signup</h1>

        <div className="relative w-full h-12 my-4">
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
            value={name}
            className="w-full h-full bg-transparent border-white outline-none border-2 border-opacity-10 rounded-full text-lg text-white px-5 py-3 placeholder-white"
          />
          <FaUser className="absolute right-5 top-1/2 transform -translate-y-1/2 text-lg text-white" />
        </div>

        <div className="relative w-full h-12 my-4">
          <input
            type="text"
            value={email}
            disabled
            placeholder="Email"
            className="w-full h-full bg-dark border-white outline-none border-2 border-opacity-10 rounded-full text-lg px-5 py-3 "
          />
        </div>

        <div className="relative w-full h-12 my-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            value={password}
            className="w-full h-full bg-transparent border-white outline-none border-2 border-opacity-10 rounded-full text-lg text-white px-5 py-3 placeholder-white"
          />
          {showPassword ? (
            <FaEyeSlash
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-lg text-white cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <FaEye
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-lg text-white cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        <button
          type="submit"
          className={`w-full h-11 bg-white hover:bg-secondary border-none outline-none rounded-full shadow-lg cursor-pointer text-lg text-gray-800 font-bold mt-4 ${
            loading ? "opacity-50" : "opacity-100"
          }`}
          onClick={handleInviteMember}
          disabled={loading}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default InviteMember;
