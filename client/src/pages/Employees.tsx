import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/employee.css';

interface Employee {
  id: number;
  name: string;
  skill: string;
  mobile: string;
  task: string;
  status: string;
}

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isTechnicians, setIsTechnicians] = useState(true);
  
  useEffect(() => {
    // Initially load technicians
    fetchEmployees('/api/technicians');
  }, []);

  const fetchEmployees = (endpoint: string) => {
    axios.get(endpoint)
      .then(response => setEmployees(response.data))
      .catch(error => console.error('Error fetching employees:', error));
  };

  const handleTechnician = (): void => {
    setIsTechnicians(true);
    fetchEmployees('/api/technicians');
  };

  const handleAdmin = (): void => {
    setIsTechnicians(false);
    fetchEmployees('/api/admins');
  };

  return (
    <>
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

      <div className="employees-container">
        {isTechnicians && 
          <table className="employees-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Skill</th>
                <th>Mobile Number</th>
                <th>Last Assigned Task</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.skill}</td>
                  <td>{employee.mobile}</td>
                  <td>{employee.task}</td>
                  <td className={`status-${employee.status.toLowerCase()}`}>
                    {employee.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </>
  );
};

export default Employees;
