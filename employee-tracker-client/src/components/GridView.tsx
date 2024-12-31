import React from "react"; 
import { Box } from "@mui/material";
import EmployeeCard from "./Card";

interface Employee {
    _id:string;
    name: string;
    mobile: string;
    // site?: string; 
    email:string;
    profilePhoto?: string; 
    role?:string;
    skill?:string;
  } 

interface ViewsData{
    isTechnicians : boolean;
    filteredTechnician: Employee[];
    filteredAdmins: Employee[];
    onDelete: (id: string) => void;
}

const GridView : React.FC<ViewsData> = ({
  isTechnicians,
  filteredTechnician,
  filteredAdmins,
  onDelete,
})=>{
    const employees = isTechnicians ? filteredTechnician : filteredAdmins
return(
<Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2, 
          background:"#fff",
          paddingTop: 3 ,
        }}
      >
        {employees.map((employee, index) => (
          <EmployeeCard
                key={index}
                _id={employee._id}
                name={employee.name}
                phone={employee.mobile}
                email = {employee.email}
                // site={employee.site || "No site assigned"}
                avatarUrl={employee.profilePhoto || ""} 
                skill={employee.skill || "None"} 
                onDelete={onDelete}      
                />
        ))}
      </Box>
)
}

export default GridView;