import React, { useState } from "react";
import loginBack from "../Assets/loginBack.jpeg";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function LoginRegister() {
  const [action, setAction] = useState("");

  const registerLink = () => {
    setAction(" active");
  };

  const loginLink = () => {
    setAction("");
  };

  return (
    <div
      className="flex justify-center items-center bg-cover bg-center min-h-screen"
    >
      <div
        className={`relative w-full max-w-[420px] ${
          action === " active" ? "h-[520px]" : "h-[450px]"
        } bg-primary backdrop-blur-lg rounded-lg shadow-lg text-white flex justify-center items-center overflow-hidden transition-height duration-200 ease-in-out`}
      >
        <div className="w-full p-10">
          <div
            className={`transition-transform duration-200 ease-in-out ${
              action === " active" ? "translate-x-[-400px]" : "translate-x-0"
            }`}
          >
            <LoginForm registerLink={registerLink} />
          </div>
          <div
            className={`absolute transition-none ${
              action === " active"
                ? "transform translate-x-[35px] translate-y-[-420px] pt-3"
                : "transform translate-x-[400px]"
            }`}
          >
            <RegisterForm loginLink={loginLink} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;
