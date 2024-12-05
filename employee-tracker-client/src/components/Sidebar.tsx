import React from "react";
// import { Link } from 'react-router-dom';
import profile from "../assets/profile.png";
import logo from "../assets/logo.png";
import { InfoIconSideBar, SearchIconSideBar } from "./Icons";
import "../styles/Sidebar.css";
const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-one">
        <img className="logo-image" src={logo} alt="Logo" />
        <div className="sidebar-options">
          <InfoIconSideBar />
          <SearchIconSideBar />
        </div>
      </div>
      <div className="sidebar-two">
        <img className="profile-image" src={profile} />
      </div>
    </div>
  );
};

export default Sidebar;
