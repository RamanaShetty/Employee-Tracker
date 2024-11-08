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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  tableCell: {
    padding: "18px 16px",
    fontSize: "18px",
    fontWeight: "bold",
    borderBottom: "1px solid #ddd",
    color: "#344054 !important",
  },
  tableHead: {
    backgroundColor: "#f5f5f5",
  },
  statusCompleted: {
    backgroundColor: "#4E8729", // Green background
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  statusIncomplete: {
    backgroundColor: "#A16207", // Yellow background
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  statusOnHold: {
    backgroundColor: "#1A1A1A", // Dark primary color background
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  statusPending: {
    backgroundColor: "#FFF3ED", // Dark orange background
    color: "#1A1A1A",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  topNav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #ddd",
  },
  tabsContainer: {
    display: "inline-flex",
    border: "1px solid #D0D5DD !important", // light border color for outline
    borderRadius: "8px", // rounded corners
    overflow: "hidden", // keeps rounded corners intact
  },
  tab: {
    fontSize: "14px",
    fontWeight: "bold",
    minWidth: "auto",
    padding: "8px 16px",
    color: "#D0D5DD !important", // gray color for unselected tab text
    textTransform: "none",
    "&.Mui-selected": {
      color: "#667085 !important", // dark color for selected tab text
      backgroundColor: "#f4f6f8", // light background for selected tab
      fontWeight: "bold",
    },
    "&:not(.Mui-selected)": {
      backgroundColor: "#fff", // background color for unselected tabs
    },
    "&:not(:last-child)": {
      borderRight: "1px solid #D0D5DD", // Adds the border between tabs
    },
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "4px 8px",
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    fontSize: "14px",
    marginLeft: "8px",
    "&::placeholder": {
      color: "#999",
    },
  },
  searchIcon: {
    color: "#999",
  },
  activeTab: {
    fontWeight: "bold",
    color: "#007BFF",
  },
});

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
  const classes = useStyles();

  const [technicians, setTechnicain] = useState<Employee[]>([]);
  const [admins, setAdmins] = useState<Employee[]>([]);
  const [isTechnicians, setIsTechnicians] = useState(true);
  const [skillFilter, setSkillFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          setTechnicain(
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
          setTechnicain([]);
          setAdmins([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setTechnicain([]);
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
    alert("Technicions");
    setIsTechnicians(true);
  };

  const handleAdmin = (): void => {
    alert("Admins");
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
      <Box className={classes.topNav}>
        <Tabs
          value={value}
          onChange={handleChange}
          className={classes.tabsContainer}
          TabIndicatorProps={{
            style: {
              display: "none",
            },
          }}
        >
          <Tab
            label="Technicians"
            className={`${classes.tab} ${value === 0 ? classes.activeTab : ""}`}
          />
          <Tab
            label="Admins"
            className={`${classes.tab} ${value === 1 ? classes.activeTab : ""}`}
          />
        </Tabs>
        <Box className={classes.searchContainer}>
          <InputBase placeholder="Search..." className={classes.searchInput} />
          <SearchIcon />
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell className={classes.tableCell}>Name</TableCell>
              <TableCell className={classes.tableCell}>Skill</TableCell>
              <TableCell className={classes.tableCell}>Mobile Number</TableCell>
              <TableCell className={classes.tableCell}>
                Last assigned task
              </TableCell>
              <TableCell className={classes.tableCell}>Status</TableCell>
              <TableCell className={classes.tableCell}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {technicians.map((worker, index) => (
              <TableRow key={index}>
                <TableCell
                  className={classes.tableCell}
                  sx={{ fontWeight: "bold" }}
                >
                  {worker.name}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {worker.skill}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {worker.mobile}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  Something was Assign
                </TableCell>
                <TableCell
                  className={`${classes.tableCell} ${
                    worker.status === "Completed"
                      ? classes.statusCompleted
                      : worker.status === "Incomplete"
                      ? classes.statusIncomplete
                      : worker.status === "OnHold"
                      ? classes.statusOnHold
                      : worker.status === "Pending"
                      ? classes.statusPending
                      : ""
                  }`}
                >
                  {worker.status}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {/* Add your action components here */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Employees;
