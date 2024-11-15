

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
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
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { makeStyles } from "@mui/styles";
import DoneIcon from '@mui/icons-material/Done';
import { DropDown } from "../components/DropDown";
import AddIcon from '@mui/icons-material/Add';
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
    margin: " 4px 8px",
    padding: "4px 8px",
    border: "8px",
    borderRadius: "4px",
  },
  statusIncomplete: {
    backgroundColor: "#A16207", // Yellow background
    color: "#fff",
    margin: " 4px 8px",
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
  assginWork:{
    display: "flex",
    // alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "4px 8px",
    backgroundColor: "#fff",
  },
  assginWorkButton:{
    width: "103px",
    height: "36px",
    borderRadius: "8px",
    backgroundColor: "gray",
    Color: 'grey',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0px',
    cursor: "hand",

  },
  assignAndSearch:{
    width:"363px",
    height:"36px",
    display:"flex",
    alignItems: "center",
    gap: '12px',
    opacity: 1,
  }
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
interface EmployeesWithRemarks {
  id: number;
  dailyRecordsId:string;
  name: string;
  skill: string;
  status: string;
  siteName: string;
  adminRemark: string;
  technicianRemark: string;
}

interface DailyRecord {
  _id: string;
  employeeId: string;
  siteId: string;
  checkIn: {
    imageUrl: string;
    location: [number, number];
    timestamp: Date;
  };
  checkOut: {
    location: [number, number];
    timestamp: Date;
  };
  workAssigned: string;
  workStatus: string;
  adminRemark: string;
  technicianRemark: string;
  date: Date;

}
interface Site {
  _id: string;
  name: string;
  location: [number];
  info?: string;
  siteAdmins: string;
}

const Assignwork = () => {
  const classes = useStyles();

  const [dailyRecordsData, setDailyRecordsData] = useState<DailyRecord[]>([]);
  const [technicians, setTechnicain] = useState<Employee[]>([]);
  const [admins, setAdmins] = useState<Employee[]>([]);
  const [isTechnicians, setIsTechnicians] = useState(true);
  const [sites, setSite] = useState<Site[]>([]);
  const [mergedRecords, setMergedRecords] = useState<EmployeesWithRemarks[]>([]);
  // const [isEditFuction,setIsEditFuction]=useState(false);
  const [skillFilter, setSkillFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [updated,setUpdated]=useState(false);
  const [updateAdminRemarks,setUpdateAdminRemarks]=useState<string>('');
  const [updateTechinicanRemarks,setUpdateTechinicanRemarks]=useState<string>('');
  
  
  /* to fetch data form apis*/
  useEffect(() => {
    fetchEmployees("http://localhost:4200/employee");
    fetchDailyRecords("http://localhost:4200/dailyrecord/all");
    fetchSite("http://localhost:4200/site");

  }, []);
  useEffect(() => {
    fetchDailyRecords("http://localhost:4200/dailyrecord/all");

  }, [updated]);
  /* to combine the data for display*/
  useEffect(() => {
    if (technicians.length && dailyRecordsData.length && sites.length) {
      let ids=1;
      const combinedData: EmployeesWithRemarks[] = dailyRecordsData
        .map((record) => {
          const employee = technicians.find((tech) => tech._id === record.employeeId);
          const site = sites.find((s) => s._id === record.siteId);
          if (employee && site) {
            return {
              id: ids,
              dailyRecordsId: record._id,
              name: employee.name,
              skill: employee.skill,
              status: employee.status,
              siteName: site.name,
              adminRemark: record.adminRemark,
              technicianRemark: record.technicianRemark,
            };
            ids+=1;
          }
          return null;
        })
        .filter((item) => item !== null) as EmployeesWithRemarks[];

      setMergedRecords(combinedData);
    }
  }, [technicians, dailyRecordsData, sites]);

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

  const fetchSite = (endpoint: string) => {
    axios
      .get(endpoint)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setSite(response.data);

        } else {
          console.error("Expected an array but received:", response.data);
          setSite([]);
        }
      })
      .catch((error) => {
        console.error("Error message:", error.message);
        setSite([]);
      });
  };

  const fetchDailyRecords = (endpoint: string) => {
    axios
      .get(endpoint)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setDailyRecordsData(response.data);

        } else {
          console.error("Expected an array but received:", response.data);
          setDailyRecordsData([]);
        }
      })
      .catch((error) => {
        console.error("Error message:", error.message);
        setDailyRecordsData([]);
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

  const editRemarks = ():void =>{
    setUpdated(false);
    const inputremarks=document.querySelectorAll('.InputRemarks');
    inputremarks.forEach((ele) =>{
      (ele as HTMLElement).style.display="block";

    });
    const displayremarks=document.querySelectorAll('.displayRemarks');
    displayremarks.forEach((ele) =>{
      (ele as HTMLElement).style.display="none";

    });

  }
   async function updateRemark(id:string,aRemark?:string,tRemark?:string):Promise<void>{
    
    try {

      const response = await fetch(`http://localhost:4200/dailyrecord/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json', // Set content type to application/json
        },
          body: JSON.stringify({adminRemark:aRemark, technicianRemark:tRemark}), 
      });

      // Handle response
      if (!response.ok) {
          throw new Error('Failed to update remarks');
      }

      const result = await response.json();
      console.log('Remarks updated successfully:', result);
      
      

  }
  catch(error){
    console.error('Error updating the remarks:', error);
  }

}

  const UpdateRemarks=(id:string):void=>{

    console.log(id);
    updateRemark(id,updateAdminRemarks,updateTechinicanRemarks)
    setUpdated(true);
    setUpdateAdminRemarks('');
    setUpdateTechinicanRemarks('');
    const displayremarks=document.querySelectorAll('.displayRemarks');
    displayremarks.forEach((ele) =>{
      (ele as HTMLElement).style.display="block";

    });
    const inputremarks=document.querySelectorAll('.InputRemarks');
    inputremarks.forEach((ele) =>{
      (ele as HTMLElement).style.display="none";
      

    });
  }

  const assignWorkCheck =():void=>{

  }

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
        <Box className={classes.assignAndSearch}>
        <Box className={classes.assginWork}>
          <Button className={classes.assginWorkButton} onClick={assignWorkCheck}><AddIcon/> Assign</Button>
        </Box>
        <Box className={classes.searchContainer}>
          <InputBase placeholder="Search..." className={classes.searchInput} />
          <SearchIcon />
        </Box>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead className={classes.tableHead}>
            <TableRow>
            <TableCell className={classes.tableCell}>Id</TableCell>
              <TableCell className={classes.tableCell}>Name</TableCell>
              <TableCell className={classes.tableCell}>Skill</TableCell>
              <TableCell className={classes.tableCell}>Assigned Site</TableCell>
              <TableCell className={classes.tableCell}>Assign Work</TableCell>
              <TableCell className={classes.tableCell}>Status</TableCell>
              <TableCell className={classes.tableCell}>Engineer Remark</TableCell>
              <TableCell className={classes.tableCell}>Site Manager Remark</TableCell>
              <TableCell className={classes.tableCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mergedRecords.map((record, index) => (
              <TableRow key={index}>
                <TableCell className={classes.tableCell} /*onMouseOver={}*/ >{record.id}</TableCell>
                <TableCell className={classes.tableCell}>{record.name}</TableCell>
                <TableCell className={classes.tableCell}>{record.skill}</TableCell>
                <TableCell className={classes.tableCell}>{record.siteName}</TableCell>
                <TableCell className={classes.tableCell}> 
                  <DropDown dailyRecordsId={record.dailyRecordsId} /> 
                  </TableCell>
                <TableCell className={`${classes.tableCell} ${record.status === "Completed"
                    ? classes.statusCompleted
                    : record.status === "Incomplete"
                      ? classes.statusIncomplete
                      : record.status === "OnHold"
                        ? classes.statusOnHold
                        : record.status === "Pending"
                          ? classes.statusPending
                          : ""
                  }`}>
                  {record.status}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  
                  <input className="InputRemarks" 
                    type="text" 
                    placeholder={record.technicianRemark}  
                    value={updateTechinicanRemarks}
                    onChange={(e) => setUpdateTechinicanRemarks(e.target.value)}
                    style={{ display: "none", width:"auto"}}
                  />
                  
                  <span className="displayRemarks">
                    {record.technicianRemark}
                  </span>
                </TableCell>
                <TableCell className={classes.tableCell}>
                  
                  <input className="InputRemarks" 
                    type="text" placeholder={record.adminRemark} 
                    value={updateAdminRemarks}
                    onChange={(e) => setUpdateAdminRemarks(e.target.value)}
                    style={{ display: "none" , width:"auto"}} 
                  />
                  
                  <span className="displayRemarks" >
                    {record.adminRemark}
                  
                  </span>
                </TableCell>
                <TableCell className={classes.tableCell}>

                  <IconButton className="displayRemarks" aria-label="edit"onClick={editRemarks} >
                    <EditIcon />
                  </IconButton>

                  <IconButton aria-label="edit"  className="InputRemarks" onClick={()=>UpdateRemarks(record.dailyRecordsId)}  style={{display:"none"}}>
                    <DoneIcon />
                  </IconButton>

                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Assignwork;
