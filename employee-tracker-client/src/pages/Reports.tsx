import { Box } from "@mui/material"
import "../styles/reports.css";
import Chart from "../components/Chart";
import { useEffect, useState } from "react";
import axios from "axios";




const Report = () => {
    const [ attendanceData, setAttendanceData ] = useState({});
    const [ siteAllocationData, setsiteAllocationData ] = useState({});
    
    async function getReports(){
        try{
            const [response1, response2] = await Promise.all([axios.get('http://localhost:4200/reports/attendance', {withCredentials: true}), axios.get('http://localhost:4200/reports/siteallocation', {withCredentials: true})]);
            setAttendanceData(response1.data);
            setsiteAllocationData(response2.data);
        }catch(error: any){
            console.log("Error fetching the reports: ",error.message);
        }

    }

    useEffect(()=>{
        getReports();
    }, [])
    return (
        <Box sx={{display: "flex", gap:"10px"}}>
            <Box className="chart-box">
                <Box className="chart-heading">Total Attendance</Box>
                <Box className="chart"><Box sx={{ height: "400px", width: "400px", display:"flex", justifyContent:"center"}}><Chart labels={ /*attendanceData.labels*/ ["A", "B", "C"]} data={/*attendanceData.data*/[200, 300, 400]} /></Box></Box>
            </Box>
            <Box className="chart-box">
                <Box className="chart-heading">Site Allocation</Box>
                <Box className="chart"><Box sx={{ height: "400px", width: "400px", display:"flex", justifyContent:"center"}}><Chart labels={/*siteAllocationData.labels*/["Site 1", "Site 2", "Site 3"]} data={/*siteAllocationData.data*/[2000, 600, 200]}/></Box></Box>
            </Box>
        </Box>
    )
}

//sx={{ height: "400px", width: "400px", display:"flex", justifyContent:"center"}}

export default Report;