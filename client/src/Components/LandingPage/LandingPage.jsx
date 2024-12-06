import React from "react";
import BgImg from "../Assets/backgroundLanding.jpg";


function LandingPage() {
  
  
   return (
    <div className="relative ">
      {/* Background Image */}
      <div
        className="inset-0 bg-cover bg-center fixed -z-10"
        style={{
          backgroundImage: `url(${BgImg})`, // Use `url()` for the image
        }}
      ></div>

      {/* Overlay */}
      <div
        className="inset-0 bg-black bg-opacity-50 fixed -z-5 mt-16 pb-9"
      ></div>

      {/* TODO: The scroller is visible...remove that */}
      
      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6 mt-56 gap-3 overflow-hidden ">
        <h1 className="text-4xl md:text-6xl font-bold flex justify-center">
          Welcome to SplitIt
        </h1>
        <p className="text-lg md:text-2xl ">
          Simplify your expenses, track payments, and stay organized
          effortlessly.
        </p>
        <button className="bg-primary hover:bg-Accent text-white py-3 px-6 rounded-lg text-lg shadow-md">
          Get Started
        </button>
      </div>

      
    </div>
  );
}

export default LandingPage;
