import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Tabs,
  Tab,
  InputBase,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import {
  tableStyles,
  tableHeaderStyles,
  tableBodyStyles,
  tableHeadStyles,
  statusStyles,
  topNavStyles,
  tabsContainerStyles,
  tabStyles,
  searchContainerStyles,
  searchInputStyles,
  addButtonStyles,
  addButtonIconStyles,
} from "../styles/employeeStyles";

import AddEmployeeModal from "../components/AddEmployee";

interface Employee {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  skill: string;
  status: string;
}

const Employees = () => {
  const [technicians, setTechnicians] = useState<Employee[]>([]);
  const [admins, setAdmins] = useState<Employee[]>([]);
  const [isTechnicians, setIsTechnicians] = useState(true);
  const [skillFilter, setSkillFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
  const [value, setValue] = useState(0);

  useEffect(() => {
    fetchEmployees("http://localhost:4200/employee");
  }, []);

  const fetchEmployees = (endpoint: string) => {
    axios
      .get(endpoint)
      .then((response) => {
        if (Array.isArray(response.data)) {
          const allEmployees = response.data;
          setTechnicians(
            allEmployees
              .filter((emp) => emp.role === "technician")
              .sort((a, b) => a.name.localeCompare(b.name))
          );
          setAdmins(
            allEmployees
              .filter((emp) => emp.role !== "technician")
              .sort((a, b) => a.name.localeCompare(b.name))
          );
        } else {
          console.error("Expected an array but received:", response.data);
          setTechnicians([]);
          setAdmins([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setTechnicians([]);
        setAdmins([]);
      });
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue === 0) {
      handleTechnician();
    } else {
      handleAdmin();
    }
  };

  const handleTechnician = (): void => {
    setIsTechnicians(true);
  };

  const handleAdmin = (): void => {
    setIsTechnicians(false);
  };

  const openModal = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  const filteredTechnicians = technicians.filter((emp) =>
    emp.skill.toLowerCase().includes(skillFilter.toLowerCase())
  );

  const filteredAdmins = admins.filter((emp) =>
    emp.skill.toLowerCase().includes(skillFilter.toLowerCase())
  );

  return (
    <Box>
      <Box sx={topNavStyles}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={tabsContainerStyles}
          TabIndicatorProps={{
            style: {
              display: "none",
            },
          }}
        >
          <Tab label="Technicians" sx={tabStyles} />
          <Tab label="Admins" sx={tabStyles} />
        </Tabs>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Open modal on click */}
          <Button
            onClick={openModal}
            sx={addButtonStyles}
            startIcon={<AddIcon sx={addButtonIconStyles} />}
          >
            Employee
          </Button>
          <Box sx={searchContainerStyles}>
            <InputBase
              placeholder="Search..."
              sx={searchInputStyles}
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            />
            <SearchIcon />
          </Box>
        </Box>
      </Box>

      {/* Table for displaying employees */}
      <TableContainer component={Paper}>
        <Table sx={tableStyles}>
          <TableHead sx={tableHeadStyles}>
            <TableRow>
              <TableCell sx={tableHeaderStyles}>Name</TableCell>
              <TableCell sx={tableHeaderStyles}>Skill</TableCell>
              <TableCell sx={tableHeaderStyles}>Mobile Number</TableCell>
              <TableCell sx={tableHeaderStyles}>Last assigned task</TableCell>
              <TableCell
                sx={{
                  ...tableHeaderStyles,
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
              >
                Status
              </TableCell>
              <TableCell sx={tableHeaderStyles}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(isTechnicians ? filteredTechnicians : filteredAdmins).map(
              (worker, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      ...tableBodyStyles,
                      fontWeight: "900",
                      color: "#101828",
                    }}
                  >
                    {worker.name}
                  </TableCell>
                  <TableCell sx={tableBodyStyles}>{worker.skill}</TableCell>
                  <TableCell sx={tableBodyStyles}>{worker.mobile}</TableCell>
                  <TableCell sx={tableBodyStyles}>Assigned Task</TableCell>
                  <TableCell
                    sx={{
                      ...tableBodyStyles,
                      ...(worker.status === "Completed"
                        ? statusStyles.completed
                        : worker.status === "Incomplete"
                        ? statusStyles.incomplete
                        : worker.status === "onHold"
                        ? statusStyles.onHold
                        : worker.status === "Pending"
                        ? statusStyles.pending
                        : {}),
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    {worker.status}
                  </TableCell>
                  <TableCell sx={tableBodyStyles}>
                    {/* Add your action components here */}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Employee Modal */}
      <AddEmployeeModal open={isModalOpen} handleClose={closeModal} />
    </Box>
  );
};

export default Employees;
