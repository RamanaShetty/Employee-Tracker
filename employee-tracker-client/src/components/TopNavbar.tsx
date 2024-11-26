import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const TopNavbar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="top-navbar">
      <ul className="topbar-links">
        <li>
          <Link
            className={`topbar-link ${location.pathname === '/employees' ? 'active-link' : ''}`}
            to="/employees"
          >
            Employees
          </Link>
        </li>
        <li>
          <Link
            className={`topbar-link ${location.pathname === '/sites' ? 'active-link' : ''}`}
            to="/sites"
          >
            Sites
          </Link>
        </li>
        <li>
          <Link
            className={`topbar-link ${location.pathname === '/assign-site' ? 'active-link' : ''}`}
            to="/assign-site"
          >
            Assign Site
          </Link>
        </li>
        <li>
          <Link
            className={`topbar-link ${location.pathname === '/works' ? 'active-link' : ''}`}
            to="/works"
          >Works</Link>
        </li>
        <li>
          <Link
            className={`topbar-link ${location.pathname === '/assign-work' ? 'active-link' : ''}`}
            to="/assign-work"
          >
            Assign Work
          </Link>
        </li>
        <li>
          <Link
            className={`topbar-link ${location.pathname === '/report' ? 'active-link' : ''}`}
            to="/report"
          >
            Report
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default TopNavbar;
