import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import Employees from './pages/Employees';
import Sites from './pages/Sites';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-container">
          <TopNavbar />
          <Routes>
            <Route path="/employees" element={<Employees />} />
            <Route path="/sites" element={<Sites />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};
export default App;
