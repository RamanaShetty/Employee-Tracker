import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import Employees from "./pages/Employees";
// import Sites from "./pages/Sites";
import Login from "./pages/Login";
import "./App.css";
import Empsite from "./pages/empsite";
import Sites from "./pages/Employees";

const AppContent: React.FC = () => {
  const location = useLocation();

  const isLoginPage = location.pathname === "/";

  return (
    <div className="app">
      {!isLoginPage && <Sidebar />}
      <div className="main-container">
        {!isLoginPage && <TopNavbar />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/assign-site" element={<Empsite />} />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
    
    
   
  );
};

export default App;
