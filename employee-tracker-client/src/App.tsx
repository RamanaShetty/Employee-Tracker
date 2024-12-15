import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import Employees from "./pages/Employees";
import Login from "./pages/Login";
import Assignwork from "./pages/Assignwork";
import "./App.css";
import Empsite from "./pages/empsite";
import Sites from "./pages/Sites";
import Works from "./pages/Works";
import { useAuth } from "./Contexts/authContext";
import Report from "./pages/Reports";

const AppContent: React.FC = () => {
  const location = useLocation();
  const { authUser } = useAuth();
  const roles = ['superAdmin', 'siteAdmin']

  const isLoginPage = location.pathname === "/";

  return (
    <div className="app">
      {!isLoginPage && <Sidebar />}
      <div className="main-container">
        {!isLoginPage && <TopNavbar />}
        <Routes>
          <Route path="/" element={(authUser && roles.includes(authUser.role))?<Navigate to={"/employees"}/>:<Login />} />
          <Route path="/employees" element={(authUser && roles.includes(authUser.role))?<Employees />:<Navigate to={"/"}/>} />
          <Route path="/sites" element={(authUser && roles.includes(authUser.role))?<Sites />:<Navigate to={"/"}/>} />
          <Route path="/assign" element={(authUser && roles.includes(authUser.role))?<Empsite />:<Navigate to={"/"}/>} />
          <Route path="/works" element={(authUser && roles.includes(authUser.role))?<Works />:<Navigate to={"/"}/>} />
          <Route path="/remarks" element={(authUser && roles.includes(authUser.role))?<Assignwork />:<Navigate to={"/"}/>} />
          <Route path="/reports" element={(authUser && roles.includes(authUser.role))?<Report />:<Navigate to={"/"}/>} />
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
