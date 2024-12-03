import React, { useEffect, useState } from "react";
import BgImg from "../Assets/backgroundLanding.jpg";
import { checkUserLoggedIn } from "../../utils/userLoggedIn.jsx";

function LandingPage() {
  const logged = checkUserLoggedIn();

  const [groups, setGroups] = useState();
  async function getGroups() {
    const response = await fetch("/api/v1/user/get-all-groups", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${logged.user?.userId}`,
      },
    });
    const data = await response.json();

    setGroups(data?.data);
  }

  useEffect(() => {
    getGroups();
  }, [logged]);

  // TODO: MODAL WINDOW IS NOT CLOSING
  return (
    <div className="relative min-h-screen overflow-y-hidden">
      {/* Background Image */}
      <div
        className="inset-0 bg-cover bg-center fixed -z-10"
        style={{
          backgroundImage: `url(${BgImg})`, // Use `url()` for the image
        }}
      ></div>

      {/* Overlay */}
      <div
        className="inset-0 bg-black bg-opacity-50 fixed -z-5 mt-16"
      ></div>

      {/* TODO: The scroller is visible...remove that */}
      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6 mt-20 "
      >
        <h1 className="text-4xl md:text-6xl font-bold flex justify-center mt-52">
          Welcome to SplitIt
        </h1>
        <p className="text-lg md:text-2xl mb-6 mt-5">
          Simplify your expenses, track payments, and stay organized
          effortlessly.
        </p>
        <button className="bg-amber-500 hover:bg-amber-900 text-white py-3 px-6 rounded-lg text-lg shadow-md">
          Get Started
        </button>
      </div>

      {/* Groups */}
      <div className="relative z-10 mt-10">
        {groups?.map((group) => {
          return <p key={group._id} className="text-white text-center">{group.groupName}</p>;
        })}
      </div>
    </div>
  );
}

export default LandingPage;
