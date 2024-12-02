import React, { useState, useEffect } from "react";

function checkUserLoggedIn() {
  const [userLoggedIn, setUserLoggedIn] = useState({
  loggedIn: false,
    user: null,
  });

  async function getUser() {
    const response = await fetch("/api/v1/user/checkLoggedIn");
    const data = await response.json();
    setUserLoggedIn({
      userLoggedIn: data.statusCode >= 200 && data.statusCode < 300,
      user: data?.data,
    });
  }
  useEffect(() => {
    getUser();
  }, []);

  return userLoggedIn;
}

export { checkUserLoggedIn };
