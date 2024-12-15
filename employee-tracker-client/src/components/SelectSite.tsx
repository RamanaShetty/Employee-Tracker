import { Box, MenuItem, Select, Checkbox } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import SiteCheckList from "./SiteCheckList";

interface Work {
  _id: string;
  name: string;
  description: string;
}

interface Site {
    _id: string;
    name: string;
}

interface AssignedWork {
  siteId: Site;
  works: Work[];
}


const SelectSite:React.FC<{employee_id: string, assignedTasks: AssignedWork[], fetchEmployees: () => void}> = ({employee_id, assignedTasks,  fetchEmployees}) => {
    const [ sites, setSites ] = useState<{ id: string, name: string }[]>([]);
    const  [ taskData, setTaskData ] = useState<AssignedWork[]>(assignedTasks);
    const [ selectedSites, setSelectedSites ] = useState<string[]>([]);
    const [ dropDown, setDropDown ] = useState<boolean>(false);

    useEffect(() => {
      console.log(assignedTasks);
        async function fetchAllData(){
            try{
                const resultForSites = await fetchSites("http://localhost:4200/site");
            }catch(error){
                console.error(error);
            }
        }
        fetchAllData();
        setTaskData(assignedTasks);
        selectSites();
        
      }, []);

      useEffect(()=>{
        selectSites();
      }, [taskData, assignedTasks])
     
      const selectSites = () => {
        if (assignedTasks && assignedTasks.length > 0){
          setSelectedSites(assignedTasks.map((task)=>{return task.siteId._id}))
        }
      }
      const fetchSites = (endpoint: string) => {
        return new Promise((resolve, reject)=>{axios
          .get(endpoint)
          .then((response) => {
            if (Array.isArray(response.data)) {
              const allSites = response.data
                .map((site: {_id: string; name: string}) => ({
                    id: site._id,
                    name: site.name,
                }))
              setSites(allSites);
              resolve(1);
            } else {
              console.error("Expected an array but received:", response.data);
              setSites([]);
              reject("Error fetching Site Data");
            }
          })
          .catch((error) => {
            console.error("Error fetching employees:", error);
            setSites([]);
            reject("Error fetching Site Data");
          });
        })
      };

      const manageSiteAssignment = async (e: any, id: string)=>{
        if(e.target.checked){
          try{
            console.log(employee_id);
            await axios({
              method: "POST",
              url: `http://localhost:4200/assignedworks/${employee_id}`,
              data: {siteId: id},
              withCredentials: true
            });
            setSelectedSites([...selectedSites, id]);
            fetchEmployees();
          } catch (error: any) {
            console.log("Error Assigning sites: ",error.message);
          }
          
        }else if(!e.target.checked){
          try{
            await axios({
              method: "DELETE",
              url: `http://localhost:4200/assignedworks/${employee_id}/${id}`,
              withCredentials: true
            });
            fetchEmployees();
          } catch (error: any) {
            console.log("Error Unassigning sites: ",error.message);
          }
        }
      }
    return(
        <Select
                      value="Unassigned"
                      sx={{ 
                        minWidth: '120px',
                        fontSize: '0.875rem',
                        '.MuiOutlinedInput-notchedOutline': { border: "none" },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563EB' },
                        padding: "5px"
                      }}
                      onOpen={()=>{setDropDown(true);}}
                      onClose={()=>{setDropDown(false);fetchEmployees()}}
                    >
                      <MenuItem value="Unassigned">Assign Site</MenuItem>
                      { dropDown && <SiteCheckList employee_id={employee_id} sitesSelected={selectedSites} />}
        </Select>
    )
}

export default SelectSite;