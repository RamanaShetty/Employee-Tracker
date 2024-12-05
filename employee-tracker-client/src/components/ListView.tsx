import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import {
  tableStyles,
  tableHeaderStyles,
  tableBodyStyles,
  tableHeadStyles,
} from "../styles/employeeStyles";


interface Employee {
  _id: string;
  name: string;
  skill: string;
  mobile: string;
  email: string;
  role: string;
  status: string;
  avatarUrl?: string;
}

interface LoadData {
  isTechnicians: boolean;
  filteredTechnicians: Employee[];
  filteredAdmins: Employee[];
}

const ListView: React.FC<LoadData> = ({
  isTechnicians,
  filteredTechnicians,
  filteredAdmins,
}) => {
  const [clickedRow, setClickedRow] = useState<string | null>(null);

    const handleCopy = (email: string, rowId: string): void => {
        navigator.clipboard.writeText(email);
        setClickedRow(rowId);
        setTimeout(() => {
          setClickedRow(null);
        }, 500);
      };

      
  return (
    <TableContainer sx={{ marginTop: "14px" }} component={Paper}>
      <Table sx={tableStyles}>
        <TableHead sx={tableHeadStyles}>
          <TableRow>
            <TableCell sx={{ ...tableHeaderStyles, textAlign: "center" }}>
              S NO
            </TableCell>
            <TableCell sx={tableHeaderStyles}>Name</TableCell>
            <TableCell sx={tableHeaderStyles}>Skill</TableCell>
            <TableCell sx={tableHeaderStyles}>Mobile Number</TableCell>
            <TableCell sx={tableHeaderStyles}>Email</TableCell>
            {!isTechnicians && (
              <TableCell sx={tableHeaderStyles}>Role</TableCell>
            )}
            <TableCell sx={tableHeaderStyles}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(isTechnicians ? filteredTechnicians : filteredAdmins).map(
            (worker, index) => (
              <TableRow key={index}>
                <TableCell sx={{ ...tableBodyStyles, textAlign: "center" }}>
                  {index + 1}
                </TableCell>
                <TableCell
                  sx={{
                    ...tableBodyStyles,
                    fontWeight: "700",
                    color: "#101828",
                  }}
                >
                  {worker.name}
                </TableCell>
                <TableCell
                  sx={{
                    ...tableBodyStyles,
                    fontWeight: "500",
                    color: "#667085",
                  }}
                >
                  {worker.skill}
                </TableCell>
                <TableCell
                  sx={{
                    ...tableBodyStyles,
                    fontWeight: "500",
                    color: "#667085",
                  }}
                >
                  {worker.mobile}
                </TableCell>
                <TableCell
                  onClick={() => handleCopy(worker.email, worker._id)}
                  sx={{
                    ...tableBodyStyles,
                    fontWeight: "500",
                    color: clickedRow === worker._id ? "#007AFF" : "#667085",
                    cursor: "pointer",
                    transition: "0s",
                  }}
                >
                  {worker.email}
                </TableCell>
                {!isTechnicians && (
                  <TableCell
                    sx={{
                      ...tableBodyStyles,
                      fontWeight: "500",
                      color: "#667085",
                    }}
                  >
                    {worker.role}
                  </TableCell>
                )}
                <TableCell
                  sx={{
                    ...tableBodyStyles,
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.66699 3.33332H3.83366C3.39163 3.33332 2.96771 3.50891 2.65515 3.82147C2.34259 4.13403 2.16699 4.55796 2.16699 4.99999V16.6667C2.16699 17.1087 2.34259 17.5326 2.65515 17.8452C2.96771 18.1577 3.39163 18.3333 3.83366 18.3333H15.5003C15.9424 18.3333 16.3663 18.1577 16.6788 17.8452C16.9914 17.5326 17.167 17.1087 17.167 16.6667V10.8333M15.917 2.08332C16.2485 1.7518 16.6982 1.56555 17.167 1.56555C17.6358 1.56555 18.0855 1.7518 18.417 2.08332C18.7485 2.41484 18.9348 2.86448 18.9348 3.33332C18.9348 3.80216 18.7485 4.2518 18.417 4.58332L10.5003 12.5L7.16699 13.3333L8.00033 9.99999L15.917 2.08332Z"
                      stroke="#344054"
                      stroke-width="1.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListView;