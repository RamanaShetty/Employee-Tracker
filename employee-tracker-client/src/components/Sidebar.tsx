import React, { useEffect, useRef, useState } from "react";
// import { Link } from 'react-router-dom';
import profile from "../assets/profile.png";
import logo from "../assets/logo.png";
import { InfoIconSideBar, SearchIconSideBar } from "./Icons";
import "../styles/Sidebar.css";
import { Box, Button, Grow, Icon } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { logout } from "../services/authServices";
import { useAuth } from "../Contexts/authContext";



const Sidebar: React.FC = () => {
  const { setAuthUser } = useAuth()
  const [ showProfileBox, setShowProfileBox ] = useState<boolean>(false);
  const profileRef = useRef<HTMLImageElement>(null)

  const handleLogOutClick = async (e: Event) =>{
    e.stopPropagation();
    setShowProfileBox(false);
    try{
      const clearCookie = await logout();
      if(clearCookie){
        setAuthUser(null);
      }
    } catch(error){
      console.error(error);
    }
  }

  useEffect(()=>{
    const showProfileBox = ()=>{
      setShowProfileBox(true);
    }

    const profileimgElement = profileRef.current;

    if(profileimgElement){
      profileimgElement.addEventListener("mouseenter", showProfileBox);
    }
    return ()=>{
      if(profileimgElement){
        profileimgElement.removeEventListener("mouseenter", showProfileBox);
      }
    }
  },[])

  useEffect(()=>{
    function hideProfileBox(e: Event){
      e.stopPropagation();
      setShowProfileBox(false);
    }
    if(showProfileBox){
      document.addEventListener('click', hideProfileBox);
    }else{
      document.removeEventListener('click', hideProfileBox);
    }
  },[showProfileBox])
  
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
        <img className="profile-image" ref={profileRef} src={profile} onClick={(e)=>{e.stopPropagation();setShowProfileBox(!showProfileBox)}}/>
        <Box sx={{ display: 'flex' }} >
          <Grow in={showProfileBox}><div className="profile-box">
          <Button onClick={handleLogOutClick} className="button" size="small"><Logout />Log out</Button>
        </div></Grow>
        </Box>
      </div>
    </div>
  );
};

export default Sidebar;
