


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Paper,
  Checkbox,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AssignModal from '../components/AssignModal';
import SelectSite from '../components/SelectSite';
import SelectWork from '../components/SelectWork';
import CircleIcon from '@mui/icons-material/Circle';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

interface Work {
  _id: string;
  name: string;
  description: string;
}

interface assignSite {
  _id: string;
  name: string;
}

interface AssignedWork {
  siteId: assignSite;
  works: Work[];
}

type EmployeeData = {
  id: number;
  _id: string;
  name: string;
  skill: string;
  role: string;
  mobileNumber: string;
  assignedTasks: AssignedWork[];
};

type Site = {
  _id: string;
  name: string;
  location: string;
  info: string;
  siteAdmin: string[];
}

const statusStyles: { [key: string]: { color: string; bgcolor: string } } = {
  Completed: { color: '#15803D', bgcolor: '#DCFCE7' },
  Incomplete: { color: '#92400E', bgcolor: '#FEF3C7' },
  Pending: { color: '#DC2626', bgcolor: '#FEE2E2' },
  'On hold': { color: '#525252', bgcolor: '#F5F5F5' },
};

export default function Empsite() {
  const [rows, setRows] = useState<EmployeeData[]>([]);
  const roles = ['technician']
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{ id: string | null, name: string | null } | null>(null);
  const [selectedEmployeeGroup, setSelectedEmployeeGroup] = useState<{ id: string | null, name: string | null }[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  const openModal = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setSelectedEmployeeGroup([]);
  };

  useEffect(() => {
    fetchEmployees();
    // fetchSites(); 
  }, []);

  const fetchEmployees = async () => {
    console.log("fetching Employees")
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4200/employee');
      console.log(response.data);
      if (response.data && response.data.length > 0) {
        const transformedData = response.data.map((employee: any, index: number) => ({
          id: index + 1,
          _id: employee._id,
          name: employee.name,
          skill: employee.skill,
          role: employee.role,
          mobileNumber: employee.mobile,
          assignedTasks: employee.assignedworks,
        }));
        setRows(transformedData);
        setError(null);
      } else {
        setRows([]);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setError("Failed to load employee data");
    } finally {
      setLoading(false);
    }
  };

  // const fetchSites = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:4200/site');
  //     setSites(response.data || []); // Ensure sites is an array
  //   } catch (error) {
  //     console.error("Error fetching site data:", error);
  //   }
  // };

  const handleCheckboxChange = (id: number) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = rows.filter((row) => {
    const matchesSearchTerm =
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.mobileNumber.includes(searchTerm);
    const matchesFilter = selectedFilter === 'All'
    return matchesSearchTerm && matchesFilter;
  });

  const handleSiteChange = async (event: SelectChangeEvent, id: number, _id: string) => {
    try {
      await axios.patch(`http://localhost:4200/employee/${_id}`, {
        nextSite: event.target.value
      });
      setRows(rows.map(row =>
        row.id === id ? { ...row, nextAssignedSite: event.target.value } : row
      ));
    } catch (error) {
      console.error("Error updating site assignment:", error);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
          size="small"
          sx={{ width: '40%' }}
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
        />

        {/* Date picker for showing work assigned only on that day */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <DatePicker
              label="Pick a Date"
              value={selectedDate}
              onChange={(newValue: Dayjs | null) => setSelectedDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
        </LocalizationProvider>

        {selectedRows.length > 1 && <Button variant='contained' onClick={() => { openModal(); }}>Assign</Button>}
        <Select
          value={selectedFilter}
          onChange={(event) => setSelectedFilter(event.target.value)}
          displayEmpty
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Incomplete">Incomplete</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="On hold">On hold</MenuItem>

        </Select>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none', border: '1px solid #E2E8F0' }}>
        <Box sx={{ minWidth: 650 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: '2px solid #E2E8F0' }}>
                <th style={{ padding: '16px' }}>Select</th>
                <th style={{ padding: '16px' }}>Name</th>
                <th style={{ padding: '16px' }}>Skill</th>
                <th style={{ padding: '16px' }}>Mobile</th>
                {/* <th style={{ padding: '16px' }}>Last Task</th> */}
                {/* <th style={{ padding: '16px' }}>Status</th> */}
                <th style={{ padding: '16px' }}>Assign Site</th>
                <th style={{ padding: '16px' }}>Assign Work</th>
                <th style={{ padding: '16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map(row => {
                if (roles.includes(row.role)) {
                  return <tr key={row.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '16px' }}>
                      <Checkbox
                        size="small"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleCheckboxChange(row.id)}
                        sx={{
                          color: '#CBD5E1',
                          '&.Mui-checked': { color: '#2563EB' },
                        }}
                      />
                    </td>
                    <td style={{ padding: '16px', color: '#1E293B', fontWeight: 500 }}>{row.name}</td>
                    <td style={{ padding: '16px', color: '#64748B' }}>{row.skill}</td>
                    <td style={{ padding: '16px', color: '#64748B' }}>{row.mobileNumber}</td>
                    {/* <td style={{ padding: '16px', color: '#64748B' }}>{row.lastAssignedTask}</td> */}
                    {/* <td style={{ padding: '16px' }}>
                    <span style={{ 
                      color: statusStyles[row.status]?.color, 
                      backgroundColor: statusStyles[row.status]?.bgcolor, 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      fontSize: '0.875rem'
                    }}>
                      {row.status}
                    </span>
                  </td> */}
                    <td><SelectSite employee_id={row._id} assignedTasks={row.assignedTasks} fetchEmployees={fetchEmployees} /></td>
                    <td style={{ display: "flex", gap: '10px', padding: '16px' }}>
                      <SelectWork employee_id={row._id} assignedTasks={row.assignedTasks} fetchEmployees={fetchEmployees} />
                      {/* {row.role=='technician' && <Button variant='contained' onClick={()=>{openModal(); setSelectedEmployee({id:row._id, name:row.name})}}>Assign</Button>} */}
                    </td>
                    <td>

                      {/* Task: Add a feature to click it and and after clicking that dot, a modal will open which will allow admin to give remarks and change the status of the work for respective work */}
                      <Box sx={{ display: "flex", gap: "5px", flexWrap: "wrap", maxWidth: "150px", overflow: "auto", padding: "10px" }}>
                        <Tooltip title="on hold"><Box sx={{ borderRadius: "50%", backgroundColor: "#ffc4c4", height: "16px", width: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}><CircleIcon sx={{ width: "10px", height: "10px", color: "red" }} /></Box></Tooltip>
                        <Tooltip title="Incomplete"><Box sx={{ borderRadius: "50%", backgroundColor: "#faf5aa", height: "16px", width: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}><CircleIcon sx={{ width: "10px", height: "10px", color: "orange" }} /></Box></Tooltip>
                        <Tooltip title="Completed"><Box sx={{ borderRadius: "50%", backgroundColor: "#b0ffc0", height: "16px", width: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}><CircleIcon sx={{ width: "10px", height: "10px", color: "green" }} /></Box></Tooltip>
                        <Tooltip title="Completed"><Box sx={{ borderRadius: "50%", backgroundColor: "#b0ffc0", height: "16px", width: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}><CircleIcon sx={{ width: "10px", height: "10px", color: "green" }} /></Box></Tooltip>
                        <Tooltip title="Pending"><Box sx={{ borderRadius: "50%", backgroundColor: "#faba82", height: "16px", width: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}><CircleIcon sx={{ width: "10px", height: "10px", color: "red" }} /></Box></Tooltip>
                        <Tooltip title="on hold"><Box sx={{ borderRadius: "50%", backgroundColor: "#ffc4c4", height: "16px", width: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}><CircleIcon sx={{ width: "10px", height: "10px", color: "red" }} /></Box></Tooltip>
                        <Tooltip title="Completed"><Box sx={{ borderRadius: "50%", backgroundColor: "#b0ffc0", height: "16px", width: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}><CircleIcon sx={{ width: "10px", height: "10px", color: "green" }} /></Box></Tooltip>
                        <Tooltip title="on hold"><Box sx={{ borderRadius: "50%", backgroundColor: "#ffc4c4", height: "16px", width: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}><CircleIcon sx={{ width: "10px", height: "10px", color: "red" }} /></Box></Tooltip>
                        <Tooltip title="Completed"><Box sx={{ borderRadius: "50%", backgroundColor: "#b0ffc0", height: "16px", width: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}><CircleIcon sx={{ width: "10px", height: "10px", color: "green" }} /></Box></Tooltip>
                        <Tooltip title="on hold"><Box sx={{ borderRadius: "50%", backgroundColor: "#ffc4c4", height: "16px", width: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}><CircleIcon sx={{ width: "10px", height: "10px", color: "red" }} /></Box></Tooltip>
                        <Tooltip title="Incomplete"><Box sx={{ borderRadius: "50%", backgroundColor: "#faf5aa", height: "16px", width: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}><CircleIcon sx={{ width: "10px", height: "10px", color: "orange" }} /></Box></Tooltip>
                        <Tooltip title="Pending"><Box sx={{ borderRadius: "50%", backgroundColor: "#faba82", height: "16px", width: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}><CircleIcon sx={{ width: "10px", height: "10px", color: "red" }} /></Box></Tooltip>

                      </Box>
                    </td>
                  </tr>
                }
              }
              )}
            </tbody>
          </table>
        </Box>
      </Paper>
      <AssignModal employee_id={selectedEmployee ? selectedEmployee.id : null} name={selectedEmployee ? selectedEmployee.name : null} open={isModalOpen} handleClose={closeModal} />
    </Box>
  );
}
