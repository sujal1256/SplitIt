import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginRegister from "../src/Components/Login/LoginRegister.jsx";
import Layout from "./Components/Layout/Layout.jsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./Components/LandingPage/LandingPage.jsx";
import About from "./Components/About/About.jsx";
import Contact from "./Components/Contact/Contact.jsx";
import Groups from "./Components/UserDashBoard/Groups.jsx";
import GroupDetails from "./Components/Group/GroupDetails.jsx";
import { useSelector } from "react-redux";



function App() {
   const user = useSelector((store)=>store.user);
   const logged = user.user;  

  return (
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              path="/"
              element={!logged?.loggedIn ? <LandingPage /> : <Groups />}
            />
            <Route path="login" element={<LoginRegister />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="group" element={<GroupDetails />} />
          </Route>
        </Routes>
      </Router>
  );
}

export default App;
