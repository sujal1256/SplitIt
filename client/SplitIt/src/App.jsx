import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginRegister from '../src/Components/Login/LoginRegister.jsx'
import Dashboard from '../src/Components/Dashboard/Dashboard.jsx'
import './index.css'
function App() {

  return (
    <Router> 
      <Routes> 
        <Route path="/login" element={<LoginRegister />} /> 
        <Route path="/" element={<Dashboard />} /> 
        </Routes> 
        </Router>
  )
}

export default App
