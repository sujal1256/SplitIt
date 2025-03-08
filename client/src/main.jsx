import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { Analytics } from "@vercel/analytics/react";
import "react-loading-skeleton/dist/skeleton.css";

import { store } from "./redux/store.js";
import { SkeletonTheme } from "react-loading-skeleton";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <Analytics />
      <ToastContainer />
      <SkeletonTheme baseColor="#bdbdbd00" highlightColor="#d6d8da">
        <App />
      </SkeletonTheme>
    </StrictMode>
  </Provider>
);
