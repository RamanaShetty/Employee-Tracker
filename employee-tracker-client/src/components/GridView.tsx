import React from "react"; 
import { Box } from "@mui/material";
import EmployeeCard from "./Card";

interface Employee {
    name: string;
    mobile: string;
    site?: string; 
    avatarUrl?: string; 
    role?:string;
    skill?:string;
  }

interface ViewsData{
    isTechnicians : boolean;
    filteredTechnician: Employee[];
    filteredAdmins: Employee[];
}

const GridView : React.FC<ViewsData> = ({
  isTechnicians,
  filteredTechnician,
  filteredAdmins,
})=>{
    const employees = isTechnicians ? filteredTechnician : filteredAdmins
return(
<Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 2, 
          background:"#fff",
          paddingTop: 3 ,
        }}
      >
        {employees.map((employee, index) => (
          <EmployeeCard
                key={index}
                name={employee.name}
                phone={employee.mobile}
                site={employee.site || "No site assigned"}
                avatarUrl={employee.avatarUrl || ""} 
                skill={employee.skill || "Carpenter"}       
                />
        ))}
      </Box>
)
}

export default GridView;