


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Paper,
  Checkbox,
  SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';

type EmployeeData = {
  id: number;
  _id: string;
  name: string;
  skill: string;
  mobileNumber: string;
  lastAssignedTask: string;
  status: string;
  nextAssignedSite: string;
};

const statusStyles: { [key: string]: { color: string; bgcolor: string } } = {
  Completed: { color: '#15803D', bgcolor: '#DCFCE7' },
  Incomplete: { color: '#92400E', bgcolor: '#FEF3C7' },
  Pending: { color: '#DC2626', bgcolor: '#FEE2E2' },
  'On hold': { color: '#525252', bgcolor: '#F5F5F5' },
};

export default function Empsite() {
  const [rows, setRows] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sites, setSites] = useState<string[]>([]); 

  useEffect(() => {
    fetchEmployees();
    fetchSites(); 
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4200/employee');
      const transformedData = (Array.isArray(response.data) ? response.data : response.data.employees)
        .map((employee: any, index: number) => ({
          id: index + 1,
          _id: employee._id,
          name: employee.name,
          skill: employee.skill,
          mobileNumber: employee.mobile,
          lastAssignedTask: employee.lastAssignedTask || 'Unassigned',
          status: employee.status || 'Pending',
          nextAssignedSite: employee.nextSite || 'Unassigned'
        }));
      setRows(transformedData);
      setError(null);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setError("Failed to load employee data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSites = async () => {
    try {
      const response = await axios.get('http://localhost:4200/site');
      console.log(response.data);
      setSites(response.data || []); // Ensure sites is an array
    } catch (error) {
      console.error("Error fetching site data:", error);
    }
  };

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
    const matchesFilter = selectedFilter === 'All' || row.status === selectedFilter;
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
      
      <Box display="flex" justifyContent="space-between" mb={2}>
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
              <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                <th style={{ padding: '16px' }}>Select</th>
                <th style={{ padding: '16px' }}>Name</th>
                <th style={{ padding: '16px' }}>Skill</th>
                <th style={{ padding: '16px' }}>Mobile</th>
                <th style={{ padding: '16px' }}>Last Task</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px' }}>Next Site</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map(row => (
                <tr key={row.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
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
                  <td style={{ padding: '16px', color: '#64748B' }}>{row.lastAssignedTask}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      color: statusStyles[row.status]?.color, 
                      backgroundColor: statusStyles[row.status]?.bgcolor, 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      fontSize: '0.875rem'
                    }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <Select
                      value={row.nextAssignedSite}
                      onChange={(event) => handleSiteChange(event, row.id, row._id)}
                      sx={{ 
                        minWidth: '120px',
                        height: '32px',
                        fontSize: '0.875rem',
                        '.MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563EB' },
                      }}
                    >
                      <MenuItem value="Unassigned">Unassigned</MenuItem>
                      {sites && sites.map((site) => (
                        <MenuItem key={site} value={site.name}>{site.name}</MenuItem>
                      ))}
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Paper>
    </Box>
  );
}
