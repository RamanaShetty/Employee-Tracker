import { Box, Button, Dialog, DialogTitle, MenuItem, Select, styled, TextField } from "@mui/material";
import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";

interface AssignModalProps {
    employee_id: string | null;
    name: string | null;
    open: boolean;
    handleClose: () => void;
}

interface TaskData {
    siteId: string | null,
    works: string[] | [],
}

const BlurredDialog = styled(Dialog)`
  & .MuiBackdrop-root {
    backdrop-filter: blur(5px);
    background-color: rgba(0, 0, 0, 0.5);
  }

  & .MuiDialog-paper {
    box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.08);
  }

  & .MuiInputBase-root {
    min-height: 44px;
    max-height: 100px;
  }

  & .MuiInputLabel-root {
    transform: translate(14px, 12px) scale(1);
    &.Mui-focused,
    &.MuiFormLabel-filled {
      transform: translate(14px, -9px) scale(0.75);
    }
  }
`;

const AssignModal: React.FC<AssignModalProps> = ({ employee_id, name, open, handleClose }) => {
  if(employee_id && name){
    const [ taskFormData, setTaskFormData ] = useState<TaskData>({
        siteId: "",
        works: [],
    });

    const  [ taskData, setTaskData ] = useState<TaskData[]>([]);
    const [ selectedSite, setSelectedSite ] = useState<string | null>(null);
    const [ errors, setErrors ] = useState<Record<string, string>>({});
    const [ sites, setSites ] = useState<{ id: string, name: String }[]>([]);
    const [ works, setWorks ] = useState<{_id: string, name: string, description: string}[]>([]);

    useEffect(() => {
        fetchSites("http://localhost:4200/site");
        fetchWorks("http://localhost:4200/work");
        fetchTaskData(`http://localhost:4200/assignedtasks/${employee_id}`);
      }, []);
    
      useEffect(() => {
        
      }, []);

      const fetchWorks = (endpoint: string) => {
        axios.get(endpoint)
        .then((response)=>{
          if(Array.isArray(response.data)){
            setWorks(response.data);
          } else {
            console.error("Expected an array but received: ", response.data);
            setWorks([]);
          }
        })
        .catch((error)=>{
          console.error("Error message:", error.message);
          setWorks([]);
        })
      }
    
      const fetchSites = (endpoint: string) => {
        axios
          .get(endpoint)
          .then((response) => {
            if (Array.isArray(response.data)) {
              const allSites = response.data
                .map((site: {_id: string; name: string}) => ({
                    id: site._id,
                    name: site.name,
                }))
              setSites(allSites);
            } else {
              console.error("Expected an array but received:", response.data);
              setSites([]);
            }
          })
          .catch((error) => {
            console.error("Error fetching employees:", error);
            setSites([]);
          });
      };

      const fetchTaskData = (endpoint: string) => {
        axios
          .get(endpoint)
          .then((response) => {
            if (response.data) {
              setTaskData(response.data);
            } else {
              console.error("Error fetching fetchTaskData", response.data);
              setTaskData([]);
            }
          })
          .catch((error) => {
            console.error("Error fetching Tasks:", error);
            setTaskData([]);
          });
      };

      const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTaskData((prev)=>({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      };

      const handleSubmit = () => {
        if (taskData) {
          axios({
            method: "post",
            url: "http://localhost:4200/assignedtasks/${id}",
            data: taskFormData,
            headers: { "Content-Type": "application/json" },
          })
            .then(() => {
              alert("Work added successfully");
              window.location.reload();
            })
            .catch((err) => {
              console.error("Error adding work:", err);
            });
        }
      };
    return (
        <BlurredDialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <Box
                sx={{ padding: "24px", display: "flex", flexDirection: "column", rowGap: 2, }}
            >
                <DialogTitle sx={{ padding: 0, fontWeight: "600" }} >Assign Tasks to {name}</DialogTitle>
                <Box sx={{display:"flex",gap: "10px", height:"300px"}}>
                  <Box sx={{flex: "20%", /*border: "1px solid black"*/ gap:"10px", display: "flex", flexDirection: "column" }}>
                    <Button variant="contained" sx={{justifyContent: "flex-start", backgroundColor:"#ccceff", color:"black", boxShadow:"none", borderRadius:"7px 0 0 7px"}}>Site 1</Button>
                    <Button variant="contained" sx={{justifyContent: "flex-start", backgroundColor:"#cccccc", color:"black", boxShadow:"none",}}>Site 2</Button>
                    <Button variant="contained" sx={{justifyContent: "flex-start", backgroundColor:"#cccccc", color:"black", boxShadow:"none",}}>Site 3</Button>
                    <Button variant="contained" sx={{justifyContent: "flex-start", backgroundColor:"#cccccc", color:"black", boxShadow:"none",}}>Site 4</Button>
                    <Select
                      value={"Unassigned"}
                      // onChange={(event) => handleSiteChange(event, row.id, row._id)}
                      sx={{ 
                        minWidth: '120px',
                        height: '32px',
                        fontSize: '0.875rem',
                        '.MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563EB' },
                      }}
                    >
                      <MenuItem value="Unassigned">Add Site</MenuItem>
                      {sites && sites.map((site) => (
                        <MenuItem key={site.id} value={site.name} >{site.name}</MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <Box sx={{flex: "70%", /*border: "1px solid black"*/}}></Box>
                {/* <TextField
                    fullWidth
                    name="name"
                    label="Work Name"
                    autoComplete="off"
                    value={taskFormData.siteId}
                    onChange={handleInputChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{ marginBottom: "15px" }}
                />
                <TextField
                  fullWidth
                  id="outlined-multiline-flexible"
                  label="Work Description"
                  multiline
                  minRows={1}
                  maxRows={4}
                  name="description"
                  value={workData.description}
                  onChange={handleInputChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  sx={{ marginBottom: "15px" }}
                />

                <TextField
                    fullWidth
                    name="siteId"
                    label="Site"
                    select
                    value={workData.siteId}
                    onChange={(e) => {
                      setWorkData((prev) => ({
                        ...prev,
                        siteId: e.target.value,
                      }));
                    }}
                    error={!!errors.siteId}
                    helperText={errors.siteId}
                    sx={{ marginBottom: "15px" }}
                >     
                    {sites.map((site) => (
                      <MenuItem key={site.id} value={site.id}>
                        {site.name}
                      </MenuItem>
                    ))}
                </TextField> */}
                </Box>
                <Box sx={{ display: "flex", columnGap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleClose}
                    sx={{
                      width: "100%",
                      color: "#344054",
                      border: "1px solid #D0D5DD",
                      borderRadius: "8px",
                      textTransform: "none",
                      height: "40px",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                      width: "100%",
                      textTransform: "none",
                      borderRadius: "8px",
                      height: "40px",
                    }}
                  >
                    Add
                  </Button>
                </Box>
            </Box>
        </BlurredDialog>
    )}else{
      return<></>
    }
}

export default AssignModal;