import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginRegister from "../src/Components/Login/LoginRegister.jsx";
import Dashboard from "../src/Components/Dashboard/Dashboard.jsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./Components/LandingPage/LandingPage.jsx";
import About from "./Components/About/About.jsx";
import { checkUserLoggedIn } from "./utils/userLoggedIn.jsx";
import AddGroups from "./Components/AddGroups/AddGroups.jsx";
import NewGroup from "./Components/NewGroup/NewGroup.jsx";
import { Provider } from 'react-redux';
import { store } from "./redux/store.js";
function App() {
  const logged = checkUserLoggedIn();
  console.log("logged", logged);
  
  return (
    <Provider store = {store}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route
              path="/"
              element={!logged.loggedIn ? <LandingPage /> : <AddGroups />}
            />
            <Route path="login" element={<LoginRegister />} />
            <Route path="about" element={<About />} />
            <Route path="group" element={<NewGroup />} />
          </Route>
        </Routes>
      </Router>
    </Provider>

  );
}

export default App;
