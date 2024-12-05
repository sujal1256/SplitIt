import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope , FaPhone} from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import { toast } from "react-toastify";
import loginback from "../Assets/loginback.jpg"

function LoginRegister() {
  const [action, setAction] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPhone, setregisterPhone] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch("/api/v1/user/login", {
        
        method: "POST",
        body: JSON.stringify({
          userEmail: loginEmail,
          password: loginPassword,
        }), 
        headers: {
          "Content-Type": "application/json", 
        },
      });
      const data = await response.json();
      console.log(data);
            
      if (response.ok) {
        toast.success("Logged In successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("❌  Error in loggin In", error);
    }
  }

  //   TODO: Add phone number field and send it to backend
  async function handleRegister(e) {
    e.preventDefault();

    try {
      const response = await fetch("/api/v1/user/register", {
        // Fix typo in endpoint
        method: "POST",
        body: JSON.stringify({
          userName: registerUsername,
          userEmail: registerEmail,
          password: registerPassword,
          phoneNumber: registerPhone,
        }), // Serialize body as JSON
        headers: {
          "Content-Type": "application/json", // Add appropriate headers
        },
      });
      const data = await response.json();
      console.log(data);
            
      if (response.ok) {
        toast.success("Signed Up successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("❌ Error in registering", error);
    }
  }
  const registerLink = () => {
    setAction(" active");
  };

  const loginLink = () => {
    setAction("");
  };

  return (
    <>
      <div
        className="flex justify-center text-center pt-24 bg-cover bg-center"
      >
        <div
          className={`relative w-[420px] ${
            action === " active" ? "h-[520px]" : "h-[450px]"
          } bg-amber-500 backdrop-blur-lg rounded-lg shadow-lg text-white flex justify-center items-center overflow-hidden transition-height duration-200 ease-in-out`}
          >
          <div className="w-full p-10">
            <div
              className={`transition-transform duration-200 ease-in-out ${
                action === " active" ? "translate-x-[-400px]" : "translate-x-0"
              }`}
            >
              <form action="">
                <h1 className="text-3xl text-center">Login</h1>
                <div className="relative w-full h-12 my-7">
                  <input
                    type="text"
                    placeholder="Email"
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full h-full bg-transparent border-none outline-none border-2 border-opacity-10 rounded-full text-lg text-white px-5 py-3 placeholder-white"
                  />
                  <FaUser className="absolute right-5 top-1/2 transform -translate-y-1/2 text-lg" />
                </div>

                <div className="relative w-full h-12 my-7">
                  <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full h-full bg-transparent border-none outline-none border-2 border-opacity-10 rounded-full text-lg text-white px-5 py-3 placeholder-white"
                  />
                  <FaLock className="absolute right-5 top-1/2 transform -translate-y-1/2 text-lg" />
                </div>

                <div className="flex justify-between text-sm my-0 mx-0.5">
                  <label>
                    <input type="checkbox" className="accent-white mr-1" />
                    Remember me
                  </label>
                  <a
                    href="#"
                    className="text-white no-underline hover:underline"
                  >
                    Forgot Password
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-white border-none outline-none rounded-full shadow-lg cursor-pointer text-lg text-gray-800 font-bold mt-4"
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
            </div>

            <div
              className={`absolute transition-none ${
                action === " active"
                  ? "transform translate-x-[35px] translate-y-[-420px] pt-3"
                  : "transform translate-x-[400px]"
              }`}
            >
              <form action="">
                <h1 className="text-3xl text-center">Registration</h1>
                <div className="relative w-full h-8 my-7">
                  <input
                    type="text"
                    placeholder="Username"
                    onChange={(e) => {
                      setRegisterUsername(e.target.value);
                    }}
                    required
                    className="w-full h-full bg-transparent border-none outline-none border-2 border-opacity-10 rounded-full text-lg text-white px-5 py-3 placeholder-white"
                  />
                  <FaUser className="absolute right-5 top-1/2 transform -translate-y-1/2 text-lg" />
                </div>

                <div className="relative w-full h-8 my-7">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    onChange={(e) => {
                      setRegisterEmail(e.target.value);
                    }}
                    className="w-full h-full bg-transparent border-none outline-none border-2 border-opacity-10 rounded-full text-lg text-white px-5 py-3 placeholder-white"
                  />
                  <FaEnvelope className="absolute right-5 top-1/2 transform -translate-y-1/2 text-lg" />
                </div>

                <div className="relative w-full h-8 my-7">
                  <input
                    type="number"
                    placeholder="Phone Number"
                    onChange={(e) => {
                      setregisterPhone(e.target.value);
                    }}
                    required
                    className="w-full h-full bg-transparent border-none outline-none border-2 border-opacity-10 rounded-full text-lg text-white px-5 py-3 placeholder-white"
                  />
                  <FaPhone className="absolute right-5 top-1/2 transform -translate-y-1/2 text-lg" />
                </div>

                <div className="relative w-full h-8 my-7">
                  <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => {
                      setRegisterPassword(e.target.value);
                    }}
                    required
                    className="w-full h-full bg-transparent border-none outline-none border-2 border-opacity-10 rounded-full text-lg text-white px-5 py-3 placeholder-white"
                  />
                  <FaLock className="absolute right-5 top-1/2 transform -translate-y-1/2 text-lg" />
                </div>

                <div className="flex justify-start text-sm my-0 mx-0.5">
                  <label>
                    <input type="checkbox" className="accent-white mr-1" />I
                    agree to terms & conditions
                  </label>
                </div>

                <button
                  type="submit"
                  onClick={handleRegister}
                  className="w-full h-11 bg-white border-none outline-none rounded-full shadow-lg cursor-pointer text-lg text-gray-800 font-bold mt-4"
                >
                  Register
                </button>

                <div className="text-sm text-center my-5">
                  <p>
                    Already have an account?{" "}
                    <a
                      href="#"
                      onClick={loginLink}
                      className="text-white no-underline font-semibold hover:underline"
                    >
                      Login
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginRegister;
