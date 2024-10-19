import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/employee.css';
import ServerModal from '../components/AddEmployee'; // Import your modal component

interface Employee {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  skill: string;
  status: string;
}

const Employees: React.FC = () => {
  const [technicians, setTechnicain] = useState<Employee[]>([]);
  const [admins, setAdmins] = useState<Employee[]>([]);
  const [isTechnicians, setIsTechnicians] = useState(true);
  const [skillFilter, setSkillFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  useEffect(() => {
    fetchEmployees('http://localhost:4200/employee');
  }, []);

  const fetchEmployees = (endpoint: string) => {
    axios.get(endpoint)
      .then(response => {
        if (Array.isArray(response.data)) {
          const allEmployees = response.data;
          setTechnicain(allEmployees.filter(emp => emp.role === "technician").sort((a, b) => a.name.localeCompare(b.name)));
          setAdmins(allEmployees.filter(emp => emp.role !== "technician").sort((a, b) => a.name.localeCompare(b.name)));
        } else {
          console.error('Expected an array but received:', response.data);
          setTechnicain([]); 
          setAdmins([]);
        }
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
        setTechnicain([]); 
        setAdmins([]);
      });
  };

  const handleTechnician = (): void => {
    setIsTechnicians(true);
  };

  const handleAdmin = (): void => {
    setIsTechnicians(false);
  };

  const openModal = (): void => {
    setIsModalOpen(true); // Open modal when button is clicked
  };

  const closeModal = (): void => {
    setIsModalOpen(false); // Close modal
  };

  const filteredTechnicians = technicians.filter(emp => 
    emp.skill.toLowerCase().includes(skillFilter.toLowerCase())
  );

  const filteredAdmins = admins.filter(emp => 
    emp.skill.toLowerCase().includes(skillFilter.toLowerCase())
  );

  return (
    <>
    <div className='table-feature-options'>
      <div className="button-container">
        <button 
          className={`button-container-one ${isTechnicians ? 'activeButton' : ''}`}
          onClick={handleTechnician}
        >
          Technicians
        </button>
        <div className="separator"></div>
        <button 
          className={`button-container-two ${!isTechnicians ? 'activeButton' : ''}`} 
          onClick={handleAdmin}
        >
          Admins
        </button>
      </div>
    
      <div className="filter-container">
        <button 
          id='add-employee-button' 
          className='add-employee-button'
          onClick={openModal} // Trigger the modal when button is clicked
        >
          <span className='add-symbol'>+ </span>Employee
        </button>
        <input 
          type="text" 
          className='filter-input'
          placeholder="Search" 
          value={skillFilter} 
          onChange={(e) => setSkillFilter(e.target.value)} 
        />
      
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
        </svg>
      </div>
    </div>
    
    {/* Technicians/Admins Table */}
    <div className="employees-container">
      {isTechnicians ? (
        <table className="employees-table">
          <thead className='employee-table-head' id='employee-table-head'>
            <tr>
              <th>Name</th>
              <th>Skill</th>
              <th>Mobile Number</th>
              <th>Last Assigned Task</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTechnicians.map(employee => (
              <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.skill}</td>
                <td>{employee.mobile}</td>
                <td>notyet</td>
                <td>
                  <p className={`status-${employee.status.toLowerCase()}`}> {employee.status}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="employees-table">
          <thead className='employee-table-head'>
            <tr>
              <th>Name</th>
              <th>Skill</th>
              <th>Mobile Number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map(employee => (
              <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.skill}</td>
                <td>{employee.mobile}</td>
                <td>
                  <p className={`status-${employee.status.toLowerCase()}`}> {employee.status}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

    {/* ServerModal */}
    <ServerModal open={isModalOpen} handleClose={closeModal} />
    </>
  );
};

export default Employees;
