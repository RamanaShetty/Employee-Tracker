import { Box, Checkbox } from "@mui/material"
import axios from "axios";
import { useEffect, useState } from "react";

interface Work {
    _id: string;
    name: string;
    description: string;
}

const WorkCheckList: React.FC<{ worksSelected: string[], employee_id: string, siteId: string }> = ({ worksSelected, employee_id, siteId }) => {
    const [works, setWorks] = useState<Work[]>([])
    const [selectedWorks, setSelectedWorks] = useState<string[]>(worksSelected);

    useEffect(() => {
        setSelectedWorks(worksSelected);
        fetchWorks();
    }, [])

    const manageWorkAssignment = async (e: any, id: string) => {
        const date = (new Date).toISOString();
        if (e.target.checked) {
            const data = {
                workId: id,
                action: "add",
                date: date,
                siteId: siteId
            }
            try {
                // console.log(employee_id);
                await axios({
                    method: "PUT",
                    url: `http://localhost:4200/assignedworks/${employee_id}/works`,
                    data: data,
                    withCredentials: true
                });
                console.log("Done adding");
                setSelectedWorks([...selectedWorks, id]);
            } catch (error: any) {
                console.log("Error Assigning work: ", error.message);
            }

        } else if (!e.target.checked) {
            const data = {
                workId: id,
                action: "delete",
                date: date,
                siteId: siteId
            }
            try {
                await axios({
                    method: "PUT",
                    url: `http://localhost:4200/assignedworks/${employee_id}/works`,
                    data: data,
                    withCredentials: true
                });
                console.log("Done removing")
                setSelectedWorks(selectedWorks.filter((workid) => workid != id));
            } catch (error: any) {
                console.log("Error Unassigning work: ", error.message);
            }
        }
    }


    const fetchWorks = async () => {
        try {
            const response = await axios.get(`http://localhost:4200/work`);
            setWorks(response.data);
        } catch (error: any) {
            console.log("Error fetching works: ", error.message);
        }

    }
    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            {works && works.map((work) => (
                <Box key={work._id} sx={{ padding: "5px", display: "flex", justifyContent: "left", alignItems: "center", width: "100%" }}>
                    <Checkbox
                        // type="checkbox"
                        id={work._id}
                        value={work._id}
                        name={work.name}
                        checked={selectedWorks.includes(work._id)}
                        onChange={(e) => { manageWorkAssignment(e, work._id) }}
                    />
                    <label htmlFor={work._id}>{work.name}</label>
                </Box>
            ))}
        </Box>
    )
}

export default WorkCheckList;