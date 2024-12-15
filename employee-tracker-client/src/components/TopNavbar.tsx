import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const TopNavbar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="top-navbar">
      <ul className="topbar-links">
        <li style={{marginLeft: "-25px"}}>
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
            className={`topbar-link ${location.pathname === '/works' ? 'active-link' : ''}`}
            to="/works"
          >Works</Link>
        </li>
        <li>
          <Link
            className={`topbar-link ${location.pathname === '/assign' ? 'active-link' : ''}`}
            to="/assign"
          >
            Assign
          </Link>
        </li>
        {/* <li>
          <Link
            className={`topbar-link ${location.pathname === '/remarks' ? 'active-link' : ''}`}
            to="/remarks"
          >
            Remarks
          </Link>
        </li> */}
        <li>
          <Link
            className={`topbar-link ${location.pathname === '/reports' ? 'active-link' : ''}`}
            to="/reports"
          >
            Reports
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default TopNavbar;
