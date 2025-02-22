import React, { useState } from "react";
import { toast } from "react-toastify";
import loginBack from "../Assets/loginBack.jpeg";
import { useNavigate, useSearchParams } from "react-router-dom";

const OTPLogin = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [searachParams] = useSearchParams();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP", {
        className: "toast-mobile",
      });
      return;
    }

    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/v1/user/verify-otp",
      {
        method: "POST",
        body: JSON.stringify({ otp, userEmail: searachParams.get("email") }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.message, {
        className: "toast-mobile",
      });
      return;
    }

    toast.success("OTP verified successfully!", {
      className: "toast-mobile",
    });

    navigate("/reset-password?email=" + searachParams.get("email")); // Redirect after successful OTP verification
  }

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${loginBack})`,
        backgroundSize: "cover",
      }}
    >
      <form className="w-full max-w-[420px] mx-auto bg-primary mb-10 p-10 rounded-lg shadow-lg text-white">
        <h1 className="text-3xl text-center">Enter OTP</h1>
        <p className="text-center mt-2 flex flex-col">
          <p>An OTP has been sent to</p>{" "}
          <strong>{searachParams.get("email")}</strong>
        </p>
        <div className="relative w-full h-12 my-7">
          <input
            type="number"
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
            required
            value={otp}
            className="w-full h-full bg-transparent border-white outline-none border-2 border-opacity-10 rounded-full text-lg text-white px-5 py-3 placeholder-white text-center"
          />
        </div>
        <button
          type="submit"
          className="w-full h-11 bg-white hover:bg-secondary border-none outline-none rounded-full shadow-lg cursor-pointer text-lg text-gray-800 font-bold mt-4"
          onClick={handleSubmit}
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OTPLogin;
