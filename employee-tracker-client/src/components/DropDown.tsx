import React, { useState } from 'react'
import {Select, MenuItem} from "@mui/material";
 
export const DropDown = (props:any) => {
    const [task,setTask]=useState(1);
    const UpdateTask=(event:any):void=>{
        const id=props.dailyRecordsId;
        setTask(event.target.value)

    }
  return (
    
    <Select
    
        value={task}
        onChange={UpdateTask}
        sx={{
    //    marginTop:35, 
           
          width: '100px',
          height: '26px',
        }}
      >
        <MenuItem value={1}>unassigned</MenuItem>
        <MenuItem value={2}>task 2</MenuItem>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={4}>4</MenuItem>
        <MenuItem value={5}>5</MenuItem>
      </Select>
  )
}
