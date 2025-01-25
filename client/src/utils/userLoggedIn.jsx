async function checkUserLoggedIn() {
  try {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/v1/user/checkLoggedIn",
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    const data = await response.json();

    return {
      loggedIn: data.statusCode >= 200 && data.statusCode < 300,
      user: data?.data || null,
    };
  } catch (error) {
    console.error("Error checking user login:", error);
    return {
      loggedIn: false,
      user: null,
    };
  }
}

export { checkUserLoggedIn };
