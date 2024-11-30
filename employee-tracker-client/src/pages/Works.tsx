import { Box, Button, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react"
import { addButtonIconStyles, addButtonStyles, searchContainerStyles, searchInputStyles, tableBodyStyles, tableHeaderStyles, tableHeadStyles, tableStyles, tabsContainerStyles, topNavStyles } from "../styles/employeeStyles";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AddWorkModal from "../components/AddWorkModal";

interface Work {
    _id: String,
    name: String,
    description: String,
    site: String,
}

const Works = () => {
    const [ works, setWorks ] = useState<Work[]>([]);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ searchQuery, setSearchQuery ] = useState("");

    useEffect(()=>{
        fetchWorks("http://localhost:4200/work");
    },[])

    const fetchWorks = (endpoint: string) => {
        axios
            .get(endpoint)
            .then((response)=>{
                if(Array.isArray(response.data)){
                    const allWorks = response.data;
                    setWorks(allWorks);
                }else{
                    console.error("Expected an array but received: ", response.data)
                    setWorks([]);
                }
            })
            .catch((error)=>{
                console.error("Error fetching employees: ", error);
                setWorks([]);
            });
    }

    const openModal = (): void => {
        setIsModalOpen(true);
    };

    const closeModal = (): void => {
        setIsModalOpen(false);
    }

    const filteredWorks = works.filter((work)=>work.name.toLowerCase().includes(searchQuery.toLocaleLowerCase()));

    return (
        <Box>
            <Box sx={topNavStyles}>
                <Tabs
                    sx={{...tabsContainerStyles, visibility: "hidden" }}
                    TabIndicatorProps={{
                        style: {
                            display: "none",
                        }
                    }}
                >
                </Tabs>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Button
                        onClick={openModal}
                        sx={addButtonStyles}
                        startIcon={<AddIcon sx={addButtonIconStyles} />}
                    >Work</Button>
                    <Box sx={searchContainerStyles} >
                        <InputBase
                            placeholder="Search by work name."
                            sx={searchInputStyles}
                            value={searchQuery}
                            onChange={(e)=>{setSearchQuery(e.target.value)}}
                        />
                        <SearchIcon />
                    </Box>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table sx={tableStyles} >
                    <TableHead sx={tableHeadStyles} >
                        <TableRow>
                            <TableCell sx={{ ...tableHeaderStyles, textAlign: "center" }} >S NO</TableCell>
                            <TableCell sx={{ ...tableHeaderStyles }} >Work Name</TableCell>
                            <TableCell sx={{ ...tableHeaderStyles }} >Site</TableCell>
                            <TableCell sx={{ ...tableHeaderStyles }} >Description</TableCell>
                            <TableCell sx={{ ...tableHeaderStyles }} >Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { filteredWorks.map((work, index)=>(
                            <TableRow key={index} >
                                <TableCell sx={{ ...tableBodyStyles, textAlign: "center"}} >{ index + 1 }</TableCell>
                                <TableCell sx={{ ...tableBodyStyles, fontWeight: "700", color: "#101828"}} >{ work.name }</TableCell>
                                <TableCell sx={{ ...tableBodyStyles, fontWeight: "500", color: "#667085"}} >{ work.site }</TableCell>
                                <TableCell sx={{ ...tableBodyStyles, fontWeight: "500", color: "#667085"}} >{ work.description }</TableCell>
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
                        )) }
                    </TableBody>
                </Table>
            </TableContainer>

            <AddWorkModal open={isModalOpen} handleClose={closeModal} />
        </Box>
    )
}

export default Works;