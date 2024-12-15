import { Box, Checkbox } from "@mui/material"
import axios from "axios";
import { useEffect, useState } from "react";

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
    site: Site;
    works: Work[];
  }

const SiteCheckList: React.FC<{employee_id: string, sitesSelected: string[]}> = ({employee_id, sitesSelected}) => {

    const [ selectedSites, setSelectedSites ] = useState(sitesSelected)
    const [ sites, setSites ] = useState<{ id: string, name: string }[]>([]);

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

    useEffect(()=>{
        async function fetchAllData(){
            try{
                await fetchSites("http://localhost:4200/site");
            }catch(error){
                console.error(error);
            }
        }
        fetchAllData();
        console.log(sitesSelected);
        setSelectedSites(sitesSelected);
    },[])
    const manageSiteAssignment = async (e: any, id: string)=>{
        if(e.target.checked){
          try{
            // console.log(employee_id);
            await axios({
              method: "POST",
              url: `http://localhost:4200/assignedworks/${employee_id}`,
              data: {siteId: id},
              withCredentials: true
            });
            console.log("Done adding");
            setSelectedSites([...selectedSites, id]);
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
            console.log("Done removing")
            setSelectedSites(selectedSites.filter((site)=>site!=id));
          } catch (error: any) {
            console.log("Error Unassigning sites: ",error.message);
          }
        }
      }
    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            {sites && sites.map((site) => (
                <Box key={site.id} sx={{ padding: "5px", display: "flex", justifyContent: "left", alignItems: "center", width: "100%" }}>
                    <Checkbox
                        // type="checkbox"
                        id={site.id}
                        value={site.id}
                        name={site.name}
                        checked={selectedSites.includes(site.id)}
                        onChange={(e) => { manageSiteAssignment(e, site.id) }}
                    />
                    <label htmlFor={site.id}>{site.name}</label>
                </Box>
            ))}
        </Box>
    )
}

export default SiteCheckList;