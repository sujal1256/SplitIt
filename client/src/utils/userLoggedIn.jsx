import { useState, useEffect } from "react";

function checkUserLoggedIn() {
  const [userLoggedIn, setUserLoggedIn] = useState({
    loggedIn: false,
    user: null,
  });

  async function getUser() {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/v1/user/checkLoggedIn",
      {
        method: "GET",
        // credentials: "include",
        headers: {
          "authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    const data = await response.json();
    setUserLoggedIn({
      loggedIn: data.statusCode >= 200 && data.statusCode < 300,
      user: data?.data,
    });
  }
  useEffect(() => {
    getUser();
  }, []);

  return userLoggedIn;
}

export { checkUserLoggedIn };
