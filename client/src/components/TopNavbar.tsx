import React from 'react';
import { Link } from 'react-router-dom';

const TopNavbar: React.FC = () => {
  return (
    <div className="top-navbar">
      <ul className="topbar-links">
        <li><Link className='topbar-link' to="/employees">Employees</Link></li>
        <li><Link className='topbar-link' to="/sites">Sites</Link></li>
        <li><Link className='topbar-link' to="/assign-site">Assign Site</Link></li>
        <li><Link className='topbar-link' to="/assign-work">Assign Work</Link></li>
        <li><Link className='topbar-link' to="/report">Report</Link></li>
      </ul>
    </div>
  );
};

export default TopNavbar;
